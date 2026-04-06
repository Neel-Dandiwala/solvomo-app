<script setup lang="ts">
import { Search } from "lucide-vue-next";

defineProps<{
  compact?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    class="command-search-trigger flex w-full max-w-[16rem] items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-[15px] text-black/62 shadow-sm transition hover:border-black/14 hover:bg-black/[0.02] hover:text-black/78 lg:max-w-[18rem]"
    :class="{ 'max-w-none py-2.5': compact }"
    aria-label="Open command palette (preview)"
  >
    <Search class="h-4 w-4 shrink-0 opacity-60" :stroke-width="1.9" aria-hidden="true" />
    <span class="min-w-0 flex-1 truncate font-medium">Search or jump</span>
    <kbd class="hidden shrink-0 rounded-lg border border-black/10 bg-black/[0.02] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-black/45 sm:inline-block">⌘K</kbd>
  </button>
</template>
