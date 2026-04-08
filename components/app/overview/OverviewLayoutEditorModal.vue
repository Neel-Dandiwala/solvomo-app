<script setup lang="ts">
import { ArrowDown, ArrowUp, Trash2 } from "lucide-vue-next";
import type { OverviewWidgetConfig } from "~/types/mock";

const props = defineProps<{
  open: boolean;
  widgets: OverviewWidgetConfig[];
}>();

const emit = defineEmits<{
  close: [];
  save: [widgetIds: string[]];
  remove: [id: string];
}>();

const order = ref<string[]>([]);

watch(
  () => [props.open, props.widgets.map((w) => w.id).join("|")] as const,
  () => {
    if (props.open) order.value = props.widgets.map((w) => w.id);
  },
  { immediate: true },
);

const ordered = computed(() =>
  order.value
    .map((id) => props.widgets.find((w) => w.id === id))
    .filter((w): w is OverviewWidgetConfig => Boolean(w)),
);

function move(index: number, dir: -1 | 1) {
  const next = index + dir;
  if (next < 0 || next >= order.value.length) return;
  const copy = [...order.value];
  [copy[index], copy[next]] = [copy[next]!, copy[index]!];
  order.value = copy;
}

function save() {
  emit("save", [...order.value]);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      @click.self="emit('close')"
    >
      <SurfaceCard variant="frame" class="max-h-[85vh] w-full max-w-lg overflow-hidden" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow rounded-full">
              <span class="eyebrow-dot" />
              Layout
            </p>
            <h2 class="mt-3 text-xl font-semibold tracking-tight text-black">
              Widget order
            </h2>
          </div>
          <button type="button" class="nav-link text-sm font-semibold" @click="emit('close')">
            Close
          </button>
        </div>

        <ul class="mt-6 max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto overscroll-y-contain pr-1">
          <li
            v-for="(widget, index) in ordered"
            :key="widget.id"
            class="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-black/[0.02] px-3 py-2.5"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-[14px] font-semibold text-black">
                {{ widget.title }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                class="inline-flex rounded-lg p-2 text-black/45 hover:bg-black/[0.04] hover:text-black"
                aria-label="Move up"
                @click="move(index, -1)"
              >
                <ArrowUp class="h-4 w-4" :stroke-width="1.9" />
              </button>
              <button
                type="button"
                class="inline-flex rounded-lg p-2 text-black/45 hover:bg-black/[0.04] hover:text-black"
                aria-label="Move down"
                @click="move(index, 1)"
              >
                <ArrowDown class="h-4 w-4" :stroke-width="1.9" />
              </button>
              <button
                type="button"
                class="inline-flex rounded-lg p-2 text-black/45 hover:bg-red-50 hover:text-red-700"
                aria-label="Remove widget"
                @click="emit('remove', widget.id)"
              >
                <Trash2 class="h-4 w-4" :stroke-width="1.9" />
              </button>
            </div>
          </li>
        </ul>

        <div class="mt-6 flex flex-wrap justify-end gap-2 border-t border-black/[0.06] pt-5">
          <button type="button" class="app-button button-secondary text-sm" @click="emit('close')">
            Cancel
          </button>
          <button type="button" class="app-button button-primary text-sm" @click="save">
            Save order
          </button>
        </div>
      </SurfaceCard>
    </div>
  </Teleport>
</template>
