<script setup lang="ts">
// @ts-nocheck

const props = withDefaults(
  defineProps<{
    title: string;
    value: string;
    delta?: string;
    helper?: string;
    tone?: "neutral" | "success" | "warning" | "danger" | "info";
    icon?: unknown;
    badge?: string;
    trend?: number[];
    /** Align with Overview widget cards: tighter padding and rhythm */
    dense?: boolean;
  }>(),
  {
    delta: "",
    helper: "",
    tone: "neutral",
    icon: null,
    badge: "",
    trend: () => [],
    dense: false,
  },
);

const toneClass = computed(() => {
  switch (props.tone) {
    case "success":
      return "border-[rgba(34,197,94,0.16)] bg-[rgba(34,197,94,0.08)] text-[rgb(21,83,45)]";
    case "warning":
      return "border-[rgba(245,158,11,0.18)] bg-[rgba(245,158,11,0.1)] text-[rgb(69,26,3)]";
    case "danger":
      return "border-[rgba(239,68,68,0.14)] bg-[rgba(239,68,68,0.08)] text-[rgb(127,29,29)]";
    case "info":
      return "border-[rgba(91,123,225,0.16)] bg-[rgba(91,123,225,0.08)] text-[rgb(30,58,138)]";
    default:
      return "border-black/8 bg-black/[0.03] text-black/62";
  }
});

const maxTrendValue = computed(() => Math.max(1, ...props.trend));
</script>

<template>
  <SurfaceCard variant="frame" :padding="dense ? 'sm' : 'md'" class="sv-kpi-card min-w-0">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="sv-kpi-label">{{ title }}</p>
        <div :class="dense ? 'mt-3 flex items-end gap-2' : 'mt-5 flex items-end gap-3'">
          <p class="sv-kpi-value tabular-nums">{{ value }}</p>
          <span
            v-if="badge"
            class="inline-flex h-7 items-center rounded-full border border-black/8 bg-black/[0.03] px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/58"
          >
            {{ badge }}
          </span>
        </div>
      </div>
      <div
        v-if="icon"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.025] text-black/62"
      >
        <component :is="icon" class="h-5 w-5" :stroke-width="1.9" />
      </div>
    </div>

    <div
      v-if="trend.length"
      :class="
        dense
          ? 'mt-3 flex h-9 items-end gap-1 rounded-lg border border-black/[0.06] bg-black/[0.02] px-2 py-1.5'
          : 'mt-5 flex h-11 items-end gap-1.5 rounded-[1rem] border border-black/6 bg-black/[0.02] px-2.5 py-2'
      "
    >
      <span
        v-for="(value, index) in trend"
        :key="`${title}-${index}`"
        class="min-w-0 flex-1 rounded-full bg-[linear-gradient(180deg,rgba(95,199,212,0.92),rgba(91,123,225,0.92))]"
        :style="{ height: `${Math.max(14, (value / maxTrendValue) * 100)}%` }"
      />
    </div>

    <div :class="dense ? 'mt-3 flex flex-wrap items-center justify-between gap-2' : 'mt-5 flex flex-wrap items-center justify-between gap-3'">
      <span
        v-if="delta"
        class="inline-flex min-h-[2rem] items-center rounded-full border px-3 py-1 text-[13px] font-semibold tracking-[-0.01em]"
        :class="toneClass"
      >
        {{ delta }}
      </span>
      <p v-if="helper" class="text-[14px] text-black/56">
        {{ helper }}
      </p>
    </div>
  </SurfaceCard>
</template>
