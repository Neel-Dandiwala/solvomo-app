<script setup lang="ts">
import {
  OVERVIEW_VISUALIZATION_LABELS,
  OVERVIEW_WIDGET_SOURCE_OPTIONS,
} from "~/data/mock-solvomo";
import type {
  OverviewWidgetConfig,
  OverviewWidgetDimension,
  OverviewWidgetMetric,
  OverviewWidgetSource,
  OverviewWidgetVisualization,
} from "~/types/mock";

const props = defineProps<{
  open: boolean;
  currentWidgets: OverviewWidgetConfig[];
}>();

const emit = defineEmits<{
  close: [];
  save: [
    payload: {
      widget: Omit<OverviewWidgetConfig, "id">;
      placement: "top" | "bottom" | "after";
      afterWidgetId?: string;
    },
  ];
}>();

const source = ref<OverviewWidgetSource>("ad_data");
const metric = ref<OverviewWidgetMetric>("revenue");
const dimension = ref<OverviewWidgetDimension>("platform");
const visualization = ref<OverviewWidgetVisualization>("bar");
const size = ref<OverviewWidgetConfig["size"]>("md");
const placement = ref<"top" | "bottom" | "after">("bottom");
const afterWidgetId = ref("");
const title = ref("");
const description = ref("");

const sourceConfig = computed(() =>
  OVERVIEW_WIDGET_SOURCE_OPTIONS.find((option) => option.id === source.value) ?? OVERVIEW_WIDGET_SOURCE_OPTIONS[0]!,
);

const metricOptions = computed(() => sourceConfig.value.metrics);
const dimensionOptions = computed(() => sourceConfig.value.dimensions);
const visualizationOptions = computed(() => sourceConfig.value.visualizations);
const visualizationLabels = OVERVIEW_VISUALIZATION_LABELS as Record<string, string>;

watch(source, () => {
  metric.value = metricOptions.value[0]!;
  dimension.value = dimensionOptions.value[0]!;
  visualization.value = visualizationOptions.value[0]!;
});

watch(
  [source, metric, dimension, visualization],
  () => {
    if (!title.value) {
      title.value = `${sourceConfig.value.label} — ${metric.value.replaceAll("_", " ")} by ${dimension.value.replaceAll("_", " ")}`;
    }
    if (!description.value) {
      description.value = `${visualizationLabels[visualization.value]} for ${sourceConfig.value.label.toLowerCase()} using ${metric.value.replaceAll("_", " ")} grouped by ${dimension.value.replaceAll("_", " ")}.`;
    }
  },
  { immediate: true },
);

function datasetKeyForSelection() {
  if (visualization.value === "kpi") return "kpis";
  if (source.value === "ad_data" && dimension.value === "campaign_cluster") return "campaignClusters";
  if (source.value === "crm_data" && dimension.value === "lead_source") return "leadSourceSummaries";
  if (source.value === "spend_data") return "spendRecords";
  if (dimension.value === "date") return "trendPoints";
  return "platformSummaries";
}

function saveWidget() {
  emit("save", {
    widget: {
      title: title.value || `${sourceConfig.value.label} widget`,
      description: description.value || sourceConfig.value.description,
      source: source.value,
      visualization: visualization.value,
      datasetKey: datasetKeyForSelection(),
      metric: metric.value,
      dimension: dimension.value,
      size: size.value,
    },
    placement: placement.value,
    afterWidgetId: placement.value === "after" ? afterWidgetId.value : undefined,
  });
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      @click.self="emit('close')"
    >
      <SurfaceCard variant="frame" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow rounded-full">
              <span class="eyebrow-dot" />
              Add custom widget
            </p>
            <h2 class="mt-4 text-2xl font-semibold tracking-tight text-black">
              Build a widget from available data
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-black/55">
              Choose a data source, metric, dimension, and visualization. The builder only exposes combinations that are available in the current demo model.
            </p>
          </div>
          <button type="button" class="nav-link text-sm font-semibold" @click="emit('close')">
            Close
          </button>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div class="space-y-5">
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Data source</label>
                <select v-model="source" class="auth-input mt-2">
                  <option v-for="option in OVERVIEW_WIDGET_SOURCE_OPTIONS" :key="option.id" :value="option.id">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Metric</label>
                <select v-model="metric" class="auth-input mt-2">
                  <option v-for="option in metricOptions" :key="option" :value="option">
                    {{ option.replaceAll("_", " ") }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Dimension</label>
                <select v-model="dimension" class="auth-input mt-2">
                  <option v-for="option in dimensionOptions" :key="option" :value="option">
                    {{ option.replaceAll("_", " ") }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Visualization</label>
                <select v-model="visualization" class="auth-input mt-2">
                  <option v-for="option in visualizationOptions" :key="option" :value="option">
                    {{ visualizationLabels[option] }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Widget size</label>
                <select v-model="size" class="auth-input mt-2">
                  <option value="xs">Compact KPI</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="full">Full width</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Placement</label>
                <select v-model="placement" class="auth-input mt-2">
                  <option value="top">Top of dashboard</option>
                  <option value="bottom">Bottom of dashboard</option>
                  <option value="after">After a widget</option>
                </select>
              </div>
            </div>

            <div v-if="placement === 'after'">
              <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Placement target</label>
              <select v-model="afterWidgetId" class="auth-input mt-2">
                <option disabled value="">
                  Select a widget
                </option>
                <option v-for="widget in currentWidgets" :key="widget.id" :value="widget.id">
                  {{ widget.title }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Widget title</label>
              <input v-model="title" class="auth-input mt-2" type="text">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Description</label>
              <textarea v-model="description" class="auth-input mt-2 min-h-[7rem] resize-y" />
            </div>
          </div>

          <div class="surface-soft rounded-2xl p-5">
            <p class="text-xs font-bold uppercase tracking-wide text-black/45">
              Available fields
            </p>
            <p class="mt-3 text-sm leading-relaxed text-black/58">
              {{ sourceConfig.description }}
            </p>
            <div class="mt-5">
              <p class="text-xs font-bold uppercase tracking-wide text-black/45">Metrics</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="option in metricOptions" :key="option" class="rounded-full border border-black/8 px-3 py-1 text-xs text-black/60">
                  {{ option.replaceAll("_", " ") }}
                </span>
              </div>
            </div>
            <div class="mt-5">
              <p class="text-xs font-bold uppercase tracking-wide text-black/45">Dimensions</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="option in dimensionOptions" :key="option" class="rounded-full border border-black/8 px-3 py-1 text-xs text-black/60">
                  {{ option.replaceAll("_", " ") }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-6">
          <p class="text-sm text-black/50">
            This will be saved to the current dashboard only.
          </p>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold" @click="emit('close')">
              Cancel
            </button>
            <button
              type="button"
              class="button-primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
              :disabled="placement === 'after' && !afterWidgetId"
              @click="saveWidget"
            >
              Add widget
            </button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  </Teleport>
</template>
