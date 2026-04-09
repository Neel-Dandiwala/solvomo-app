<script setup lang="ts">
withDefaults(
  defineProps<{
    hint?: string;
    /** Tighter margin and padding; baseline-align slot children (filters + controls). */
    compact?: boolean;
  }>(),
  { compact: false },
);
</script>

<template>
  <div
    class="filter-bar surface-soft flex flex-col sm:flex-row sm:justify-between"
    :class="
      compact
        ? 'mb-4 gap-3 p-4 sm:items-end sm:p-4'
        : 'mb-8 gap-4 p-5 sm:items-center sm:p-6'
    "
  >
    <div
      class="flex min-w-0 flex-1 flex-wrap gap-y-3"
      :class="compact ? 'items-end gap-x-6 gap-y-3' : 'items-center gap-3'"
    >
      <slot />
    </div>
    <p v-if="hint" class="max-w-md text-sm leading-relaxed text-black/56">
      {{ hint }}
    </p>
  </div>
</template>
