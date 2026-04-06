<script setup lang="ts">
const props = defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
}>();

const { currentBrand, currentEnvironment } = useWorkspaceContext();

const contextLabel = computed(() => props.eyebrow ?? currentBrand.value?.name ?? "Solvomo");
</script>

<template>
  <header class="page-header mb-10 lg:mb-12">
    <div class="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
      <div class="min-w-0 max-w-4xl">
        <div class="flex flex-wrap items-center gap-3">
          <div class="eyebrow rounded-full">
            <span class="eyebrow-dot" />
            <span class="truncate">{{ contextLabel }}</span>
          </div>
          <EnvironmentBadge v-if="currentEnvironment?.kind" :kind="currentEnvironment.kind" />
        </div>
        <h1 class="sv-page-title mt-6">
          {{ title }}
        </h1>
        <p v-if="description" class="sv-page-description mt-4 max-w-3xl">
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
