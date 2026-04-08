import type { OverviewDashboardConfig, OverviewWidgetConfig } from "~/types/mock";

type PlacementTarget = "top" | "bottom" | "after";
type DashboardTemplate = "executive" | "operator" | "blank";

interface OverviewDashboardState {
  selectedDashboardId: string;
  dashboards: OverviewDashboardConfig[];
  widgets: OverviewWidgetConfig[];
  nextCustomIndex: number;
}

const STORAGE_KEY_PREFIX = "sv-overview-dashboards";

function cloneDashboardState(source: OverviewDashboardState): OverviewDashboardState {
  return {
    selectedDashboardId: source.selectedDashboardId,
    dashboards: source.dashboards.map((dashboard) => ({ ...dashboard, widgetIds: [...dashboard.widgetIds] })),
    widgets: source.widgets.map((widget) => ({ ...widget })),
    nextCustomIndex: source.nextCustomIndex,
  };
}

export function useOverviewDashboards() {
  const auth = useAuth();
  const { overview } = useAppData();

  const stateByUser = useState<Record<string, OverviewDashboardState>>("sv-overview-dashboard-state", () => ({}));
  const restoredKeys = useState<Record<string, boolean>>("sv-overview-dashboard-restored", () => ({}));

  const activeUserId = computed(() => auth.activeUserId.value ?? null);

  function seedFromMock(userId: string) {
    const snapshot = overview.value;
    if (!snapshot) return;

    stateByUser.value[userId] = {
      selectedDashboardId:
        snapshot.dashboards.find((dashboard) => dashboard.isDefault)?.id ??
        snapshot.dashboards[0]?.id ??
        "",
      dashboards: snapshot.dashboards.map((dashboard) => ({ ...dashboard, widgetIds: [...dashboard.widgetIds] })),
      widgets: snapshot.widgets.map((widget) => ({ ...widget })),
      nextCustomIndex: 1,
    };
  }

  function restoreForUser(userId: string) {
    if (!import.meta.client || restoredKeys.value[userId]) return;
    restoredKeys.value[userId] = true;

    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}:${userId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OverviewDashboardState;
        stateByUser.value[userId] = cloneDashboardState(parsed);
        return;
      } catch {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}:${userId}`);
      }
    }

    seedFromMock(userId);
  }

  watchEffect(() => {
    const userId = activeUserId.value;
    if (!userId || !overview.value) return;
    restoreForUser(userId);
    if (!stateByUser.value[userId]) seedFromMock(userId);
  });

  const currentState = computed(() => {
    const userId = activeUserId.value;
    return userId ? stateByUser.value[userId] ?? null : null;
  });

  watch(
    currentState,
    (value) => {
      const userId = activeUserId.value;
      if (!import.meta.client || !userId || !value) return;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}:${userId}`, JSON.stringify(value));
    },
    { deep: true },
  );

  const dashboards = computed(() => currentState.value?.dashboards ?? []);
  const widgets = computed(() => currentState.value?.widgets ?? []);

  const selectedDashboardId = computed({
    get: () => currentState.value?.selectedDashboardId ?? "",
    set: (value: string) => {
      if (!currentState.value) return;
      currentState.value.selectedDashboardId = value;
    },
  });

  const currentDashboard = computed(
    () => dashboards.value.find((dashboard) => dashboard.id === selectedDashboardId.value) ?? dashboards.value[0] ?? null,
  );

  const widgetsById = computed(() =>
    Object.fromEntries(widgets.value.map((widget) => [widget.id, widget])) as Record<string, OverviewWidgetConfig>,
  );

  const currentWidgets = computed(() =>
    currentDashboard.value?.widgetIds
      .map((widgetId) => widgetsById.value[widgetId])
      .filter((widget): widget is OverviewWidgetConfig => Boolean(widget)) ?? [],
  );

  function insertWidgetId(widgetIds: string[], widgetId: string, placement: PlacementTarget, afterWidgetId?: string) {
    if (placement === "top") {
      widgetIds.unshift(widgetId);
      return;
    }
    if (placement === "after" && afterWidgetId) {
      const index = widgetIds.indexOf(afterWidgetId);
      if (index !== -1) {
        widgetIds.splice(index + 1, 0, widgetId);
        return;
      }
    }
    widgetIds.push(widgetId);
  }

  function addWidget(
    widget: Omit<OverviewWidgetConfig, "id">,
    placement: PlacementTarget,
    afterWidgetId?: string,
  ) {
    if (!currentState.value || !currentDashboard.value) return;

    const id = `custom-widget-${currentState.value.nextCustomIndex}`;
    currentState.value.nextCustomIndex += 1;

    const nextWidget: OverviewWidgetConfig = {
      ...widget,
      id,
    };

    currentState.value.widgets.push(nextWidget);
    insertWidgetId(currentDashboard.value.widgetIds, id, placement, afterWidgetId);
  }

  function createDashboard(options: {
    name: string;
    description: string;
    template: DashboardTemplate;
    widgetIds: string[];
  }) {
    if (!currentState.value) return;

    const templateDefaults =
      options.template === "executive"
        ? overview.value?.dashboards.find((dashboard) => dashboard.isDefault)?.widgetIds ?? []
        : options.template === "operator"
          ? overview.value?.dashboards.find((dashboard) => !dashboard.isDefault)?.widgetIds ?? []
          : [];

    const widgetIds = options.widgetIds.length ? options.widgetIds : templateDefaults;
    const dashboardId = `custom-dashboard-${currentState.value.nextCustomIndex}`;

    currentState.value.dashboards.push({
      id: dashboardId,
      name: options.name,
      description: options.description,
      widgetIds: [...widgetIds],
    });
    currentState.value.selectedDashboardId = dashboardId;
  }

  function reorderWidgets(draggedId: string, targetId: string) {
    if (!currentDashboard.value || draggedId === targetId) return;
    const widgetIds = currentDashboard.value.widgetIds;
    const fromIndex = widgetIds.indexOf(draggedId);
    const toIndex = widgetIds.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = widgetIds.splice(fromIndex, 1);
    widgetIds.splice(toIndex, 0, moved!);
  }

  function moveWidget(widgetId: string, direction: "up" | "down") {
    if (!currentDashboard.value) return;
    const widgetIds = currentDashboard.value.widgetIds;
    const index = widgetIds.indexOf(widgetId);
    if (index === -1) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= widgetIds.length) return;
    const [moved] = widgetIds.splice(index, 1);
    widgetIds.splice(nextIndex, 0, moved!);
  }

  function removeWidget(widgetId: string) {
    if (!currentState.value) return;
    currentState.value.dashboards.forEach((dashboard) => {
      dashboard.widgetIds = dashboard.widgetIds.filter((id) => id !== widgetId);
    });
    currentState.value.widgets = currentState.value.widgets.filter((widget) => widget.id !== widgetId);
  }

  function setDashboardWidgetOrder(widgetIds: string[]) {
    if (!currentDashboard.value) return;
    currentDashboard.value.widgetIds = [...widgetIds];
  }

  return {
    dashboards,
    widgets,
    widgetsById,
    selectedDashboardId,
    currentDashboard,
    currentWidgets,
    addWidget,
    createDashboard,
    reorderWidgets,
    moveWidget,
    removeWidget,
    setDashboardWidgetOrder,
  };
}
