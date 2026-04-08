<script setup lang="ts">
const props = defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
  /** Tighter spacing for data-dense pages (e.g. Overview). */
  dense?: boolean;
}>();

const { currentBrand, currentEnvironment } = useWorkspaceContext();

const contextLabel = computed(() => props.eyebrow ?? currentBrand.value?.name ?? "Solvomo");
</script>

<template>
  <header class="page-header" :class="dense ? 'mb-6 lg:mb-7' : 'mb-10 lg:mb-12'">
    <div class="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between" :class="dense ? 'gap-5' : 'gap-8'">
      <div class="min-w-0 max-w-4xl">
        <div class="flex flex-wrap items-center gap-3">
          <div class="eyebrow rounded-full">
            <span class="eyebrow-dot" />
            <span class="truncate">{{ contextLabel }}</span>
          </div>
          <EnvironmentBadge v-if="currentEnvironment?.kind" :kind="currentEnvironment.kind" />
        </div>
        <h1 class="sv-page-title" :class="dense ? 'mt-4' : 'mt-6'">
          {{ title }}
        </h1>
        <p v-if="description" class="sv-page-description max-w-3xl" :class="dense ? 'mt-2' : 'mt-4'">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-start gap-3">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </header>
</template>
