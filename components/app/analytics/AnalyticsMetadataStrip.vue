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
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="item in items"
      :key="item.label"
      class="sv-card-inset rounded-[1.25rem] px-4 py-3.5"
    >
      <p class="sv-section-title">{{ item.label }}</p>
      <p class="mt-2 text-[0.98rem] font-semibold tracking-[-0.02em] text-black">
        {{ item.value }}
      </p>
    </div>
  </div>
</template>
