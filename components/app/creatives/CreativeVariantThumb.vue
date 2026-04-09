<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Source sheet (3x2 grid). */
    src: string;
    /** 0-5, left-to-right then top-to-bottom. */
    variant: number;
    alt?: string;
    /** Tailwind classes applied to outer frame. */
    frameClass?: string;
    /** Tailwind classes applied to inner image crop. */
    cropClass?: string;
  }>(),
  {
    alt: "",
    frameClass: "",
    cropClass: "",
  },
);

const col = computed(() => ((props.variant % 6) + 6) % 6 % 3);
const row = computed(() => Math.floor((((props.variant % 6) + 6) % 6) / 3));

// Avoid capturing the sheet gutters by nudging the anchor points inward a hair.
const xStops = ["2%", "50%", "98%"] as const;
const yStops = ["2%", "98%"] as const;

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${props.src})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "300% 200%",
  backgroundPosition: `${xStops[col.value]} ${yStops[row.value]}`,
}));
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg border border-black/[0.06] bg-black/[0.03]"
    :class="frameClass"
  >
    <div class="h-full w-full" :class="cropClass" :style="backgroundStyle" role="img" :aria-label="alt" />
  </div>
</template>

