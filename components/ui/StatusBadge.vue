<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?:
      | "neutral"
      | "success"
      | "warning"
      | "danger"
      | "info"
      | "pending"
      | "high"
      | "muted";
    label: string;
  }>(),
  { variant: "neutral" },
);
</script>

<template>
  <span
    class="status-badge inline-flex items-center rounded-lg px-2.5 py-1 text-[12px] font-semibold tracking-[0.01em]"
    :class="`status-badge--${variant}`"
  >
    {{ label }}
  </span>
</template>
