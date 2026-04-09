<script setup lang="ts">
import { LayoutTemplate } from "lucide-vue-next";
import FilterBar from "~/components/ui/FilterBar.vue";
import OverviewDashboardModal from "~/components/app/overview/OverviewDashboardModal.vue";
import OverviewLayoutEditorModal from "~/components/app/overview/OverviewLayoutEditorModal.vue";
import OverviewWidgetBuilderModal from "~/components/app/overview/OverviewWidgetBuilderModal.vue";
import OverviewWidgetCard from "~/components/app/overview/OverviewWidgetCard.vue";
import OverviewWidgetRenderer from "~/components/app/overview/OverviewWidgetRenderer.vue";
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";
import type { OverviewInsight, OverviewWidgetConfig } from "~/types/mock";

type KpiCard = {
  widget: OverviewWidgetConfig;
  payload: OverviewWidgetPayload;
};

/** Hero row: main trend + priority signals only */
const PRIMARY_CHART_ORDER = ["w-trend-spend-revenue", "w-signals-priority"] as const;

const curatedKpiIds = ["spend", "revenue", "roi", "cac", "pipeline_revenue"] as const;

const { dataStatus, overview } = useAppData();
const {
  dashboards,
  widgets,
  selectedDashboardId,
  currentDashboard,
  currentWidgets,
  addWidget,
  createDashboard,
  removeWidget,
  setDashboardWidgetOrder,
} = useOverviewDashboards();
const { payloadFor } = useOverviewWidgetPayloads();

const widgetBuilderOpen = ref(false);
const dashboardModalOpen = ref(false);
const layoutEditorOpen = ref(false);
const selectedRange = ref<4 | 7 | 0>(7);
const tableDetailId = ref<string | null>(null);

const rangeOptions = [
  { id: 4, label: "4 days" },
  { id: 7, label: "7 days" },
  { id: 0, label: "All" },
] as const;

const allWidgets = computed(() => currentWidgets.value);

const executiveKpis = computed(() =>
  curatedKpiIds
    .map((metric) =>
      allWidgets.value.find(
        (w: OverviewWidgetConfig) => w.visualization === "kpi" && w.metric === metric,
      ),
    )
    .filter((w): w is OverviewWidgetConfig => Boolean(w)),
);

const chartWidgets = computed(() =>
  allWidgets.value.filter(
    (w: OverviewWidgetConfig) => w.visualization !== "kpi" && w.visualization !== "insights",
  ),
);

const executiveBullets = computed(() => overview.value?.executiveBullets ?? []);
const insightItems = computed(() => overview.value?.insights ?? []);

const primaryCharts = computed(() => {
  const charts = chartWidgets.value;
  const ordered = PRIMARY_CHART_ORDER.map((id) => charts.find((w) => w.id === id)).filter(
    Boolean,
  ) as OverviewWidgetConfig[];
  if (ordered.length) return ordered;
  const first = charts[0];
  if (!first) return [];
  const hero = first.size === "lg" ? first : charts.find((w) => w.size === "lg") ?? first;
  const rest = charts.filter((w) => w.id !== hero.id).slice(0, 1);
  return [hero, ...rest];
});

const secondaryCharts = computed(() => {
  const ids = new Set(primaryCharts.value.map((w) => w.id));
  return chartWidgets.value.filter((w) => !ids.has(w.id));
});

const heroSignalLinks = computed(() =>
  insightItems.value
    .filter((i: OverviewInsight) => i.linkTo)
    .slice(0, 4)
    .map((i: OverviewInsight) => ({
      label: (i.headline ?? i.title).length > 56 ? `${(i.headline ?? i.title).slice(0, 54)}…` : (i.headline ?? i.title),
      to: i.linkTo!,
    })),
);

const heroRiskLine = computed(
  () => insightItems.value.find((i: OverviewInsight) => i.kind === "risk")?.because ?? null,
);

function widgetCallout(widget: OverviewWidgetConfig): string | null {
  if (widget.id === "w-trend-spend-revenue" || widget.size === "lg") return null;
  const list = insightItems.value;
  if (widget.id === "w-roi-h" || widget.id === "w-roi-platform")
    return list.find((i: OverviewInsight) => i.relatedMetric === "roi")?.because ?? null;
  if (widget.id === "w-funnel-viz" || widget.id === "w-funnel")
    return list.find((i: OverviewInsight) => i.id === "ins-4")?.because ?? null;
  return null;
}

function primaryGridClass(widget: OverviewWidgetConfig, index: number) {
  const list = primaryCharts.value;
  if (list.length === 1) return "col-span-12";
  const first = list[0];
  const hasHero = Boolean(first && (first.id === "w-trend-spend-revenue" || first.size === "lg"));
  if (index === 0 && hasHero) return "col-span-12 xl:col-span-8";
  if (index === 1 && hasHero) return "col-span-12 xl:col-span-4";
  return "col-span-12 md:col-span-6 xl:col-span-4";
}

function gridClassForWidget(widget: OverviewWidgetConfig) {
  if (widget.size === "full") return "col-span-12";
  return "col-span-12 md:col-span-6 xl:col-span-4";
}

function widgetPayload(widgetId: string) {
  const widget = allWidgets.value.find((item: OverviewWidgetConfig) => item.id === widgetId);
  if (!widget) return null;
  return payloadFor(widget, selectedRange.value);
}

