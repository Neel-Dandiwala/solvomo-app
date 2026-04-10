<script setup lang="ts">
// @ts-nocheck
import { CalendarRange, Download } from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";
import {
  crmConversionTrend,
  crmConversionTrendLatest,
  crmDealStatusMix,
  crmExecutive,
  crmKpiTrends,
  crmLeadSources,
  crmOpportunityLedger,
  crmPipelineByStage,
  crmRecentAlerts,
  crmRepPerformance,
  crmReportingStrip,
  crmStaleDeals,
  crmTopOpportunities,
} from "~/data/crmPageData";

definePageMeta({ layout: "app" });

useHead({ title: "CRM — Solvomo" });

const {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} = useDemoAnalytics();

const selectedAttribution = ref("Hybrid multi-touch");
const selectedRange = ref("Last 8 weeks");

const metadataItems = computed(() => [
  { label: "Last synced", value: crmReportingStrip.lastSynced },
  { label: "Compared", value: crmReportingStrip.comparisonLabel },
  { label: "Scope", value: crmReportingStrip.attribution },
]);

const topKpis = computed(() => [
  {
    title: "Total Leads",
    value: formatCompactNumber(crmExecutive.totalLeads),
    delta: "+12.4%",
    helper: "Inbound + paid",
    tone: "info" as const,
    trend: [...crmKpiTrends.leads],
  },
  {
    title: "Qualified Leads",
    value: formatCompactNumber(crmExecutive.qualifiedLeads),
    delta: "+8.1%",
    helper: "SQL-ready",
    tone: "success" as const,
    trend: [...crmKpiTrends.qualified],
  },
  {
    title: "Pipeline Value",
    value: formatCompactCurrency(crmExecutive.pipelineValue),
    delta: "+6.2%",
    helper: "Open opportunities",
    tone: "info" as const,
    trend: [...crmKpiTrends.pipeline],
  },
  {
    title: "Closed Won",
    value: formatCompactCurrency(crmExecutive.closedWon),
    delta: "+14.0%",
    helper: "Attributed revenue",
    tone: "success" as const,
    trend: [...crmKpiTrends.closed],
  },
  {
    title: "Avg Deal Size",
    value: formatCurrency(crmExecutive.avgDealSize, 0),
    delta: "+3.6%",
    helper: "Won deals",
    tone: "neutral" as const,
    trend: [...crmKpiTrends.avgDeal],
  },
]);

const secondaryKpis = computed(() => [
  {
    title: "Sales Velocity",
    value: `${crmExecutive.salesVelocityDays} days`,
    delta: "−2d vs Q1",
    helper: "Opportunity → close",
    tone: "success" as const,
    trend: [32, 31, 30, 29, 29, 28, 28, 28],
  },
  {
    title: "Lead → Opp Conversion",
    value: formatPercent(crmExecutive.leadToOppPct, 1),
    delta: "+1.2 pts",
    helper: "Rolling 8 weeks",
    tone: "info" as const,
    trend: crmConversionTrend.map((w) => w.leadToOppPct * 10),
  },
]);

const pipelineStageBars = computed(() => {
  const max = Math.max(1, ...crmPipelineByStage.map((s) => s.amount));
  return crmPipelineByStage.map((s) => ({
    label: s.stage,
    value: s.amount,
    valueLabel: formatCompactCurrency(s.amount),
    secondary: `${s.deals} deals`,
    meta: `${formatPercent((s.amount / crmExecutive.pipelineValue) * 100, 0)} of pipe`,
  }));
});

const pipelineBarsMax = computed(() =>
  Math.max(1, ...crmPipelineByStage.map((s) => s.amount)),
);

const leadSourceSegments = computed(() => {
  const total = crmLeadSources.reduce((t, s) => t + s.leads, 0) || 1;
  return crmLeadSources.map((s) => ({
    label: s.source,
    value: s.leads,
    valueLabel: formatCompactNumber(s.leads),
    tone: "neutral" as const,
  }));
});

const conversionLineSeries = computed(() => [
  {
    label: "Lead → opp %",
    values: crmConversionTrend.map((w) => w.leadToOppPct),
    color: "depth" as const,
  },
  {
    label: "SQL → opp %",
    values: crmConversionTrend.map((w) => w.sqlToOppPct),
    color: "product" as const,
  },
]);

const dealStatusSegments = computed(() =>
  crmDealStatusMix.map((d) => ({
    label: d.label,
    value: d.value,
    valueLabel: `${formatCompactNumber(d.value)} opps · ${d.pct}%`,
    tone: d.tone,
  })),
);

const ledgerColumns: DataTableColumn[] = [
  { key: "opportunity", label: "Opportunity" },
  { key: "account", label: "Account" },
  { key: "stage", label: "Stage" },
  { key: "owner", label: "Owner" },
  { key: "amount", label: "Amount" },
  { key: "nextStep", label: "Next step" },
  { key: "lastTouch", label: "Last touch" },
];

