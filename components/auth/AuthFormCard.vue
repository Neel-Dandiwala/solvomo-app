<script>
export default defineNuxtComponent({
  name: "AuthFormCard",
  props: {
    title: { type: String, required: true },
    description: { type: String, default: undefined },
  },
});
</script>

<template>
  <div
    class="surface-frame hero-surface overflow-hidden rounded-[24px] border border-black/10"
  >
    <div
      class="border-b border-black/10 bg-white/80 px-9 py-8 sm:px-12 sm:py-9"
    >
      <p
        class="text-[14px] font-semibold uppercase tracking-[0.16em] text-black/42"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        class="mt-2 text-[17px] leading-relaxed text-black/58 sm:text-[18px]"
      >
        {{ description }}
      </p>
    </div>
    <div class="px-9 py-11 sm:px-12 sm:py-14">
      <slot />
    </div>
  </div>
</template>
