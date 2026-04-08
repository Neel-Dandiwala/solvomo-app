<script setup lang="ts">
import type { OverviewWidgetConfig } from "~/types/mock";

const props = defineProps<{
  open: boolean;
  widgetOptions: OverviewWidgetConfig[];
}>();

const emit = defineEmits<{
  close: [];
  save: [
    payload: {
      name: string;
      description: string;
      template: "executive" | "operator" | "blank";
      widgetIds: string[];
    },
  ];
}>();

const name = ref("");
const description = ref("");
const template = ref<"executive" | "operator" | "blank">("executive");
const widgetIds = ref<string[]>([]);

function toggleWidget(widgetId: string) {
  if (widgetIds.value.includes(widgetId)) {
    widgetIds.value = widgetIds.value.filter((id: string) => id !== widgetId);
  } else {
    widgetIds.value.push(widgetId);
  }
}

function saveDashboard() {
  emit("save", {
    name: name.value || "Custom dashboard",
    description: description.value || "",
    template: template.value,
    widgetIds: [...widgetIds.value],
  });
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      @click.self="emit('close')"
    >
      <SurfaceCard variant="frame" class="max-h-[90vh] w-full max-w-2xl overflow-y-auto" padding="md">
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-lg font-semibold tracking-tight text-black">
            New dashboard
          </h2>
          <button type="button" class="nav-link text-sm font-semibold" @click="emit('close')">
            Close
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-black/45">Name</label>
              <input v-model="name" class="auth-input mt-1.5" type="text" placeholder="Q2 executive">
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-black/45">Template</label>
              <select v-model="template" class="auth-input mt-1.5">
                <option value="executive">Executive</option>
                <option value="operator">Operator</option>
                <option value="blank">Blank</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wide text-black/45">Note (optional)</label>
            <textarea v-model="description" class="auth-input mt-1.5 min-h-[3.5rem] resize-y" />
          </div>

          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-black/45">
              Widgets
            </p>
            <div class="mt-2 grid max-h-[40vh] gap-2 overflow-y-auto overscroll-y-contain sm:grid-cols-2">
              <button
                v-for="widget in widgetOptions"
                :key="widget.id"
                type="button"
                class="rounded-xl border px-3 py-2.5 text-left text-[13px] transition"
                :class="
                  widgetIds.includes(widget.id)
                    ? 'border-[rgba(91,123,225,0.35)] bg-[rgba(91,123,225,0.07)]'
                    : 'border-black/10 hover:border-black/14 hover:bg-black/[0.02]'
                "
                @click="toggleWidget(widget.id)"
              >
                <span class="font-semibold text-black">{{ widget.title }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap justify-end gap-2 border-t border-black/8 pt-4">
          <button type="button" class="button-secondary rounded-lg px-3 py-2 text-sm font-semibold" @click="emit('close')">
            Cancel
          </button>
          <button type="button" class="button-primary rounded-lg px-3 py-2 text-sm font-semibold text-white" @click="saveDashboard">
            Create
          </button>
        </div>
      </SurfaceCard>
    </div>
  </Teleport>
</template>
