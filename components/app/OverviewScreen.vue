<script setup lang="ts">
import OverviewDashboardModal from "~/components/app/overview/OverviewDashboardModal.vue";
import OverviewWidgetBuilderModal from "~/components/app/overview/OverviewWidgetBuilderModal.vue";
import OverviewWidgetCard from "~/components/app/overview/OverviewWidgetCard.vue";
import OverviewWidgetRenderer from "~/components/app/overview/OverviewWidgetRenderer.vue";
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";
import type { OverviewWidgetConfig } from "~/types/mock";

type KpiCard = {
  widget: OverviewWidgetConfig;
  payload: OverviewWidgetPayload;
};

const { currentBrand } = useWorkspaceContext();
const { dataStatus } = useAppData();
const {
  dashboards,
  widgets,
  selectedDashboardId,
  currentDashboard,
  currentWidgets,
  addWidget,
  createDashboard,
  reorderWidgets,
  moveWidget,
  removeWidget,
} = useOverviewDashboards();
const { payloadFor } = useOverviewWidgetPayloads();

const widgetBuilderOpen = ref(false);
const dashboardModalOpen = ref(false);
const editLayout = ref(false);
const selectedRange = ref<4 | 7 | 0>(7);
const draggedWidgetId = ref<string | null>(null);

const rangeOptions = [
  { id: 4, label: "4D" },
  { id: 7, label: "7D" },
  { id: 0, label: "All" },
] as const;

const curatedKpiIds = ["spend", "revenue", "roi", "cac", "pipeline_revenue"] as const;
const primaryPreferredIds = ["w-trend-spend-revenue", "ri-trend", "w-platform-revenue", "w-lead-source"] as const;
const secondaryPreferredIds = ["w-spend-allocation", "w-funnel", "w-alerts", "w-connections"] as const;

const allWidgets = computed(() => currentWidgets.value);
const kpiWidgets = computed(() =>
  curatedKpiIds
    .map((metricId) =>
      allWidgets.value.find((widget: OverviewWidgetConfig) => widget.visualization === "kpi" && widget.metric === metricId),
    )
    .filter((widget): widget is OverviewWidgetConfig => Boolean(widget)),
);

const insightWidget = computed(
  () => allWidgets.value.find((widget: OverviewWidgetConfig) => widget.visualization === "insights") ?? null,
);

function pickWidgets(preferredIds: readonly string[], limit: number, excludeIds: string[] = []) {
  const selected: OverviewWidgetConfig[] = [];
  const available = allWidgets.value.filter(
    (widget: OverviewWidgetConfig) =>
      !excludeIds.includes(widget.id) &&
      widget.visualization !== "kpi" &&
      widget.visualization !== "insights",
  );

  preferredIds.forEach((id) => {
    const match = available.find((widget: OverviewWidgetConfig) => widget.id === id);
    if (match && !selected.some((widget) => widget.id === match.id) && selected.length < limit) selected.push(match);
  });

  for (const widget of available) {
    if (selected.length >= limit) break;
    if (!selected.some((item) => item.id === widget.id)) selected.push(widget);
  }

  return selected;
}

const primaryWidgets = computed(() =>
  pickWidgets(
    primaryPreferredIds,
    3,
    [...kpiWidgets.value.map((widget: OverviewWidgetConfig) => widget.id), insightWidget.value?.id ?? ""],
  ),
);

const secondaryWidgets = computed(() =>
  pickWidgets(
    secondaryPreferredIds,
    3,
    [
      ...kpiWidgets.value.map((widget: OverviewWidgetConfig) => widget.id),
      insightWidget.value?.id ?? "",
      ...primaryWidgets.value.map((widget: OverviewWidgetConfig) => widget.id),
    ],
  ),
);

const overflowWidgets = computed(() =>
  allWidgets.value.filter(
    (widget: OverviewWidgetConfig) =>
      widget.visualization !== "kpi" &&
      widget.visualization !== "insights" &&
      !primaryWidgets.value.some((item: OverviewWidgetConfig) => item.id === widget.id) &&
      !secondaryWidgets.value.some((item: OverviewWidgetConfig) => item.id === widget.id),
  ),
);

