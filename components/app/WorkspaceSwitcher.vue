<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

const {
  workspaces,
  currentWorkspace,
  setWorkspace,
} = useWorkspaceContext();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (!open.value || !root.value) return;
  if (!root.value.contains(e.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener("click", onDocClick));
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="app-switcher-trigger flex min-h-[3rem] max-w-[14.5rem] items-center gap-3 px-3.5 py-2.5 text-left transition hover:border-black/16"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <span class="min-w-0">
        <span class="sv-control-label block truncate">Workspace</span>
        <span class="block truncate text-[16px] font-semibold text-black">{{ currentWorkspace?.name }}</span>
      </span>
      <ChevronDown class="ml-auto h-4 w-4 shrink-0 text-black/40" :stroke-width="1.9" aria-hidden="true" />
    </button>
    <Transition name="app-pop">
      <ul
        v-show="open"
        class="app-switcher-menu absolute left-0 top-full z-50 mt-2 min-w-full rounded-[1.25rem] border border-black/10 bg-white p-2 shadow-lg"
        role="listbox"
      >
        <li v-for="w in workspaces" :key="w.id">
          <button
            type="button"
            class="flex w-full flex-col rounded-xl px-3 py-2.5 text-left text-[16px] hover:bg-black/[0.03]"
            :class="w.id === currentWorkspace?.id ? 'bg-black/[0.035] font-semibold' : ''"
            role="option"
            @click="setWorkspace(w.id); open = false"
          >
            <span class="text-[1rem] text-black">{{ w.name }}</span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
