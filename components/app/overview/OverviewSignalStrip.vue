<script setup lang="ts">
import type { OverviewInsight } from "~/types/mock";
import { ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  items: OverviewInsight[];
  /** Widget titles keyed for highlight when signal relates to revenue/spend/roi */
  highlightKey?: string | null;
}>();

const emit = defineEmits<{
  pick: [id: string];
}>();

function label(item: OverviewInsight) {
  return item.headline ?? item.title;
}

function dotClass(kind: OverviewInsight["kind"]) {
  if (kind === "risk") return "bg-[rgba(185,28,28,0.85)]";
  if (kind === "opportunity") return "bg-[rgba(22,101,52,0.85)]";
  return "bg-black/35";
}
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
    <span class="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/45">Signals</span>
    <div class="flex min-w-0 flex-wrap gap-2">
      <template v-for="item in items.slice(0, 5)" :key="item.id">
        <NuxtLink
          v-if="item.linkTo"
          :to="item.linkTo"
          class="group inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-left text-[13px] font-semibold tracking-[-0.02em] text-black/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-black/15"
          :class="highlightKey && item.relatedMetric === highlightKey ? 'ring-1 ring-[rgba(91,123,225,0.35)]' : ''"
        >
          <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dotClass(item.kind)" aria-hidden="true" />
          <span class="min-w-0 truncate">{{ label(item) }}</span>
          <ChevronRight class="h-3.5 w-3.5 shrink-0 text-black/30 transition group-hover:text-black/55" :stroke-width="2" />
        </NuxtLink>
        <button
          v-else
          type="button"
          class="group inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-left text-[13px] font-semibold tracking-[-0.02em] text-black/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-black/15"
          :class="highlightKey && item.relatedMetric === highlightKey ? 'ring-1 ring-[rgba(91,123,225,0.35)]' : ''"
          @click="emit('pick', item.id)"
        >
          <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dotClass(item.kind)" aria-hidden="true" />
          <span class="min-w-0 truncate">{{ label(item) }}</span>
          <ChevronRight class="h-3.5 w-3.5 shrink-0 text-black/30 transition group-hover:text-black/55" :stroke-width="2" />
        </button>
      </template>
    </div>
  </div>
</template>
