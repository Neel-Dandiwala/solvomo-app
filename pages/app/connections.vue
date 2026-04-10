<script setup lang="ts">
import type { ConnectionStatus } from "~/types/app-shell";
import type { MockConnection } from "~/types/mock";

definePageMeta({ layout: "app" });

useHead({ title: "Connections — Solvomo" });

const { connectionsShell, dataStatus } = useAppData();

const items = computed(() =>
  connectionsShell.value.map((c: MockConnection) => ({
    id: c.id,
    name: c.name,
    detail: c.description,
    status: c.status,
  })),
);

const connectedCount = computed(() => items.value.filter((c: { status: ConnectionStatus }) => c.status === "connected").length);
const pendingCount = computed(() => items.value.filter((c: { status: ConnectionStatus }) => c.status === "connecting").length);
const attentionCount = computed(() => items.value.filter((c: { status: ConnectionStatus }) => c.status === "needs_attention").length);

function label(s: ConnectionStatus) {
  switch (s) {
    case "connected":
      return "Connected";
    case "connecting":
      return "Connecting";
    case "needs_attention":
      return "Needs attention";
    default:
      return "Not connected";
  }
}

function variant(s: ConnectionStatus): "success" | "pending" | "warning" | "neutral" {
  if (s === "connected") return "success";
  if (s === "connecting") return "pending";
  if (s === "needs_attention") return "warning";
  return "neutral";
}
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader
      title="Connections"
      dense
      metadata-tight
      hide-context
      description="Workspace-owned connectors. Brand profiles inherit access based on policies you define in Settings."
    >
      <template #actions>
        <button type="button" class="app-button button-secondary min-h-[3rem] px-3 text-sm">
          Add connector
        </button>
      </template>
    </PageHeader>

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,12rem)] lg:gap-4">
      <SurfaceCard variant="soft" padding="md">
        <p class="sv-section-title">
          Connector model
        </p>
        <p class="sv-body-copy mt-4">
          Connections belong to the workspace shell. Access can be shared, but campaign, creative, and outcome views remain scoped to the selected brand profile.
        </p>
      </SurfaceCard>
      <SurfaceCard variant="frame" padding="md">
        <p class="sv-section-title">
          Connected
        </p>
        <p class="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-black">
          {{ connectedCount }}
        </p>
      </SurfaceCard>
      <SurfaceCard variant="frame" padding="md">
        <p class="sv-section-title">
          Syncing
        </p>
        <p class="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-black">
          {{ pendingCount }}
        </p>
      </SurfaceCard>
      <SurfaceCard variant="frame" padding="md">
        <p class="sv-section-title">
          Needs attention
        </p>
        <p class="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-black">
          {{ attentionCount }}
        </p>
      </SurfaceCard>
    </div>

    <div class="grid gap-3 lg:grid-cols-2 lg:gap-4">
      <SurfaceCard v-for="c in items" :key="c.id" variant="frame" class="flex flex-col">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="sv-card-title">
              {{ c.name }}
            </h2>
            <p class="sv-body-copy mt-3">
              {{ c.detail }}
            </p>
          </div>
          <StatusBadge :variant="variant(c.status)" :label="label(c.status)" />
        </div>
        <div class="mt-7 flex flex-wrap gap-3">
          <button
            v-if="c.status === 'not_connected'"
            type="button"
            class="button-primary rounded-2xl px-4 py-3 text-sm font-semibold text-white"
          >
            Connect
          </button>
          <button
            v-else-if="c.status === 'connecting'"
            type="button"
            class="button-secondary rounded-2xl px-4 py-3 text-sm font-semibold opacity-70"
            disabled
          >
            Finishing sync
          </button>
          <button
            v-else-if="c.status === 'connected'"
            type="button"
            class="button-secondary rounded-2xl px-4 py-3 text-sm font-semibold"
          >
            Manage
          </button>
          <button
            v-else
            type="button"
            class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
          >
            Resolve
          </button>
        </div>
      </SurfaceCard>
    </div>
  </div>
</template>
