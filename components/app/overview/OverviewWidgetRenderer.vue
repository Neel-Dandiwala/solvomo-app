<script setup lang="ts">
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";

const props = withDefaults(
  defineProps<{
    payload: OverviewWidgetPayload;
    compact?: boolean;
    tableExpanded?: boolean;
  }>(),
  { compact: false, tableExpanded: false },
);

const chartBarAreaClass = computed(() =>
  props.compact ? "flex h-40 items-end gap-2 sm:gap-3" : "flex h-52 items-end gap-3 lg:h-60",
);

const chartLineSvgClass = computed(() =>
  props.compact ? "h-36 w-full overflow-visible sm:h-40" : "h-52 w-full overflow-visible lg:h-60",
);

const tableRowsView = computed(() => {
  if (props.payload.kind !== "table") return [];
  const rows = props.payload.rows;
  return props.tableExpanded ? rows : rows.slice(0, 5);
});

function buildSparkPoints(values: number[]) {
  const w = 100;
  const h = 28;
  return values
    .map((v, i) => {
      const x = values.length === 1 ? w / 2 : (i / (values.length - 1)) * w;
      const y = h - 3 - v * (h - 6);
      return `${x},${y}`;
    })
    .join(" ");
}

const chartMax = computed(() => {
  if (props.payload.kind !== "chart") return 0;
  return Math.max(...props.payload.series.flatMap((series: { values: number[] }) => series.values), 1);
});

const chartTicks = computed(() => {
  if (props.payload.kind !== "chart") return [];
  return [chartMax.value, chartMax.value * 0.66, chartMax.value * 0.33, 0].map((value) => formatScaleValue(value));
});

const donutTotal = computed(() => {
  if (props.payload.kind !== "donut") return 0;
  return props.payload.segments.reduce((sum: number, segment: { value: number }) => sum + segment.value, 0);
});

function colorClass(color: "brand" | "product" | "interaction" | "depth") {
  switch (color) {
    case "brand":
      return "preview-chart-brand";
    case "interaction":
      return "preview-chart-interaction";
    case "depth":
      return "preview-chart-depth";
    default:
      return "preview-chart-product";
  }
}

function colorValue(color: "brand" | "product" | "interaction" | "depth") {
  switch (color) {
    case "brand":
      return "#D88F8D";
    case "interaction":
      return "#5A4FCF";
    case "depth":
      return "#5B7BE1";
    default:
      return "#5FC7D4";
  }
}

function formatScaleValue(value: number) {
  if (value >= 100) return `${Math.round(value)}k`;
  if (value >= 10) return `${value.toFixed(0)}k`;
  if (value > 0) return `${value.toFixed(1)}k`;
  return "0";
}

function segmentShare(value: number) {
  return donutTotal.value ? `${Math.round((value / donutTotal.value) * 100)}%` : "0%";
}

function buildLinePoints(values: number[]) {
  const width = 100;
  const height = 56;
  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (value / chartMax.value) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[]) {
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 56 - (value / chartMax.value) * 56;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  return `${points.join(" ")} L 100 56 L 0 56 Z`;
}

const donutStyle = computed(() => {
  if (props.payload.kind !== "donut") return {};
  const total = props.payload.segments.reduce((sum: number, segment: { value: number }) => sum + segment.value, 0) || 1;
  let cursor = 0;
  const stops = props.payload.segments.map((segment: { value: number; color: "brand" | "product" | "interaction" | "depth" }) => {
    const start = (cursor / total) * 100;
    cursor += segment.value;
    const end = (cursor / total) * 100;
    return `${colorValue(segment.color)} ${start}% ${end}%`;
  });
  return {
    background: `conic-gradient(${stops.join(", ")})`,
  };
});
</script>

