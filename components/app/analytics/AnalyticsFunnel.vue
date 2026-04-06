<script setup lang="ts">
// @ts-nocheck

const props = defineProps<{
  items: Array<{
    label: string;
    value: number;
    valueLabel: string;
    note?: string;
  }>;
}>();

const maxValue = computed(() => Math.max(1, ...props.items.map((item: { value: number }) => item.value)));
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="item in items"
      :key="item.label"
      class="sv-card-inset rounded-[1.25rem] px-4 py-4"
    >
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="min-w-0">
          <p class="text-[15px] font-semibold tracking-[-0.02em] text-black">
            {{ item.label }}
          </p>
          <p v-if="item.note" class="mt-1 text-[13px] text-black/54">
            {{ item.note }}
          </p>
        </div>
        <p class="text-[15px] font-semibold text-black">
          {{ item.valueLabel }}
        </p>
      </div>
      <div class="mt-3 h-3 overflow-hidden rounded-full bg-black/[0.05]">
        <div
          class="h-full rounded-full bg-[linear-gradient(90deg,rgba(216,143,141,0.86),rgba(91,123,225,0.92))]"
          :style="{ width: `${Math.max(8, (item.value / maxValue) * 100)}%` }"
        />
      </div>
    </div>
  </div>
</template>
