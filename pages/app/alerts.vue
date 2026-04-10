<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { demoAlertsFallback } from "~/data/alertsFallback";
import type { AlertItem, AlertSeverity, AlertStatus } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Alerts — Solvomo" });

const { alerts: alertsData } = useAppData();

/** Coerce legacy bundle shapes into the current operational model. */
function coerceAlert(raw: Record<string, unknown>): AlertItem {
  const id = String(raw.id ?? "");
  const title = String(raw.title ?? "");
  const summary = String(raw.summary ?? "");
  const createdAt = String(raw.createdAt ?? "");

  let severity = String(raw.severity ?? "medium") as AlertSeverity | string;
  if (severity === "info") severity = "low";
  if (severity === "warning") severity = "medium";
  if (!["critical", "high", "medium", "low"].includes(severity)) severity = "medium";

  let status = String(raw.status ?? "open") as AlertStatus | string;
  if (status === "acknowledged") status = "investigating";
  if (!["open", "investigating", "resolved", "muted"].includes(status)) status = "open";

  const source = raw.source != null ? String(raw.source) : undefined;

  return {
    id,
    title,
    summary,
    severity: severity as AlertSeverity,
    status: status as AlertStatus,
    createdAt,
    source,
  };
}

const alertsSource = computed(() => {
  const raw = alertsData.value.length ? alertsData.value : demoAlertsFallback;
  return raw.map((a) => coerceAlert(a as unknown as Record<string, unknown>));
});

const severityFilter = ref<AlertSeverity | "all">("all");
const statusFilter = ref<AlertStatus | "all">("all");

const selectedId = ref<string | null>(null);

watch(
  alertsSource,
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
  alertsSource.value.filter((a: AlertItem) => {
    if (severityFilter.value !== "all" && a.severity !== severityFilter.value) return false;
    if (statusFilter.value !== "all" && a.status !== statusFilter.value) return false;
    return true;
  }),
);

const selected = computed(() => alertsSource.value.find((a: AlertItem) => a.id === selectedId.value) ?? null);

function severityBadgeVariant(s: AlertSeverity): "danger" | "high" | "warning" | "info" {
  if (s === "critical") return "danger";
  if (s === "high") return "high";
  if (s === "medium") return "warning";
  return "info";
}

function severityLabel(s: AlertSeverity) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusBadgeVariant(s: AlertStatus): "info" | "pending" | "success" | "muted" {
  if (s === "open") return "info";
  if (s === "investigating") return "pending";
  if (s === "resolved") return "success";
  return "muted";
}

function statusLabel(s: AlertStatus) {
  if (s === "open") return "Open";
  if (s === "investigating") return "Investigating";
  if (s === "resolved") return "Resolved";
  return "Muted";
}
</script>

