<script setup lang="ts">
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-vue-next";
import type { OverviewWidgetConfig } from "~/types/mock";
import type { OverviewWidgetPayload } from "~/composables/useOverviewWidgetPayloads";
import OverviewWidgetRenderer from "~/components/app/overview/OverviewWidgetRenderer.vue";

const props = defineProps<{
  widget: OverviewWidgetConfig;
  payload: OverviewWidgetPayload | null;
  editMode?: boolean;
  variant?: "frame" | "product" | "soft" | "depth";
  padding?: "sm" | "md" | "lg";
}>();

const emit = defineEmits<{
  "move-up": [id: string];
  "move-down": [id: string];
  "remove": [id: string];
  "drag-start": [id: string];
  "drag-over": [id: string];
  "drop": [id: string];
}>();

const sizeClass = computed(() => {
  switch (props.widget.size) {
    case "xs":
      return "md:col-span-3 xl:col-span-2";
    case "sm":
      return "md:col-span-3 xl:col-span-3";
    case "lg":
      return "md:col-span-6 xl:col-span-6";
    case "full":
      return "md:col-span-6 xl:col-span-12";
    default:
      return "md:col-span-3 xl:col-span-4";
  }
});
</script>

<template>
  <SurfaceCard
    :variant="variant ?? 'frame'"
    :padding="padding ?? 'md'"
    class="group h-full min-w-0 overflow-hidden"
    :class="[sizeClass, editMode ? 'cursor-move' : '']"
    :draggable="editMode"
    @dragstart="emit('drag-start', widget.id)"
    @dragover.prevent="emit('drag-over', widget.id)"
    @drop.prevent="emit('drop', widget.id)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2.5">
          <GripVertical
            v-if="editMode"
            class="h-4 w-4 shrink-0 text-black/34"
            :stroke-width="1.9"
            aria-hidden="true"
          />
          <h3 class="sv-card-title truncate">
            {{ widget.title }}
          </h3>
        </div>
        <p v-if="editMode" class="sv-body-copy mt-3 max-w-2xl">
          {{ widget.description }}
        </p>
      </div>
      <div v-if="editMode" class="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          class="inline-flex rounded-xl p-2.5 text-black/48 transition hover:bg-black/[0.03] hover:text-black"
          aria-label="Move widget up"
          @click="emit('move-up', widget.id)"
        >
          <ArrowUp class="h-4 w-4" :stroke-width="1.9" />
        </button>
        <button
          type="button"
          class="inline-flex rounded-xl p-2.5 text-black/48 transition hover:bg-black/[0.03] hover:text-black"
          aria-label="Move widget down"
          @click="emit('move-down', widget.id)"
        >
          <ArrowDown class="h-4 w-4" :stroke-width="1.9" />
        </button>
        <button
          type="button"
          class="inline-flex rounded-xl p-2.5 text-black/48 transition hover:bg-black/[0.03] hover:text-black"
          aria-label="Remove widget"
          @click="emit('remove', widget.id)"
        >
          <Trash2 class="h-4 w-4" :stroke-width="1.9" />
        </button>
      </div>
    </div>

    <div v-if="payload" class="mt-6">
      <div class="sv-card-divider mb-6" />
      <OverviewWidgetRenderer :payload="payload" />
    </div>
    <EmptyState
      v-else
      class="mt-6 border-0 bg-transparent px-0 py-0 text-left"
      title="No data available"
      description="This widget will populate when the selected source and scope have enough data."
    />
  </SurfaceCard>
</template>
