<script setup lang="ts">
const { setEnvironmentKind } = useWorkspaceContext();

function switchToProduction() {
  setEnvironmentKind("production");
}
</script>

<template>
  <div
    class="playground-banner surface-product flex flex-wrap items-center justify-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 text-center sm:justify-between sm:text-left"
    role="status"
    aria-live="polite"
  >
    <p class="max-w-4xl text-[16px] font-semibold text-black/80">
      <span class="eyebrow mr-2 rounded-full">
        <span class="eyebrow-dot" />
        Playground
      </span>
      You are in Playground. Changes here are safe for testing until deployed.
    </p>
    <button
      type="button"
      class="button-secondary shrink-0 rounded-lg px-3 py-1.5 text-[14px] font-semibold"
      @click="switchToProduction"
    >
      Switch to production
    </button>
  </div>
</template>
