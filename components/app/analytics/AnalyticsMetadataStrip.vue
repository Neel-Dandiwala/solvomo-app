<script setup lang="ts">
// @ts-nocheck

defineProps<{
  items: Array<{
    label: string;
    value: string;
  }>;
}>();
</script>

<template>
  <div
    class="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-0 xl:divide-x xl:divide-black/[0.06]"
  >
    <div
      v-for="(item, idx) in items"
      :key="item.label"
      class="min-w-0 lg:px-4"
      :class="[idx === 0 && 'lg:pl-0', idx === items.length - 1 && 'lg:pr-0']"
    >
      <p class="sv-section-title">{{ item.label }}</p>
      <p class="mt-1.5 text-[15px] font-semibold tabular-nums tracking-[-0.02em] text-black">
        {{ item.value }}
      </p>
    </div>
  </div>
</template>