<template>
  <div class="alerts-page max-w-full space-y-5 overflow-x-hidden pb-2">
    <PageHeader title="Alerts" dense metadata-tight hide-context />

    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <AnalyticsMetadataStrip
        :items="[
          { label: 'Open', value: `${alertsSource.filter((a) => a.status === 'open').length}` },
          { label: 'Investigating', value: `${alertsSource.filter((a) => a.status === 'investigating').length}` },
          { label: 'Critical + High', value: `${alertsSource.filter((a) => a.severity === 'critical' || a.severity === 'high').length}` },
          { label: 'Last check', value: 'Live' },
        ]"
      />
    </SurfaceCard>

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:gap-4">
      <div class="min-w-0 space-y-4">
        <FilterBar compact>
          <div class="flex flex-col gap-1.5">
            <label for="alerts-severity" class="sv-section-title">Severity</label>
            <select id="alerts-severity" v-model="severityFilter" class="app-control min-w-[10rem]">
              <option value="all">
                All Severities
              </option>
              <option value="critical">
                Critical
              </option>
              <option value="high">
                High
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="low">
                Low
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="alerts-status" class="sv-section-title">Status</label>
            <select id="alerts-status" v-model="statusFilter" class="app-control min-w-[11rem]">
              <option value="all">
                All Statuses
              </option>
              <option value="open">
                Open
              </option>
              <option value="investigating">
                Investigating
              </option>
              <option value="resolved">
                Resolved
              </option>
              <option value="muted">
                Muted
              </option>
            </select>
          </div>
        </FilterBar>

        <ul class="space-y-3">
          <li v-for="a in filtered" :key="a.id">
            <button
              type="button"
              class="group flex w-full flex-col rounded-[var(--sv-radius-card)] border border-black/[0.08] bg-white p-4 text-left shadow-[var(--sv-shadow-soft)] transition hover:border-black/14 hover:bg-black/[0.015]"
              :class="
                selectedId === a.id
                  ? 'ring-1 ring-[rgba(91,123,225,0.35)] border-[rgba(91,123,225,0.28)] bg-[rgba(91,123,225,0.04)]'
                  : ''
              "
              @click="selectedId = a.id"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-black">
                    {{ a.title }}
                  </p>
                  <p class="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-black/52">
                    {{ a.summary }}
                  </p>
                </div>
                <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <StatusBadge :variant="severityBadgeVariant(a.severity)" :label="severityLabel(a.severity)" />
                  <StatusBadge :variant="statusBadgeVariant(a.status)" :label="statusLabel(a.status)" />
                </div>
              </div>
              <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] pt-3 text-[12px] text-black/45">
                <span>
                  <span class="font-semibold text-black/55">Source</span>
                  <span class="mx-1.5 text-black/25" aria-hidden="true">·</span>
                  {{ a.source ?? "—" }}
                </span>
                <span class="tabular-nums">{{ a.createdAt }}</span>
              </div>
              <div class="mt-3 flex items-center justify-end">
                <span class="inline-flex items-center gap-0.5 text-[12px] font-semibold text-[rgba(91,123,225,0.95)] group-hover:underline">
                  View Details
                  <ChevronRight class="h-3.5 w-3.5 opacity-80" :stroke-width="2.2" aria-hidden="true" />
                </span>
              </div>
            </button>
          </li>
        </ul>

        <SurfaceCard v-if="!filtered.length" variant="soft" padding="sm" class="border border-black/[0.06]">
          <p class="text-[14px] font-semibold text-black">
            No Alerts Match These Filters
          </p>
          <p class="mt-1 text-[13px] text-black/52">
            Try clearing severity or status — demo signals stay available below.
          </p>
        </SurfaceCard>
      </div>

      <aside
        class="alerts-detail surface-frame sticky top-4 hidden max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl lg:flex"
        aria-label="Alert Detail"
      >
        <template v-if="selected">
          <div class="border-b border-black/8 p-5">
            <div class="flex flex-wrap gap-2">
              <StatusBadge :variant="severityBadgeVariant(selected.severity)" :label="severityLabel(selected.severity)" />
              <StatusBadge :variant="statusBadgeVariant(selected.status)" :label="statusLabel(selected.status)" />
            </div>
            <h2 class="sv-card-title mt-4">
              {{ selected.title }}
            </h2>
            <p class="mt-2 text-[13px] text-black/48">
              {{ selected.source ?? "—" }}
            </p>
            <p class="mt-1 text-[12px] tabular-nums text-black/40">
              Detected {{ selected.createdAt }}
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
                Mark Resolved
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
      <div class="flex flex-wrap gap-2">
        <StatusBadge :variant="severityBadgeVariant(selected.severity)" :label="severityLabel(selected.severity)" />
        <StatusBadge :variant="statusBadgeVariant(selected.status)" :label="statusLabel(selected.status)" />
      </div>
      <h2 class="sv-card-title mt-3">
        {{ selected.title }}
      </h2>
      <p class="mt-2 text-[12px] text-black/45">
        {{ selected.source ?? "—" }} · {{ selected.createdAt }}
      </p>
      <p class="mt-3 text-sm text-black/60">
        {{ selected.summary }}
      </p>
      <button type="button" class="button-secondary mt-4 w-full rounded-xl py-2 text-sm font-semibold" @click="selectedId = null">
        Close
      </button>
    </div>
  </div>
</template>
