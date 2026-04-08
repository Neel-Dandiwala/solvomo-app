<script setup lang="ts">
import { LayoutTemplate } from "lucide-vue-next";
import OverviewDashboardModal from "~/components/app/overview/OverviewDashboardModal.vue";
import OverviewLayoutEditorModal from "~/components/app/overview/OverviewLayoutEditorModal.vue";
import OverviewWidgetBuilderModal from "~/components/app/overview/OverviewWidgetBuilderModal.vue";
import OverviewWidgetCard from "~/components/app/overview/OverviewWidgetCard.vue";
import OverviewWidgetRenderer from "~/components/app/overview/OverviewWidgetRenderer.vue";
import OverviewSignalStrip from "~/components/app/overview/OverviewSignalStrip.vue";
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";
import type { OverviewInsight, OverviewWidgetConfig } from "~/types/mock";

type KpiCard = {
  widget: OverviewWidgetConfig;
  payload: OverviewWidgetPayload;
};

const WIDGET_GRID: Record<string, string> = {
  "w-trend-spend-revenue": "col-span-12 xl:col-span-8",
  "w-alerts": "col-span-12 xl:col-span-4",
  "w-platform-revenue": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-roi-platform": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-funnel": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-revenue-trend": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-conversion-trend": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-lead-source": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-roi-cluster": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-creatives-leaderboard": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-performance-changes": "col-span-12 sm:col-span-6 xl:col-span-4",
  "w-spend-allocation": "col-span-12 sm:col-span-6 xl:col-span-6",
  "w-connections": "col-span-12 sm:col-span-6 xl:col-span-6",
  "ri-trend": "col-span-12 xl:col-span-8",
  "ri-connections": "col-span-12 sm:col-span-6 xl:col-span-6",
};

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
  { id: 4, label: "4D" },
  { id: 7, label: "7D" },
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

const heroCallout = computed(() => {
  const list = insightItems.value;
  const risk = list.find((i: OverviewInsight) => i.kind === "risk" && i.because);
  if (risk?.because) return risk.because;
  return list.find((i: OverviewInsight) => i.because)?.because ?? null;
});

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

function gridClassFor(widget: OverviewWidgetConfig) {
  return WIDGET_GRID[widget.id] ?? "col-span-12 sm:col-span-6 xl:col-span-4";
}

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
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2 lg:space-y-6">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Overview" dense>
      <template #actions>
        <div class="flex w-full min-w-0 flex-wrap items-center gap-2 sm:gap-3 xl:max-w-none xl:justify-end">
          <select v-model="selectedDashboardId" class="app-control min-w-0 flex-1 sm:min-w-[11rem] sm:flex-none">
            <option v-for="dashboard in dashboards" :key="dashboard.id" :value="dashboard.id">
              {{ dashboard.name }}
            </option>
          </select>
          <select v-model="selectedRange" class="app-control min-w-[6.5rem]">
            <option v-for="option in rangeOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
          <button type="button" class="app-button button-secondary h-10 px-3 text-sm" @click="layoutEditorOpen = true">
            Edit layout
          </button>
          <button type="button" class="app-button button-secondary h-10 px-3 text-sm" @click="widgetBuilderOpen = true">
            Add widget
          </button>
          <button
            type="button"
            class="inline-flex h-10 shrink-0 items-center gap-2 rounded-[var(--sv-radius-control,0.75rem)] border border-black/[0.1] bg-white px-3 text-sm font-semibold text-black/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-black/18 hover:bg-black/[0.02]"
            @click="dashboardModalOpen = true"
          >
            <LayoutTemplate class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
            Custom dashboard
          </button>
        </div>
      </template>
    </PageHeader>

    <p v-if="currentDashboard?.name" class="text-[13px] font-medium text-black/50">
      {{ currentDashboard.name }}
    </p>

    <!-- Executive snapshot -->
    <section v-if="executiveKpiCards.length" class="space-y-3">
      <h2 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">
        Executive snapshot
      </h2>
      <div class="grid grid-cols-12 gap-4 lg:grid-cols-5">
      <SurfaceCard
        v-for="card in executiveKpiCards"
        :key="card.widget.id"
        variant="frame"
        padding="sm"
        class="col-span-12 min-w-0 sm:col-span-6 lg:col-span-1"
      >
        <p class="sv-kpi-label">
          {{ card.widget.title }}
        </p>
        <div class="mt-3">
          <OverviewWidgetRenderer :payload="card.payload" compact />
        </div>
      </SurfaceCard>
      </div>
    </section>

    <section v-if="executiveBullets.length" class="grid grid-cols-12 gap-4">
      <ul class="col-span-12 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-1">
        <li
          v-for="(line, idx) in executiveBullets.slice(0, 3)"
          :key="idx"
          class="flex gap-2 text-[13px] font-medium leading-snug text-black/72"
        >
          <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-black/35" aria-hidden="true" />
          {{ line }}
        </li>
      </ul>
    </section>

    <!-- Signals + charts -->
    <section v-if="chartWidgets.length" class="grid grid-cols-12 gap-4">
      <div v-if="insightItems.length" class="col-span-12 rounded-2xl border border-black/[0.06] bg-white/80 px-4 py-3">
        <OverviewSignalStrip :items="insightItems" />
      </div>

      <OverviewWidgetCard
        v-for="widget in chartWidgets"
        :key="widget.id"
        :widget="widget"
        :payload="widgetPayload(widget.id)"
        :grid-class="gridClassFor(widget)"
        :callout="widget.id === 'w-trend-spend-revenue' ? heroCallout : null"
        :compact="!isHeroWidget(widget)"
        :variant="isHeroWidget(widget) ? 'depth' : 'frame'"
        :padding="isHeroWidget(widget) ? 'md' : 'sm'"
        :table-expanded="tableDetailId === widget.id"
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