<template>
  <div>
    <template v-if="payload.kind === 'kpi'">
      <div class="flex items-start justify-between gap-3">
        <p :class="compact ? 'text-[1.5rem] font-semibold tracking-[-0.04em] text-black' : 'sv-kpi-value'">
          {{ payload.kpi.value }}
        </p>
        <svg
          v-if="payload.sparkline?.length"
          viewBox="0 0 100 28"
          class="h-7 w-[5.5rem] shrink-0 text-[#5B7BE1]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :points="buildSparkPoints(payload.sparkline)"
          />
        </svg>
      </div>
      <div :class="compact ? 'mt-3 flex flex-wrap items-center justify-between gap-2' : 'mt-5 flex flex-wrap items-center justify-between gap-3'">
        <p
          class="inline-flex min-h-[1.75rem] items-center rounded-full border px-2.5 py-0.5 text-[13px] font-semibold tracking-[-0.01em] sm:px-3 sm:py-1 sm:text-[14px]"
          :class="
            payload.kpi.tone === 'positive'
              ? 'border-[rgba(91,123,225,0.14)] bg-[rgba(91,123,225,0.08)] text-[rgba(30,58,138,0.86)]'
              : payload.kpi.tone === 'negative'
                ? 'border-[rgba(239,68,68,0.12)] bg-[rgba(239,68,68,0.06)] text-[rgba(127,29,29,0.86)]'
                : 'border-black/8 bg-black/[0.03] text-black/62'
          "
        >
          {{ payload.kpi.change }}
        </p>
        <p class="max-w-[12rem] text-right text-[12px] text-black/52 sm:text-[14px]">
          {{ payload.kpi.helper }}
        </p>
      </div>
    </template>

    <template v-else-if="payload.kind === 'chart'">
      <template v-if="payload.visualization === 'bar'">
        <div class="sv-chart-panel">
          <div class="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div class="hidden flex-col justify-between pb-8 pt-2 text-[12px] text-black/38 sm:flex">
              <span v-for="tick in chartTicks" :key="tick">{{ tick }}</span>
            </div>
            <div>
              <div :class="chartBarAreaClass">
                <div v-for="(label, index) in payload.labels" :key="label" class="flex min-w-0 flex-1 flex-col items-center gap-3">
                  <div class="flex h-full w-full items-end justify-center gap-1.5 rounded-[1.1rem] bg-black/[0.02] px-1.5 pt-4">
                    <div
                      v-for="series in payload.series"
                      :key="`${label}-${series.label}`"
                      class="w-full rounded-t-[1rem]"
                      :class="colorClass(series.color)"
                      :style="{ height: `${(series.values[index] / chartMax) * 100}%` }"
                    />
                  </div>
                  <span class="text-center text-[13px] font-medium text-black/56">{{ label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="payload.visualization === 'stacked_bar'">
        <div class="space-y-4">
          <div v-for="(label, index) in payload.labels" :key="label" class="sv-chart-panel space-y-3">
            <div class="flex items-center justify-between gap-4">
              <span class="text-[14px] font-semibold text-black/76">{{ label }}</span>
              <span class="text-[14px] font-medium text-black/58">
                {{ formatScaleValue(payload.series.reduce((sum, series) => sum + (series.values[index] ?? 0), 0)) }}
              </span>
            </div>
            <div class="flex h-4 overflow-hidden rounded-full bg-black/[0.05]">
              <div
                v-for="series in payload.series"
                :key="`${label}-${series.label}`"
                :class="colorClass(series.color)"
                :style="{ width: `${(series.values[index] / chartMax) * 100}%` }"
              />
            </div>
            <div class="flex flex-wrap gap-3 text-[13px] text-black/56">
              <div v-for="series in payload.series" :key="series.label" class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorValue(series.color) }" />
                <span>{{ series.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="sv-chart-panel">
          <div class="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div class="hidden flex-col justify-between pb-8 pt-2 text-[12px] text-black/38 sm:flex">
              <span v-for="tick in chartTicks" :key="tick">{{ tick }}</span>
            </div>
            <div class="min-w-0">
              <svg viewBox="0 0 100 64" :class="chartLineSvgClass">
                <line x1="0" y1="14" x2="100" y2="14" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
                <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
                <line x1="0" y1="42" x2="100" y2="42" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
                <line x1="0" y1="56" x2="100" y2="56" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
                <g v-for="series in payload.series" :key="series.label">
                  <path
                    v-if="payload.visualization === 'area' && series === payload.series[0]"
                    :d="buildAreaPath(series.values)"
                    :fill="colorValue(series.color)"
                    opacity="0.14"
                  />
                  <polyline
                    fill="none"
                    :stroke="colorValue(series.color)"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :points="buildLinePoints(series.values)"
                  />
                </g>
              </svg>
              <div class="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-black/58">
                <div v-for="series in payload.series" :key="series.label" class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorValue(series.color) }" />
                  <span class="font-medium">{{ series.label }}</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between gap-4 text-[13px] text-black/52">
                <span v-for="label in payload.labels" :key="label" class="truncate">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <template v-else-if="payload.kind === 'donut'">
      <div class="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-center" :class="compact ? 'lg:gap-4' : 'lg:gap-6'">
        <div
          class="mx-auto flex items-center justify-center rounded-full border border-black/6"
          :class="compact ? 'h-36 w-36' : 'h-44 w-44'"
          :style="donutStyle"
        >
          <div
            class="flex flex-col items-center justify-center rounded-full bg-white"
            :class="compact ? 'h-24 w-24' : 'h-28 w-28'"
          >
            <span class="sv-meta">Total</span>
            <span class="mt-1 text-[1.5rem] font-semibold tracking-[-0.04em] text-black">
              {{ donutTotal }}
            </span>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="segment in payload.segments" :key="segment.label" class="sv-card-inset flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorValue(segment.color) }" />
              <span class="text-[14px] font-medium text-black/72">{{ segment.label }}</span>
            </div>
            <div class="text-right">
              <div class="text-[1rem] font-semibold text-black">{{ segment.value }}</div>
              <div class="text-[12px] text-black/48">{{ segmentShare(segment.value) }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="payload.kind === 'table'">
      <div class="overflow-hidden rounded-[1.25rem] border border-black/8">
        <table class="min-w-full text-left text-[15px]">
          <thead class="bg-black/[0.02]">
            <tr>
              <th v-for="column in payload.columns" :key="column.key" class="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-black/52">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableRowsView" :key="index">
              <td v-for="column in payload.columns" :key="column.key" class="border-t border-black/6 px-5 py-4 text-black/82">
                {{ row[column.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="payload.kind === 'insights'">
      <div class="grid gap-4 lg:grid-cols-2">
        <article
          v-for="item in payload.items"
          :key="item.id"
          class="sv-card-inset rounded-[1.5rem] px-5 py-5"
        >
          <p class="text-[1.02rem] font-semibold tracking-[-0.025em] text-black">
            {{ item.title }}
          </p>
          <p class="mt-3 text-[15px] leading-7 text-black/64">
            {{ item.summary }}
          </p>
          <NuxtLink v-if="item.linkLabel && item.linkTo" :to="item.linkTo" class="nav-link mt-5 inline-flex text-[15px] font-semibold">
            {{ item.linkLabel }}
          </NuxtLink>
        </article>
      </div>
    </template>

    <template v-else-if="payload.kind === 'alerts'">
      <div :class="compact ? 'space-y-2.5' : 'space-y-3.5'">
        <article
          v-for="item in payload.items"
          :key="item.id"
          class="sv-card-inset rounded-2xl px-4 py-3.5"
          :class="compact ? '' : 'rounded-[1.5rem] px-5 py-4.5'"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-[15px] font-semibold tracking-[-0.025em] text-black">
              {{ item.title }}
            </p>
            <span class="shrink-0 text-[12px] text-black/46">{{ item.createdAt }}</span>
          </div>
          <p class="mt-2 text-[13px] leading-6 text-black/64" :class="compact ? '' : 'mt-3 text-[15px] leading-7'">
            {{ item.summary }}
          </p>
        </article>
      </div>
    </template>

    <template v-else-if="payload.kind === 'connections'">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="sv-card-inset rounded-[1.5rem] px-5 py-5">
          <p class="sv-section-title">Connected</p>
          <p class="mt-3 text-[1.85rem] font-semibold tracking-[-0.055em] text-black">{{ payload.summary.connected }}</p>
        </div>
        <div class="sv-card-inset rounded-[1.5rem] px-5 py-5">
          <p class="sv-section-title">Syncing</p>
          <p class="mt-3 text-[1.85rem] font-semibold tracking-[-0.055em] text-black">{{ payload.summary.syncing }}</p>
        </div>
        <div class="sv-card-inset rounded-[1.5rem] px-5 py-5">
          <p class="sv-section-title">Needs attention</p>
          <p class="mt-3 text-[1.85rem] font-semibold tracking-[-0.055em] text-black">{{ payload.summary.attention }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
