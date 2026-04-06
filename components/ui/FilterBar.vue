<script setup lang="ts">
defineProps<{
  hint?: string;
}>();
</script>

<template>
  <div class="filter-bar surface-soft mb-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-3">
      <slot />
    </div>
    <p v-if="hint" class="max-w-md text-sm leading-relaxed text-black/56">
      {{ hint }}
    </p>
  </div>
</template>
