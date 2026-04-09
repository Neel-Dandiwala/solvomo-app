<script setup lang="ts">
// @ts-nocheck

type ChartSeries = {
  label: string;
  values: number[];
  color?: "product" | "depth" | "brand";
};

const props = withDefaults(
  defineProps<{
    labels: string[];
    series: ChartSeries[];
    valueFormatter?: (value: number) => string;
    variant?: "line" | "area";
    /** Tighter plot + clipping (e.g. Performance timeline vs full-width trend cards). */
    compact?: boolean;
  }>(),
  {
    valueFormatter: (value: number) => `${value}`,
    variant: "line",
    compact: false,
  },
);

const svgPlotClass = computed(() =>
  props.compact
    ? "h-44 w-full overflow-hidden sm:h-52 lg:h-60"
    : "h-60 w-full overflow-visible lg:h-72",
);

const chartMax = computed(() =>
  Math.max(1, ...props.series.flatMap((item: ChartSeries) => item.values)),
);

const chartTicks = computed(() =>
  [chartMax.value, chartMax.value * 0.66, chartMax.value * 0.33, 0],
);

function colorValue(color: ChartSeries["color"]) {
  switch (color) {
    case "brand":
      return "#D88F8D";
    case "depth":
      return "#5B7BE1";
    default:
      return "#5FC7D4";
  }
}

function buildLinePoints(values: number[]) {
  return values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 56 - (value / chartMax.value) * 56;
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
</script>

<template>
  <div class="sv-chart-panel min-h-0 w-full min-w-0">
    <div class="grid items-start gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
      <div class="hidden flex-col gap-1.5 pt-1 text-[12px] text-black/38 sm:flex">
        <span v-for="tick in chartTicks" :key="tick">{{ valueFormatter(tick) }}</span>
      </div>
      <div class="min-h-0 min-w-0">
        <svg viewBox="0 0 100 64" :class="svgPlotClass">
          <line x1="0" y1="14" x2="100" y2="14" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
          <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
          <line x1="0" y1="42" x2="100" y2="42" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
          <line x1="0" y1="56" x2="100" y2="56" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
          <g v-for="(item, index) in series" :key="item.label">
            <path
              v-if="variant === 'area' && index === 0"
              :d="buildAreaPath(item.values)"
              :fill="colorValue(item.color)"
              opacity="0.14"
            />
            <polyline
              fill="none"
              :stroke="colorValue(item.color)"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              :points="buildLinePoints(item.values)"
            />
          </g>
        </svg>
        <div class="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-black/58">
          <div v-for="item in series" :key="item.label" class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: colorValue(item.color) }" />
            <span class="font-medium">{{ item.label }}</span>
          </div>
        </div>
        <div class="mt-4 flex justify-between gap-4 text-[13px] text-black/52">
          <span v-for="label in labels" :key="label" class="truncate">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
