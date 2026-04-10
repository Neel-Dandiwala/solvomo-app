<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    /** Two-letter override (e.g. "Me" for Meta). */
    initials?: string;
  }>(),
  { initials: undefined },
);

const display = computed(() => {
  if (props.initials?.trim()) return props.initials.trim().slice(0, 2).toUpperCase();
  const parts = props.name.replace(/[^a-zA-Z0-9\s]/g, " ").trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
  const w = parts[0] ?? "?";
  return w.slice(0, 2).toUpperCase();
});

const hue = computed(() => {
  let h = 0;
  for (let i = 0; i < props.name.length; i += 1) h = (h * 31 + props.name.charCodeAt(i)) >>> 0;
  return 200 + (h % 120);
});
</script>

<template>
  <div
    class="integration-logo flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.08] text-[12px] font-bold tracking-tight text-black/80 shadow-sm"
    :style="{
      background: `linear-gradient(145deg, hsla(${hue}, 42%, 96%, 1) 0%, hsla(${hue}, 35%, 88%, 0.65) 100%)`,
    }"
    aria-hidden="true"
  >
    {{ display }}
  </div>
</template>
