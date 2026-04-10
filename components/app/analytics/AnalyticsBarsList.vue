<script setup lang="ts">
// @ts-nocheck

const props = withDefaults(
  defineProps<{
    items: Array<{
      label: string;
      value: number;
      valueLabel: string;
      secondary?: string;
      meta?: string;
    }>;
  }>(),
  { items: () => [] },
);

const barItems = computed(() => (Array.isArray(props.items) ? props.items : []));

const maxValue = computed(() =>
  Math.max(1, ...barItems.value.map((item: { value: number }) => item.value)),
);
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="item in barItems"
      :key="item.label"
      class="sv-card-inset rounded-[1.25rem] px-4 py-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-[15px] font-semibold tracking-[-0.02em] text-black">
            {{ item.label }}
          </p>
          <p v-if="item.secondary" class="mt-1 text-[13px] text-black/54">
            {{ item.secondary }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-[15px] font-semibold text-black">{{ item.valueLabel }}</p>
          <p v-if="item.meta" class="mt-1 text-[12px] text-black/46">{{ item.meta }}</p>
        </div>
      </div>
      <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
        <div
          class="h-full rounded-full bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]"
          :style="{ width: `${Math.max(10, (item.value / maxValue) * 100)}%` }"
        />
      </div>
    </div>
  </div>
</template>
