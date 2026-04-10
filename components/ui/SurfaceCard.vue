<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "frame" | "product" | "soft" | "depth";
    padding?: "none" | "sm" | "md" | "lg";
  }>(),
  { variant: "frame", padding: "md" },
);

const surface = computed(() => {
  switch (props.variant) {
    case "product":
      return "surface-product";
    case "soft":
      return "surface-soft";
    case "depth":
      return "surface-depth";
    default:
      return "surface-frame";
  }
});

const padClass = computed(() => {
  switch (props.padding) {
    case "none":
      return "";
    case "sm":
      return "p-5 sm:p-6";
    case "lg":
      return "p-7 sm:p-8 lg:p-9";
    default:
      return "p-6 sm:p-7";
  }
});
</script>

<template>
  <div :class="[surface, padClass]">
    <slot />
  </div>
</template>
