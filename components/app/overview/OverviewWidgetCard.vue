<script setup lang="ts">
import type { OverviewWidgetConfig } from "~/types/mock";
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";
import OverviewWidgetRenderer from "~/components/app/overview/OverviewWidgetRenderer.vue";

const props = withDefaults(
  defineProps<{
    widget: OverviewWidgetConfig;
    payload: OverviewWidgetPayload | null;
    variant?: "frame" | "product" | "soft" | "depth";
    padding?: "sm" | "md" | "lg";
    /** When set, overrides default span classes from `widget.size` */
    gridClass?: string;
    /** Short line tied to a related signal (e.g. hero chart) */
    callout?: string | null;
    compact?: boolean;
    tableExpanded?: boolean;
  }>(),
  { callout: null, compact: false, tableExpanded: false },
);

const sizeClass = computed(() => {
  if (props.gridClass) return props.gridClass;
  switch (props.widget.size) {
    case "xs":
      return "col-span-12 sm:col-span-6 lg:col-span-3";
    case "sm":
      return "col-span-12 sm:col-span-6 lg:col-span-4";
    case "lg":
      return "col-span-12 lg:col-span-8";
    case "full":
      return "col-span-12";
    default:
      return "col-span-12 sm:col-span-6 lg:col-span-4";
  }
});

const showDetailToggle = computed(
  () => props.payload?.kind === "table" && (props.payload.rows?.length ?? 0) > 5,
);

defineEmits<{
  "toggle-detail": [];
}>();
</script>

<template>
  <SurfaceCard
    :variant="variant ?? 'frame'"
    :padding="padding ?? (compact ? 'sm' : 'md')"
    class="group h-full min-w-0 max-w-full overflow-hidden"
    :class="sizeClass"
  >
    <div class="min-w-0">
      <h3 class="sv-card-title truncate">
        {{ widget.title }}
      </h3>
      <p
        v-if="callout"
        class="mt-2 border-l-2 border-[rgba(91,123,225,0.45)] pl-3 text-[13px] font-medium leading-snug text-black/70"
      >
        {{ callout }}
      </p>
    </div>

    <div v-if="payload" :class="compact ? 'mt-4' : 'mt-5'">
      <div class="sv-card-divider" :class="compact ? 'mb-4' : 'mb-5'" />
      <OverviewWidgetRenderer
        :payload="payload"
        :compact="compact"
        :table-expanded="tableExpanded"
      />
      <button
        v-if="showDetailToggle"
        type="button"
        class="mt-3 text-[13px] font-semibold text-black/55 hover:text-black"
        @click="$emit('toggle-detail')"
      >
        {{ tableExpanded ? "Show less" : "View details" }}
      </button>
    </div>
    <EmptyState
      v-else
      class="mt-4 border-0 bg-transparent px-0 py-0 text-left"
      title="No data"
      description="Connect sources or widen the date range."
    />
  </SurfaceCard>
</template>
