<script setup lang="ts">
defineProps<{
  /** 0 = goals, 1 = brand, 2 = connect, 3 = ready */
  activeIndex: number;
}>();

const steps = [
  { key: "goals", label: "About your goals", caption: "Shape your command center" },
  { key: "brand", label: "Brand setup", caption: "Scoped to this workspace" },
  { key: "connect", label: "Connect data", caption: "Unlock signals" },
  { key: "ready", label: "Ready", caption: "Open Overview" },
] as const;
</script>

<template>
  <nav class="sv-stepper rounded-2xl border border-black/8 bg-white/95 px-4 py-4 sm:px-6 sm:py-5" aria-label="Onboarding progress">
    <ol class="grid gap-5 sm:grid-cols-4">
      <li
        v-for="(s, i) in steps"
        :key="s.key"
        class="flex gap-3 border-l border-black/6 pl-4 first:border-l-0 first:pl-0 sm:border-l sm:border-black/6 sm:pl-4 sm:first:border-l-0 sm:first:pl-0"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
          :class="
            i < activeIndex
              ? 'border-[rgba(91,123,225,0.35)] bg-[rgba(91,123,225,0.1)] text-[rgba(30,40,90,0.9)]'
              : i === activeIndex
                ? 'border-black bg-black text-white'
                : 'border-black/10 bg-white text-black/35'
          "
        >
          {{ i < activeIndex ? "✓" : i + 1 }}
        </span>
        <div class="min-w-0">
          <p
            class="text-sm font-semibold leading-tight"
            :class="i === activeIndex ? 'text-black' : i < activeIndex ? 'text-black/65' : 'text-black/40'"
          >
            {{ s.label }}
          </p>
          <p class="mt-1 text-xs leading-snug text-black/45">
            {{ s.caption }}
          </p>
        </div>
      </li>
    </ol>
  </nav>
</template>
