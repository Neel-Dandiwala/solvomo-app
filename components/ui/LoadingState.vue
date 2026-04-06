<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
  }>(),
  { label: "Loading…" },
);
</script>

<template>
  <div class="loading-state flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-black/8 bg-white px-6 py-14 sm:px-7 sm:py-16">
    <span class="loading-state-spinner h-8 w-8 rounded-full border-2 border-black/10 border-t-[var(--sv-product-end)]" />
    <p class="text-[15px] font-medium text-black/56">
      {{ label }}
    </p>
  </div>
</template>
