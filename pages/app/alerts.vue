<script setup lang="ts">
import type { AlertItem, AlertSeverity } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Alerts — Solvomo" });

const { alerts: alertsData, dataStatus } = useAppData();

const severityFilter = ref<AlertSeverity | "all">("all");
const statusFilter = ref<"all" | "open" | "acknowledged" | "resolved">("all");

const selectedId = ref<string | null>(null);

watch(
  alertsData,
  (list: AlertItem[]) => {
    if (!list.length) {
      selectedId.value = null;
      return;
    }
    if (!selectedId.value || !list.some((a: AlertItem) => a.id === selectedId.value)) {
      selectedId.value = list[0]!.id;
    }
  },
  { immediate: true },
);

const filtered = computed(() =>
  alertsData.value.filter((a: AlertItem) => {
    if (severityFilter.value !== "all" && a.severity !== severityFilter.value) return false;
    if (statusFilter.value !== "all" && a.status !== statusFilter.value) return false;
    return true;
  }),
);

const selected = computed(() => alertsData.value.find((a: AlertItem) => a.id === selectedId.value) ?? null);

function severityBadgeVariant(s: AlertSeverity): "info" | "warning" | "danger" {
  if (s === "critical") return "danger";
  if (s === "warning") return "warning";
  return "info";
}

function statusLabel(s: AlertItem["status"]) {
  if (s === "open") return "Open";
  if (s === "acknowledged") return "Acknowledged";
  return "Resolved";
}

function severityLabel(s: AlertSeverity) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
</script>

<template>
  <div class="alerts-page max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader
      title="Alerts"
      dense
      metadata-tight
      hide-context
      description="Operational signals for this brand profile — what to look at next. Delivery health, connector posture, and spend guardrails."
    />

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:gap-4">
      <div>
        <FilterBar compact>
          <div class="flex flex-col gap-1.5">
            <label for="alerts-severity" class="sv-section-title">Severity</label>
            <select id="alerts-severity" v-model="severityFilter" class="app-control min-w-[10rem]">
              <option value="all">
                All severities
              </option>
              <option value="critical">
                Critical
              </option>
              <option value="warning">
                Warning
              </option>
              <option value="info">
                Info
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="alerts-status" class="sv-section-title">Status</label>
            <select id="alerts-status" v-model="statusFilter" class="app-control min-w-[11rem]">
              <option value="all">
                All statuses
              </option>
              <option value="open">
                Open
              </option>
              <option value="acknowledged">
                Acknowledged
              </option>
              <option value="resolved">
                Resolved
              </option>
            </select>
          </div>
        </FilterBar>

        <ul class="space-y-2">
          <li v-for="a in filtered" :key="a.id">
            <button
              type="button"
              class="w-full rounded-2xl border px-4 py-3 text-left transition"
              :class="
                selectedId === a.id
                  ? 'border-[var(--sv-product-end)] bg-[rgba(91,123,225,0.06)]'
                  : 'border-black/8 hover:border-black/14 hover:bg-black/[0.02]'
              "
              @click="selectedId = a.id"
            >
              <div class="flex flex-wrap items-center gap-2">
                <StatusBadge :variant="severityBadgeVariant(a.severity)" :label="severityLabel(a.severity)" />
                <StatusBadge variant="neutral" :label="statusLabel(a.status)" />
                <span class="text-xs text-black/40">{{ a.createdAt }}</span>
              </div>
              <p class="mt-2 text-sm font-semibold text-black">
                {{ a.title }}
              </p>
              <p class="mt-1 line-clamp-2 text-sm text-black/50">
                {{ a.summary }}
              </p>
            </button>
          </li>
        </ul>
        <EmptyState
          v-if="!filtered.length"
          class="mt-4"
          title="No alerts match filters"
          description="Adjust filters or check back after connectors emit new signals."
        />
      </div>

      <aside
        class="alerts-detail surface-frame sticky top-4 hidden max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl lg:flex"
        aria-label="Alert detail"
      >
        <template v-if="selected">
          <div class="border-b border-black/8 p-5">
            <div class="flex flex-wrap gap-2">
              <StatusBadge :variant="severityBadgeVariant(selected.severity)" :label="severityLabel(selected.severity)" />
              <StatusBadge variant="neutral" :label="statusLabel(selected.status)" />
            </div>
            <h2 class="sv-card-title mt-4">
              {{ selected.title }}
            </h2>
            <p class="mt-1 text-xs text-black/45">
              {{ selected.createdAt }}
            </p>
          </div>
          <div class="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-black/65">
            <p>{{ selected.summary }}</p>
            <p class="mt-4 text-black/45">
              Recommended actions will appear here once playbooks are connected for your workspace.
            </p>
            <div class="mt-6 flex flex-wrap gap-2">
              <button type="button" class="app-button button-secondary min-h-[2.75rem] px-3 text-sm">
                Acknowledge
              </button>
              <button type="button" class="app-button button-primary min-h-[2.75rem] px-3 text-sm text-white">
                Mark resolved
              </button>
            </div>
          </div>
        </template>
        <div v-else class="p-6 text-sm text-black/50">
          Select an alert to view detail.
        </div>
      </aside>
    </div>

    <!-- Mobile detail panel -->
    <div
      v-if="selected"
      class="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-black/10 bg-white p-5 shadow-2xl lg:hidden"
    >
      <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-black/10" />
      <StatusBadge :variant="severityBadgeVariant(selected.severity)" :label="severityLabel(selected.severity)" />
      <h2 class="sv-card-title mt-3">
        {{ selected.title }}
      </h2>
      <p class="mt-3 text-sm text-black/60">
        {{ selected.summary }}
      </p>
      <button type="button" class="button-secondary mt-4 w-full rounded-xl py-2 text-sm font-semibold" @click="selectedId = null">
        Close
      </button>
    </div>
  </div>
</template>