const ledgerRows = computed(() =>
  crmOpportunityLedger.map((row) => ({
    id: row.id,
    opportunity: row.opportunity,
    account: row.account,
    stage: row.stage,
    owner: row.owner,
    amount: formatCompactCurrency(row.amount),
    nextStep: row.nextStep,
    lastTouch: row.lastTouch,
  })),
);

function healthVariant(h: "good" | "watch" | "risk"): "success" | "warning" | "danger" {
  if (h === "good") return "success";
  if (h === "watch") return "warning";
  return "danger";
}

function healthLabel(h: "good" | "watch" | "risk") {
  if (h === "good") return "On track";
  if (h === "watch") return "Watch";
  return "At risk";
}

function alertSeverityVariant(s: "warning" | "info" | "success"): "warning" | "info" | "success" {
  return s;
}

function alertSeverityLabel(s: "warning" | "info" | "success") {
  if (s === "warning") return "Warning";
  if (s === "success") return "Positive";
  return "Info";
}
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <PageHeader
      title="CRM"
      dense
      metadata-tight
      hide-context
      description="Pipeline health, source quality, and revenue outcomes connected to paid programs and attribution."
    />

    <FilterBar compact>
      <div class="flex min-w-0 flex-col gap-1.5">
        <span class="sv-section-title">Period</span>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="option in ['Last 8 weeks', 'Last 30 days', 'Quarter to date']"
            :key="option"
            type="button"
            class="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="selectedRange === option ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/60'"
            @click="selectedRange = option"
          >
            <CalendarRange class="h-4 w-4 shrink-0 text-black/55" :stroke-width="1.9" />
            {{ option }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="crm-attribution" class="sv-section-title">Attribution</label>
        <select id="crm-attribution" v-model="selectedAttribution" class="app-control min-w-[12rem]">
          <option>Hybrid multi-touch</option>
          <option>Last non-direct</option>
          <option>First touch</option>
        </select>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex min-h-[3rem] shrink-0 items-center gap-2 rounded-[var(--sv-radius-control)] border border-[var(--sv-line)] bg-white px-3.5 text-sm font-semibold text-black/85 shadow-[0_10px_24px_-26px_rgba(15,23,42,0.18)] transition hover:border-black/18 hover:bg-black/[0.02]"
        >
          <Download class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
          Export
        </button>
      </div>
    </FilterBar>

    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <AnalyticsMetadataStrip :items="metadataItems" />
    </SurfaceCard>

    <section class="grid grid-cols-12 content-start items-start gap-3 lg:gap-4">
      <AnalyticsMetricCard
        v-for="item in topKpis"
        :key="item.title"
        class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2"
        :title="item.title"
        :value="item.value"
        :delta="item.delta"
        :helper="item.helper"
        :tone="item.tone"
        :trend="item.trend"
        dense
      />

      <AnalyticsMetricCard
        v-for="item in secondaryKpis"
        :key="item.title"
        class="col-span-12 sm:col-span-6 xl:col-span-6"
        :title="item.title"
        :value="item.value"
        :delta="item.delta"
        :helper="item.helper"
        :tone="item.tone"
        :trend="item.trend"
        dense
      />

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Pipeline By Stage
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <div class="space-y-3">
            <div
              v-for="row in pipelineStageBars"
              :key="row.label"
              class="sv-card-inset rounded-[1.25rem] px-4 py-4"
            >
              <div class="flex items-start justify-between gap-3">
                <p class="text-[15px] font-semibold text-black">{{ row.label }}</p>
                <p class="text-[15px] font-semibold tabular-nums text-black">{{ row.valueLabel }}</p>
              </div>
              <p class="mt-1 text-[13px] text-black/54">{{ row.secondary }} · {{ row.meta }}</p>
              <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]"
                  :style="{ width: `${Math.max(8, (row.value / pipelineBarsMax) * 100)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Lead Breakdown
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <AnalyticsSegmentBar :segments="leadSourceSegments" />
          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            <div
              v-for="s in crmLeadSources"
              :key="s.source"
              class="flex items-center justify-between gap-2 rounded-[1rem] border border-black/[0.06] px-3 py-2 text-[13px]"
            >
              <span class="truncate text-black/72">{{ s.source }}</span>
              <span class="shrink-0 font-semibold tabular-nums text-black">{{ formatPercent(s.pct, 1) }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <h3 class="sv-card-title">
              Conversion Trend
            </h3>
          </div>
          <StatusBadge label="Improving" variant="success" />
        </div>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <AnalyticsLineChart
            :labels="crmConversionTrend.map((w) => w.label)"
            :series="conversionLineSeries"
            :value-formatter="(v) => `${v.toFixed(1)}%`"
            variant="area"
          />
          <div class="mt-4 grid gap-2 sm:grid-cols-3">
            <div class="sv-card-inset rounded-[1rem] px-3 py-2.5">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-black/42">
                Lead → opp (Wk 8)
              </p>
              <p class="mt-1 text-[16px] font-semibold tabular-nums text-black">
                {{ formatPercent(crmConversionTrendLatest.leadToOppPct, 1) }}
              </p>
            </div>
            <div class="sv-card-inset rounded-[1rem] px-3 py-2.5">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-black/42">
                SQL → opp (Wk 8)
              </p>
              <p class="mt-1 text-[16px] font-semibold tabular-nums text-black">
                {{ formatPercent(crmConversionTrendLatest.sqlToOppPct, 1) }}
              </p>
            </div>
            <div class="sv-card-inset rounded-[1rem] px-3 py-2.5">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-black/42">
                Volume (Wk 8)
              </p>
              <p class="mt-1 text-[13px] font-semibold leading-snug text-black">
                {{ formatCompactNumber(crmConversionTrendLatest.mqlVolume) }} MQL ·
                {{ formatCompactNumber(crmConversionTrendLatest.sqlVolume) }} SQL
              </p>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Deal Status Mix
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <AnalyticsSegmentBar :segments="dealStatusSegments" />
          <p class="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] leading-relaxed text-black/52">
            <span class="font-semibold text-black/65">404 opportunities</span>
            <span>in book.</span>
            <span>Won + open coverage indicates healthy close rates; nurture holds low-single-digit share for re-engagement.</span>
          </p>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Top Opportunities
          </h3>
        </div>
        <div class="space-y-3 border-t border-black/[0.06] pt-3">
          <div
            v-for="opp in crmTopOpportunities"
            :key="opp.id"
            class="sv-card-inset rounded-[1rem] px-4 py-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-[14px] font-semibold text-black">{{ opp.name }}</p>
                <p class="mt-1 text-[12px] text-black/46">{{ opp.stage }} · closes {{ opp.close }}</p>
              </div>
              <StatusBadge :label="healthLabel(opp.health)" :variant="healthVariant(opp.health)" />
            </div>
            <div class="mt-2 flex items-center justify-between text-[13px] text-black/55">
              <span>{{ opp.owner }}</span>
              <span class="font-semibold tabular-nums text-black">{{ formatCompactCurrency(opp.amount) }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Recent CRM Alerts
          </h3>
        </div>
        <div class="space-y-3 border-t border-black/[0.06] pt-3">
          <div
            v-for="a in crmRecentAlerts"
            :key="a.id"
            class="sv-card-inset rounded-[1rem] px-4 py-3"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-[14px] font-semibold text-black">{{ a.title }}</p>
              <StatusBadge :label="alertSeverityLabel(a.severity)" :variant="alertSeverityVariant(a.severity)" />
            </div>
            <p class="mt-2 text-[13px] leading-relaxed text-black/55">{{ a.detail }}</p>
            <p class="mt-2 text-[12px] text-black/40">{{ a.time }}</p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Stale &amp; At-Risk
          </h3>
        </div>
        <div class="space-y-3 border-t border-black/[0.06] pt-3">
          <div
            v-for="d in crmStaleDeals"
            :key="d.id"
            class="sv-card-inset rounded-[1rem] px-4 py-3"
          >
            <p class="text-[14px] font-semibold text-black">{{ d.name }}</p>
            <p class="mt-1 text-[12px] text-black/46">{{ d.stage }} · {{ d.owner }}</p>
            <div class="mt-2 flex items-center justify-between gap-2">
              <span class="text-[13px] text-amber-800/90">{{ d.idleDays }}d idle</span>
              <span class="text-[13px] font-semibold tabular-nums text-black">{{ formatCompactCurrency(d.amount) }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="mb-3">
          <h3 class="sv-card-title">
            Rep Performance
          </h3>
        </div>
        <div class="space-y-3 border-t border-black/[0.06] pt-3">
          <div
            v-for="r in crmRepPerformance"
            :key="r.id"
            class="sv-card-inset rounded-[1rem] px-4 py-3"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-[14px] font-semibold text-black">{{ r.name }}</p>
              <span class="text-[13px] font-semibold text-black">{{ formatPercent(r.winRate, 0) }} win</span>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-[12px] text-black/52">
              <span>Pipe {{ formatCompactCurrency(r.ownedPipeline) }}</span>
              <span class="text-right">Won {{ formatCompactCurrency(r.wonQtd) }}</span>
            </div>
            <p class="mt-1 text-[12px] text-black/42">{{ r.deals }} active opps</p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <h3 class="sv-card-title">
              Opportunity List
            </h3>
          </div>
          <button
            type="button"
            class="inline-flex min-h-[3rem] shrink-0 items-center gap-2 rounded-[var(--sv-radius-control)] border border-[var(--sv-line)] bg-white px-3.5 text-sm font-semibold text-black/85 shadow-[0_10px_24px_-26px_rgba(15,23,42,0.18)] transition hover:border-black/18 hover:bg-black/[0.02]"
          >
            Columns
          </button>
        </div>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <DataTable :columns="ledgerColumns" :rows="ledgerRows" row-key="id" />
        </div>
      </SurfaceCard>
    </section>
  </div>
</template>
