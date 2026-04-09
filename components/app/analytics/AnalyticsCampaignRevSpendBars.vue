<script setup lang="ts">
// @ts-nocheck

const props = defineProps<{
  rows: Array<{ label: string; revenue: number; spend: number }>;
  formatRevenue: (n: number) => string;
  formatSpend: (n: number) => string;
}>();

const chartMax = computed(() =>
  Math.max(1, ...props.rows.flatMap((row) => [row.revenue, row.spend])),
);
</script>

<template>
  <div class="min-w-0 space-y-3">
    <div
      v-for="row in rows"
      :key="row.label"
      class="rounded-lg border border-black/[0.05] bg-black/[0.015] p-3"
    >
      <p class="truncate text-[12px] font-semibold leading-tight text-black/80" :title="row.label">{{ row.label }}</p>
      <div class="mt-2 space-y-2">
        <div class="grid grid-cols-[minmax(0,4.5rem)_1fr_auto] items-center gap-2 sm:grid-cols-[minmax(0,6rem)_1fr_auto] sm:gap-3">
          <span class="text-[10px] font-medium uppercase tracking-wide text-black/45">Revenue</span>
          <div class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              class="h-full rounded-full preview-chart-product"
              :style="{ width: `${(row.revenue / chartMax) * 100}%` }"
            />
          </div>
          <span class="w-[3.25rem] shrink-0 text-right text-[11px] font-semibold tabular-nums text-black/72 sm:text-[12px]">
            {{ formatRevenue(row.revenue) }}
          </span>
        </div>
        <div class="grid grid-cols-[minmax(0,4.5rem)_1fr_auto] items-center gap-2 sm:grid-cols-[minmax(0,6rem)_1fr_auto] sm:gap-3">
          <span class="text-[10px] font-medium uppercase tracking-wide text-black/45">Spend</span>
          <div class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              class="h-full rounded-full preview-chart-depth"
              :style="{ width: `${(row.spend / chartMax) * 100}%` }"
            />
          </div>
          <span class="w-[3.25rem] shrink-0 text-right text-[11px] font-semibold tabular-nums text-black/72 sm:text-[12px]">
            {{ formatSpend(row.spend) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