const visibleKpiWidgets = computed(() => kpiWidgets.value.slice(0, 4));
const hiddenKpiWidgets = computed(() => kpiWidgets.value.slice(4));
const visibleKpiCards = computed(() =>
  visibleKpiWidgets.value
    .map((widget: OverviewWidgetConfig) => ({ widget, payload: widgetPayload(widget.id) }))
    .filter((card: { widget: OverviewWidgetConfig; payload: OverviewWidgetPayload | null }): card is KpiCard => Boolean(card.payload)),
);
const mainVisualizationWidget = computed(() => primaryWidgets.value[0] ?? secondaryWidgets.value[0] ?? null);
const insightPayload = computed(() => (insightWidget.value ? widgetPayload(insightWidget.value.id) : null));
const supportingWidgets = computed(() =>
  [
    ...primaryWidgets.value.filter((widget: OverviewWidgetConfig) => widget.id !== mainVisualizationWidget.value?.id),
    ...secondaryWidgets.value,
  ].filter(
    (widget: OverviewWidgetConfig, index: number, widgets: OverviewWidgetConfig[]) =>
      widgets.findIndex((candidate: OverviewWidgetConfig) => candidate.id === widget.id) === index,
  ),
);
const leftColumnWidgets = computed(() => supportingWidgets.value.slice(0, 2));
const rightColumnWidgets = computed(() => {
  const leftIds = new Set(leftColumnWidgets.value.map((widget: OverviewWidgetConfig) => widget.id));
  return supportingWidgets.value.filter((widget: OverviewWidgetConfig) => !leftIds.has(widget.id)).slice(0, 3);
});
const belowFoldWidgets = computed(() => {
  const excludedIds = new Set([
    ...visibleKpiWidgets.value.map((widget: OverviewWidgetConfig) => widget.id),
    insightWidget.value?.id ?? "",
    mainVisualizationWidget.value?.id ?? "",
    ...leftColumnWidgets.value.map((widget: OverviewWidgetConfig) => widget.id),
    ...rightColumnWidgets.value.map((widget: OverviewWidgetConfig) => widget.id),
  ]);

  return [...hiddenKpiWidgets.value, ...primaryWidgets.value, ...secondaryWidgets.value, ...overflowWidgets.value].filter(
    (widget: OverviewWidgetConfig, index: number, widgets: OverviewWidgetConfig[]) =>
      !excludedIds.has(widget.id) &&
      widgets.findIndex((candidate: OverviewWidgetConfig) => candidate.id === widget.id) === index,
  );
});

function widgetPayload(widgetId: string) {
  const widget = allWidgets.value.find((item: OverviewWidgetConfig) => item.id === widgetId);
  if (!widget) return null;
  return payloadFor(widget, selectedRange.value);
}

function onDragStart(widgetId: string) {
  draggedWidgetId.value = widgetId;
}

function onDrop(targetId: string) {
  if (!draggedWidgetId.value) return;
  reorderWidgets(draggedWidgetId.value, targetId);
  draggedWidgetId.value = null;
}

function onWidgetSave(payload: {
  widget: Parameters<typeof addWidget>[0];
  placement: Parameters<typeof addWidget>[1];
  afterWidgetId?: string;
}) {
  addWidget(payload.widget, payload.placement, payload.afterWidgetId);
  widgetBuilderOpen.value = false;
}

function onDashboardSave(payload: Parameters<typeof createDashboard>[0]) {
  createDashboard(payload);
  dashboardModalOpen.value = false;
}
</script>

