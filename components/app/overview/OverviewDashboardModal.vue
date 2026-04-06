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
    description: description.value || "Custom Overview dashboard",
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
      <SurfaceCard variant="frame" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto" padding="lg">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow rounded-full">
              <span class="eyebrow-dot" />
              Create dashboard
            </p>
            <h2 class="mt-4 text-[2rem] font-semibold tracking-tight text-black">
              Create a custom Overview dashboard
            </h2>
            <p class="mt-2 text-[16px] leading-relaxed text-black/55">
              Start from an executive template, operator layout, or a blank canvas, then choose the widgets you want loaded by default.
            </p>
          </div>
          <button type="button" class="nav-link text-[16px] font-semibold" @click="emit('close')">
            Close
          </button>
        </div>

        <div class="mt-8 space-y-6">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="block text-[13px] font-bold uppercase tracking-wide text-black/45">Dashboard name</label>
              <input v-model="name" class="auth-input mt-2" type="text" placeholder="Q2 executive view">
            </div>
            <div>
              <label class="block text-[13px] font-bold uppercase tracking-wide text-black/45">Layout template</label>
              <select v-model="template" class="auth-input mt-2">
                <option value="executive">Executive summary</option>
                <option value="operator">Operator cockpit</option>
                <option value="blank">Blank canvas</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[13px] font-bold uppercase tracking-wide text-black/45">Description</label>
            <textarea v-model="description" class="auth-input mt-2 min-h-[6rem] resize-y" placeholder="What this dashboard is for" />
          </div>

          <div>
            <p class="text-[13px] font-bold uppercase tracking-wide text-black/45">
              Default widgets
            </p>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                v-for="widget in widgetOptions"
                :key="widget.id"
                type="button"
                class="rounded-2xl border px-4 py-4 text-left transition"
                :class="
                  widgetIds.includes(widget.id)
                    ? 'border-[var(--sv-product-end)] bg-[rgba(91,123,225,0.06)] shadow-[inset_0_0_0_1px_rgba(91,123,225,0.18)]'
                    : 'border-black/10 hover:border-black/16 hover:bg-black/[0.02]'
                "
                @click="toggleWidget(widget.id)"
              >
                <span class="block text-[16px] font-semibold text-black">{{ widget.title }}</span>
                <span class="mt-2 block text-[15px] leading-relaxed text-black/55">{{ widget.description }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-6">
          <p class="text-[15px] text-black/50">
            Dashboards are stored in local overview state for this demo.
          </p>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="button-secondary rounded-xl px-4 py-2 text-[15px] font-semibold" @click="emit('close')">
              Cancel
            </button>
            <button type="button" class="button-primary rounded-xl px-4 py-2 text-[15px] font-semibold text-white" @click="saveDashboard">
              Save dashboard
            </button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  </Teleport>
</template>
