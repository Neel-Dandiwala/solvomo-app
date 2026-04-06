<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";

const {
  currentEnvironment,
  environmentsForBrand,
  setEnvironment,
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
      class="app-switcher-trigger flex min-h-[3rem] max-w-[13.25rem] items-center gap-3 px-3.5 py-2.5 text-left transition hover:border-black/16"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <EnvironmentBadge :kind="currentEnvironment?.kind ?? 'production'" class="shrink-0" />
      <span class="min-w-0">
        <span class="sv-control-label block truncate">Environment</span>
        <span class="block truncate text-[15px] font-semibold text-black">{{ currentEnvironment?.name }}</span>
      </span>
      <ChevronDown class="ml-auto h-4 w-4 shrink-0 text-black/40" :stroke-width="1.9" aria-hidden="true" />
    </button>
    <Transition name="app-pop">
      <div
        v-show="open"
        class="app-switcher-menu absolute right-0 top-full z-50 mt-2 w-72 rounded-[1.25rem] border border-black/10 bg-white p-2 shadow-lg"
      >
        <p class="sv-control-label px-3 py-2">
          Environment
        </p>
        <ul role="listbox" class="space-y-0.5">
          <li v-for="env in environmentsForBrand" :key="env.id">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-black/[0.03]"
              :class="env.id === currentEnvironment?.id ? 'bg-black/[0.035]' : ''"
              @click="setEnvironment(env.id); open = false"
            >
              <EnvironmentBadge :kind="env.kind" />
              <span class="min-w-0">
                <span class="block truncate font-medium text-black">{{ env.name }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