const executiveKpiCards = computed(() =>
  executiveKpis.value
    .map((widget: OverviewWidgetConfig) => ({ widget, payload: widgetPayload(widget.id) }))
    .filter((card): card is KpiCard => Boolean(card.payload)),
);

function isHeroWidget(widget: OverviewWidgetConfig) {
  return widget.id === "w-trend-spend-revenue" || widget.size === "lg";
}

function toggleTableDetail(widgetId: string) {
  tableDetailId.value = tableDetailId.value === widgetId ? null : widgetId;
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

function onLayoutSave(ids: string[]) {
  setDashboardWidgetOrder(ids);
  layoutEditorOpen.value = false;
}

const bulletLine = computed(() => executiveBullets.value.slice(0, 3).join(" · "));
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Overview" dense metadata-tight />

    <FilterBar compact>
      <div class="flex min-w-0 flex-col gap-1.5">
        <label for="overview-dashboard" class="sv-section-title">Dashboard</label>
        <select
          id="overview-dashboard"
          v-model="selectedDashboardId"
          class="app-control min-w-0 sm:min-w-[12rem]"
        >
          <option v-for="dashboard in dashboards" :key="dashboard.id" :value="dashboard.id">
            {{ dashboard.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="overview-range" class="sv-section-title">Range</label>
        <select id="overview-range" v-model="selectedRange" class="app-control min-w-[8.5rem]">
          <option v-for="option in rangeOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="app-button button-secondary min-h-[3rem] px-3 text-sm"
          @click="layoutEditorOpen = true"
        >
          Layout
        </button>
        <button
          type="button"
          class="app-button button-secondary min-h-[3rem] px-3 text-sm"
          @click="widgetBuilderOpen = true"
        >
          Add widget
        </button>
        <button
          type="button"
          class="inline-flex min-h-[3rem] shrink-0 items-center gap-2 rounded-[var(--sv-radius-control)] border border-[var(--sv-line)] bg-white px-3.5 text-sm font-semibold text-black/85 shadow-[0_10px_24px_-26px_rgba(15,23,42,0.18)] transition hover:border-black/18 hover:bg-black/[0.02]"
          @click="dashboardModalOpen = true"
        >
          <LayoutTemplate class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
          Custom dashboard
        </button>
      </div>
    </FilterBar>

    <!-- Single operating strip: context + KPIs (no stacked section titles) -->
    <SurfaceCard
      v-if="executiveKpiCards.length || currentDashboard?.name || bulletLine"
      variant="soft"
      padding="sm"
      class="border border-black/[0.05]"
    >
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div class="min-w-0 lg:max-w-[42%]">
          <p class="text-[15px] font-semibold tracking-[-0.02em] text-black">
            {{ currentDashboard?.name ?? "Overview" }}
          </p>
          <p v-if="bulletLine" class="mt-1.5 text-[12px] leading-snug text-black/55">
            {{ bulletLine }}
          </p>
        </div>
        <div
          class="grid min-w-0 flex-1 grid-cols-2 gap-3 border-t border-black/[0.06] pt-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:border-t-0 lg:pt-0 xl:divide-x xl:divide-black/[0.06]"
        >
          <div
            v-for="(card, idx) in executiveKpiCards"
            :key="card.widget.id"
            class="min-w-0 lg:px-4"
            :class="[idx === 0 && 'lg:pl-0', idx === executiveKpiCards.length - 1 && 'lg:pr-0']"
          >
            <p class="sv-section-title">
              {{ card.widget.title }}
            </p>
            <div class="mt-1.5">
              <OverviewWidgetRenderer :payload="card.payload" compact />
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>

    <!-- Primary row (hero + signals) + full dashboard grid -->
    <section v-if="chartWidgets.length" class="grid grid-cols-12 gap-3 lg:gap-4">
      <OverviewWidgetCard
        v-for="(widget, idx) in primaryCharts"
        :key="widget.id"
        :widget="widget"
        :payload="widgetPayload(widget.id)"
        :grid-class="primaryGridClass(widget, idx)"
        :signal-links="isHeroWidget(widget) ? heroSignalLinks : []"
        :risk-line="isHeroWidget(widget) ? heroRiskLine : null"
        :callout="widgetCallout(widget)"
        :compact="!isHeroWidget(widget)"
        :variant="isHeroWidget(widget) ? 'depth' : 'frame'"
        :padding="isHeroWidget(widget) ? 'sm' : 'sm'"
        :table-expanded="tableDetailId === widget.id"
        :title-quiet="!isHeroWidget(widget)"
        :show-divider="true"
        @toggle-detail="toggleTableDetail(widget.id)"
      />
      <OverviewWidgetCard
        v-for="widget in secondaryCharts"
        :key="widget.id"
        :widget="widget"
        :payload="widgetPayload(widget.id)"
        :grid-class="gridClassForWidget(widget)"
        :callout="widgetCallout(widget)"
        compact
        title-quiet
        :table-expanded="tableDetailId === widget.id"
        :show-divider="true"
        @toggle-detail="toggleTableDetail(widget.id)"
      />
    </section>

    <EmptyState
      v-if="!allWidgets.length"
      class="mt-2"
      title="No widgets in this view"
      description="Add a widget to build this dashboard."
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

    <OverviewLayoutEditorModal
      :open="layoutEditorOpen"
      :widgets="currentWidgets"
      @close="layoutEditorOpen = false"
      @save="onLayoutSave"
      @remove="removeWidget"
    />
  </div>
</template>
