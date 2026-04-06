<script setup lang="ts">
import type { ConnectionStatus } from "~/types/app-shell";
import type { MockConnection } from "~/types/mock";

definePageMeta({ layout: "onboarding" });

useHead({ title: "Onboarding — Connections | Solvomo" });

const auth = useAuth();
const { connectionsOnboarding } = useAppData();
const { resetDraft } = useOnboardingDraft();

const connectedCount = computed(() =>
  connectionsOnboarding.value.filter((c: MockConnection) => c.status === "connected").length,
);

const needsAttentionCount = computed(() =>
  connectionsOnboarding.value.filter((c: MockConnection) => c.status === "needs_attention").length,
);

function statusLabel(s: ConnectionStatus) {
  switch (s) {
    case "not_connected":
      return "Not connected";
    case "connecting":
      return "Connecting";
    case "connected":
      return "Connected";
    case "needs_attention":
      return "Needs attention";
  }
}

function statusVariant(s: ConnectionStatus): "neutral" | "pending" | "success" | "warning" {
  switch (s) {
    case "connected":
      return "success";
    case "connecting":
      return "pending";
    case "needs_attention":
      return "warning";
    default:
      return "neutral";
  }
}

async function enterCommandCenter() {
  auth.completeOnboardingStep("connections");
  resetDraft();
  await navigateTo("/app");
}
</script>

<template>
  <div>
    <OnboardingHero
      eyebrow="Connect data"
      title="Connect your data sources"
      description="Each connection is workspace-owned. Brand profiles inherit access from policies you set, while campaign and insight modeling stays scoped to the selected brand."
    >
      <template #aside>
        <p class="text-xs font-bold uppercase tracking-wide text-black/45">
          Connector posture
        </p>
        <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div class="rounded-xl border border-black/8 bg-white/70 px-3 py-3">
            <p class="text-xs text-black/45">Connected</p>
            <p class="mt-1 text-xl font-semibold text-black">{{ connectedCount }}</p>
          </div>
          <div class="rounded-xl border border-black/8 bg-white/70 px-3 py-3">
            <p class="text-xs text-black/45">Needs attention</p>
            <p class="mt-1 text-xl font-semibold text-black">{{ needsAttentionCount }}</p>
          </div>
        </div>
      </template>
    </OnboardingHero>

    <SurfaceCard v-if="connectionsOnboarding.some((c) => c.status === 'connected')" variant="soft" class="mt-8">
      <p class="text-sm font-semibold text-black">
        You’re on the path to a live command center
      </p>
      <p class="mt-2 text-sm text-black/55">
        Finish remaining sources to populate Performance, Creatives, and Outcomes for this brand profile. Overview stays honest until data is flowing.
      </p>
    </SurfaceCard>

    <div class="mt-10 grid gap-4 sm:grid-cols-2">
      <SurfaceCard v-for="c in connectionsOnboarding" :key="c.id" variant="frame" class="flex flex-col">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold">
              {{ c.name }}
            </h2>
            <p class="mt-2 text-sm text-black/50">
              {{ c.description }}
            </p>
          </div>
          <StatusBadge :variant="statusVariant(c.status)" :label="statusLabel(c.status)" />
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <button
            v-if="c.status === 'not_connected'"
            type="button"
            class="button-primary rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            Connect
          </button>
          <button
            v-else-if="c.status === 'connecting'"
            type="button"
            class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold opacity-70"
            disabled
          >
            In progress
          </button>
          <button
            v-else-if="c.status === 'connected'"
            type="button"
            class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Manage
          </button>
          <button
            v-else
            type="button"
            class="rounded-xl border border-black/12 bg-black/[0.03] px-4 py-2 text-sm font-semibold text-black/80"
          >
            Review file
          </button>
        </div>
      </SurfaceCard>
    </div>

    <div class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-8">
      <div>
        <p class="text-sm text-black/50">
          You can refine sources anytime under <strong class="text-black/70">Connections</strong> in the app.
        </p>
        <NuxtLink to="/onboarding/brand-setup" class="nav-link mt-2 inline-flex text-sm font-semibold">
          Back to brand setup
        </NuxtLink>
      </div>
      <button
        type="button"
        class="button-primary rounded-xl px-6 py-3 text-sm font-semibold text-white"
        @click="enterCommandCenter"
      >
        Enter command center
      </button>
    </div>
  </div>
</template>
