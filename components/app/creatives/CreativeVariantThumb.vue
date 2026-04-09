<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Source sheet (3x2 grid). */
    src: string;
    /** Which sheet layout to use (gutters differ slightly). */
    sheet: 1 | 2 | 3;
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

type SheetCuts = {
  w: number;
  h: number;
  x0: number; // left padding trimmed
  x1: number; // start of first internal gutter
  x2: number; // end of first internal gutter
  x3: number; // start of second internal gutter
  x4: number; // end of second internal gutter
  x5: number; // right padding trimmed (inclusive end)
  y0: number; // top padding trimmed
  y1: number; // start of internal gutter
  y2: number; // end of internal gutter
  y3: number; // bottom padding trimmed (inclusive end)
};

const CUTS: Record<1 | 2 | 3, SheetCuts> = {
  // Detected from the actual PNGs (1024x1024) by scanning near-white gutters.
  1: { w: 1024, h: 1024, x0: 9, x1: 335, x2: 348, x3: 676, x4: 688, x5: 1015, y0: 9, y1: 506, y2: 519, y3: 1012 },
  2: { w: 1024, h: 1024, x0: 9, x1: 333, x2: 347, x3: 675, x4: 689, x5: 1014, y0: 9, y1: 508, y2: 522, y3: 1014 },
  3: { w: 1024, h: 1024, x0: 9, x1: 332, x2: 347, x3: 674, x4: 689, x5: 1013, y0: 9, y1: 501, y2: 517, y3: 1014 },
};

const rect = computed(() => {
  const c = CUTS[props.sheet as 1 | 2 | 3];
  const colRanges: Array<[number, number]> = [
    [c.x0, c.x1 - 1],
    [c.x2 + 1, c.x3 - 1],
    [c.x4 + 1, c.x5],
  ];
  const rowRanges: Array<[number, number]> = [
    [c.y0, c.y1 - 1],
    [c.y2 + 1, c.y3],
  ];
  const [xStart, xEnd] = colRanges[col.value]!;
  const [yStart, yEnd] = rowRanges[row.value]!;
  const width = xEnd - xStart + 1;
  const height = yEnd - yStart + 1;
  return { x: xStart, y: yStart, w: width, h: height, sheetW: c.w, sheetH: c.h };
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg border border-black/[0.06] bg-black/[0.03]"
    :class="frameClass"
  >
    <svg
      class="h-full w-full"
      :class="cropClass"
      :viewBox="`${rect.x} ${rect.y} ${rect.w} ${rect.h}`"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      :aria-label="alt"
    >
      <image :href="src" x="0" y="0" :width="rect.sheetW" :height="rect.sheetH" />
    </svg>
  </div>
</template>

