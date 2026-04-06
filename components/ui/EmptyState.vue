<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="empty-state rounded-[1.5rem] border border-dashed border-black/12 bg-black/[0.015] px-6 py-12 text-center sm:px-7 sm:py-14">
    <div v-if="$slots.icon" class="mb-4 flex justify-center text-black/35">
      <slot name="icon" />
    </div>
    <h3 class="text-[1.05rem] font-semibold tracking-[-0.025em] text-black">
      {{ title }}
    </h3>
    <p v-if="description" class="mx-auto mt-3 max-w-md text-[15px] leading-7 text-black/58">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-7 flex flex-wrap justify-center gap-3">
      <slot />
    </div>
  </div>
</template>