<template>
  <div class="space-y-12 lg:space-y-14">
    <MockDataState :status="dataStatus" />

    <PageHeader
      title="Overview"
      :description="`A clear operating view for ${currentBrand?.name}, built to surface the few metrics, signals, and shifts that need attention now.`"
    >
      <template #actions>
        <div class="flex flex-wrap gap-3 xl:justify-end">
          <select v-model="selectedDashboardId" class="app-control min-w-[12rem]">
            <option v-for="dashboard in dashboards" :key="dashboard.id" :value="dashboard.id">
              {{ dashboard.name }}
            </option>
          </select>
          <select v-model="selectedRange" class="app-control min-w-[7rem]">
            <option v-for="option in rangeOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
          <button type="button" class="app-button button-secondary" @click="editLayout = !editLayout">
            {{ editLayout ? "Done editing" : "Edit layout" }}
          </button>
          <button type="button" class="app-button button-secondary" @click="widgetBuilderOpen = true">
            Add widget
          </button>
        </div>
      </template>
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div class="rounded-[1.5rem] border border-black/8 bg-white/70 px-5 py-4">
          <p class="sv-section-title">Current dashboard</p>
          <p class="mt-2 text-[1rem] font-semibold tracking-[-0.02em] text-black">
            {{ currentDashboard?.name }}
          </p>
          <p v-if="currentDashboard?.description" class="sv-body-copy mt-2 max-w-3xl">
            {{ currentDashboard?.description }}
          </p>
        </div>
        <button type="button" class="nav-link text-[16px] font-semibold" @click="dashboardModalOpen = true">
          Create custom dashboard
        </button>
      </div>
    </PageHeader>

    <section v-if="visibleKpiCards.length" class="space-y-5">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span class="sv-section-kicker">Executive snapshot</span>
          <h2 class="sv-section-heading mt-2">
            Core metrics
          </h2>
        </div>
        <p class="sv-meta">
          Four KPIs above the fold. Everything else moves lower.
        </p>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        <SurfaceCard
          v-for="card in visibleKpiCards"
          :key="card.widget.id"
          variant="frame"
          padding="lg"
          class="sv-kpi-card min-w-0"
        >
          <p class="sv-kpi-label">
            {{ card.widget.title }}
          </p>
          <div class="mt-6">
            <OverviewWidgetRenderer :payload="card.payload" />
          </div>
        </SurfaceCard>
      </div>
    </section>

    <section class="space-y-5">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span class="sv-section-kicker">Signals</span>
          <h2 class="sv-section-heading">
            What’s happening
          </h2>
          <p class="sv-body-copy mt-2 max-w-2xl">
            The clearest shifts, risks, and wins worth acting on now.
          </p>
        </div>
      </div>
      <SurfaceCard variant="soft" padding="lg">
        <OverviewWidgetRenderer
          v-if="insightPayload"
          :payload="insightPayload"
        />
        <EmptyState
          v-else
          class="border-0 bg-transparent px-0 py-0"
          title="No summary insights yet"
          description="Insights will appear here once enough connected data is available."
        />
      </SurfaceCard>
    </section>

    <section
      v-if="!editLayout && (mainVisualizationWidget || leftColumnWidgets.length || rightColumnWidgets.length)"
      class="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_minmax(21rem,0.92fr)]"
    >
      <div class="min-w-0 space-y-6">
        <div>
          <span class="sv-section-kicker">Primary</span>
          <h2 class="sv-section-heading">
            Main performance view
          </h2>
          <p class="sv-body-copy mt-2 max-w-2xl">
            One large chart leads the page, with a small number of supporting views underneath.
          </p>
        </div>
        <OverviewWidgetCard
          v-if="mainVisualizationWidget"
          :widget="mainVisualizationWidget"
          :payload="widgetPayload(mainVisualizationWidget.id)"
          variant="depth"
          padding="lg"
          class="min-h-full"
        />
        <div v-if="leftColumnWidgets.length" class="grid gap-6 xl:grid-cols-2">
          <OverviewWidgetCard
            v-for="widget in leftColumnWidgets"
            :key="widget.id"
            :widget="widget"
            :payload="widgetPayload(widget.id)"
            variant="soft"
            padding="md"
          />
        </div>
      </div>
      <div class="space-y-6">
        <div>
          <span class="sv-section-kicker">Secondary</span>
          <h2 class="sv-section-heading">
            Supporting views
          </h2>
          <p class="sv-body-copy mt-2">
            Alerts, summaries, and secondary breakdowns stay in a tighter rail for faster scanning.
          </p>
        </div>
        <OverviewWidgetCard
          v-for="widget in rightColumnWidgets"
          :key="widget.id"
          :widget="widget"
          :payload="widgetPayload(widget.id)"
          variant="frame"
          padding="md"
        />
      </div>
    </section>

    <section v-else class="grid gap-6 md:grid-cols-6 xl:grid-cols-12">
      <OverviewWidgetCard
        v-for="widget in allWidgets"
        :key="widget.id"
        :widget="widget"
        :payload="widgetPayload(widget.id)"
        :edit-mode="true"
        @move-up="moveWidget($event, 'up')"
        @move-down="moveWidget($event, 'down')"
        @remove="removeWidget"
        @drag-start="onDragStart"
        @drop="onDrop"
      />
    </section>

    <section v-if="!editLayout && belowFoldWidgets.length" class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <div>
          <span class="sv-section-kicker">Below the fold</span>
          <h2 class="sv-section-heading mt-2">
          More context
          </h2>
        </div>
        <button type="button" class="nav-link text-[16px] font-semibold" @click="editLayout = true">
          Edit layout
        </button>
      </div>
      <div class="grid gap-6 md:grid-cols-6 xl:grid-cols-12">
        <OverviewWidgetCard
          v-for="widget in belowFoldWidgets"
          :key="widget.id"
          :widget="widget"
          :payload="widgetPayload(widget.id)"
        />
      </div>
    </section>

    <EmptyState
      v-if="!allWidgets.length"
      class="mt-2"
      title="No widgets in this view"
      description="Add a custom widget to start shaping this dashboard."
    >
      <button type="button" class="app-button button-secondary text-sm" @click="widgetBuilderOpen = true">
        Add widget
      </button>
    </EmptyState>

    <OverviewWidgetBuilderModal
      :open="widgetBuilderOpen"
      :current-widgets="currentWidgets"
      @close="widgetBuilderOpen = false"
      @save="onWidgetSave"
    />

    <OverviewDashboardModal
      :open="dashboardModalOpen"
      :widget-options="widgets"
      @close="dashboardModalOpen = false"
      @save="onDashboardSave"
    />
  </div>
</template>
