<script setup lang="ts">
// @ts-nocheck

const props = defineProps<{
  rows: Array<{ label: string; value: number }>;
  formatValue: (n: number) => string;
}>();

const chartMax = computed(() => Math.max(1, ...props.rows.map((row) => row.value)));
</script>

<template>
  <div class="min-w-0 space-y-2.5">
    <div
      v-for="row in rows"
      :key="row.label"
      class="grid grid-cols-[minmax(0,5.5rem)_1fr] items-center gap-2 sm:grid-cols-[minmax(0,7rem)_1fr] sm:gap-3"
    >
      <span class="truncate text-[11px] font-medium leading-tight text-black/55" :title="row.label">{{ row.label }}</span>
      <div class="flex min-w-0 items-center gap-2">
        <div class="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            class="h-full rounded-full preview-chart-product"
            :style="{ width: `${(row.value / chartMax) * 100}%` }"
          />
        </div>
        <span class="w-11 shrink-0 text-right text-[11px] font-semibold tabular-nums text-black/70 sm:w-12 sm:text-[12px]">
          {{ formatValue(row.value) }}
        </span>
      </div>
    </div>
  </div>
</template>
