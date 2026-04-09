<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  Download,
  Funnel,
  GitCompareArrows,
  Layers3,
  Link2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "CRM / Outcomes — Solvomo" });

const {
  reportingMeta,
  totals,
  performanceCampaigns,
  performanceTrend,
  sourceOutcomes,
  outcomeSources,
  signalQuality,
  formatCompactCurrency,
  formatCompactNumber,
  formatMultiplier,
  formatCurrency,
  channelVariant,
} = useDemoAnalytics();

type OutcomeCampaign = (typeof performanceCampaigns)[number];
type SourceOutcome = (typeof sourceOutcomes.value)[number];

const selectedAttribution = ref("Hybrid multi-touch");
const selectedSource = ref("All sources");
const selectedRange = ref("Last 8 weeks");

const filteredCampaigns = computed(() =>
  performanceCampaigns.filter((campaign: OutcomeCampaign) => {
    if (selectedSource.value !== "All sources" && campaign.channel !== selectedSource.value) return false;
    return true;
  }),
);

const metadataItems = computed(() => [
  { label: "Last synced", value: reportingMeta.lastSynced },
  { label: "Compared", value: reportingMeta.comparisonLabel },
  { label: "Attribution", value: selectedAttribution.value },
  { label: "Confidence", value: reportingMeta.confidenceLabel },
]);

const sourcedRevenue = computed(() => Math.round(totals.value.revenue * 0.68));
const influencedRevenue = computed(() => totals.value.revenue - sourcedRevenue.value);
const paybackMonths = computed(() => totals.value.spend / Math.max(totals.value.revenue / 12, 1));

const kpis = computed(() => [
  { title: "Leads", value: formatCompactNumber(totals.value.leads), delta: "+10.6%", helper: "All paid", tone: "info" as const, icon: Target, trend: performanceTrend.map((point) => point.leads) },
  { title: "SQLs", value: formatCompactNumber(totals.value.sqls), delta: "+9.1%", helper: "Qualified", tone: "success" as const, icon: Sparkles, trend: performanceTrend.map((point) => point.sqls) },
  { title: "Revenue", value: formatCompactCurrency(totals.value.revenue), delta: "+14.2%", helper: "Attributed", tone: "success" as const, icon: TrendingUp, trend: performanceTrend.map((point) => point.revenue) },
  { title: "Pipeline", value: formatCompactCurrency(totals.value.pipeline), delta: "+12.8%", helper: "Open opps", tone: "info" as const, icon: Layers3, trend: performanceTrend.map((point) => point.pipeline) },
  { title: "MER", value: formatMultiplier(totals.value.mer, 1), delta: "+0.4x", helper: "Revenue / spend", tone: "success" as const, icon: Wallet, trend: performanceTrend.map((point) => point.revenue / point.spend) },
  { title: "Payback", value: `${paybackMonths.value.toFixed(1)} mo`, delta: "-0.3 mo", helper: "Blended", tone: "success" as const, icon: Link2, trend: performanceTrend.map((point) => point.spend / Math.max(point.revenue / 12, 1)) },
]);

const funnelItems = computed(() => [
  { label: "Clicks", value: totals.value.clicks, valueLabel: formatCompactNumber(totals.value.clicks), note: "Traffic" },
  { label: "Leads", value: totals.value.leads, valueLabel: formatCompactNumber(totals.value.leads), note: "Created" },
  { label: "SQLs", value: totals.value.sqls, valueLabel: formatCompactNumber(totals.value.sqls), note: "Accepted" },
  { label: "Purchases", value: totals.value.purchases, valueLabel: formatCompactNumber(totals.value.purchases), note: "Won" },
]);

const sourceRows = computed(() =>
  sourceOutcomes.value
    .filter((row: SourceOutcome) => selectedSource.value === "All sources" || row.source === selectedSource.value)
    .map((row: SourceOutcome) => ({
      label: row.source,
      value: row.revenue,
      valueLabel: formatCompactCurrency(row.revenue),
      secondary: `${formatCompactCurrency(row.pipeline)} pipeline`,
      meta: `${formatCompactNumber(row.sqls)} SQLs · ${formatCompactNumber(row.purchases)} customers`,
    })),
);

const sourceSegments = computed(() => [
  { label: "Sourced revenue", value: sourcedRevenue.value, valueLabel: formatCompactCurrency(sourcedRevenue.value), tone: "depth" },
  { label: "Influenced revenue", value: influencedRevenue.value, valueLabel: formatCompactCurrency(influencedRevenue.value), tone: "brand" },
]);

const campaignRows = computed(() =>
  [...filteredCampaigns.value]
    .sort((left, right) => right.pipeline - left.pipeline)
    .map((campaign) => ({
      id: campaign.id,
      campaign: campaign.name,
      source: campaign.channel,
      leads: formatCompactNumber(campaign.leads),
      sqls: formatCompactNumber(campaign.sqls),
      purchases: formatCompactNumber(campaign.purchases),
      pipeline: formatCompactCurrency(campaign.pipeline),
      revenue: formatCompactCurrency(campaign.revenue),
      payback: `${(campaign.spend / Math.max(1, campaign.revenue / 12)).toFixed(1)} mo`,
    })),
);

const columns: DataTableColumn[] = [
  { key: "campaign", label: "Campaign" },
  { key: "source", label: "Source" },
  { key: "leads", label: "Leads" },
  { key: "sqls", label: "SQLs" },
  { key: "purchases", label: "Customers" },
  { key: "pipeline", label: "Pipeline" },
  { key: "revenue", label: "Revenue" },
  { key: "payback", label: "Payback" },
];
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Outcomes" hide-context>
      <template #actions>
        <button type="button" class="app-button button-secondary text-sm">
          <GitCompareArrows class="h-4 w-4" :stroke-width="1.9" />
          Compare
        </button>
        <button type="button" class="app-button button-secondary text-sm">
          <Download class="h-4 w-4" :stroke-width="1.9" />
          Export
        </button>
      </template>
      <AnalyticsMetadataStrip :items="metadataItems" />
    </PageHeader>

    <FilterBar>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in ['Last 8 weeks', 'Last 30 days', 'Quarter to date']"
          :key="option"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
          :class="selectedRange === option ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/60'"
          @click="selectedRange = option"
        >
          <CalendarRange class="h-4 w-4" :stroke-width="1.9" />
          {{ option }}
        </button>
      </div>
      <select v-model="selectedAttribution" class="app-control min-w-[12rem]">
        <option>Hybrid multi-touch</option>
        <option>Last non-direct</option>
        <option>First touch</option>
      </select>
      <select v-model="selectedSource" class="app-control min-w-[11rem]">
        <option v-for="option in outcomeSources" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </FilterBar>

    <section class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsMetricCard
        v-for="item in kpis"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :delta="item.delta"
        :helper="item.helper"
        :tone="item.tone"
        :icon="item.icon"
        :trend="item.trend"
      />
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <SurfaceCard variant="frame" padding="md" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Funnel class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Funnel</p>
            <h2 class="sv-section-heading mt-1">Acquisition to customer</h2>
          </div>
        </div>
        <AnalyticsFunnel :items="funnelItems" />
      </SurfaceCard>

      <SurfaceCard variant="soft" padding="lg" class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/62">
              <TrendingUp class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Trend</p>
              <h2 class="sv-section-heading mt-1">Pipeline vs revenue</h2>
            </div>
          </div>
          <StatusBadge label="High confidence" variant="success" />
        </div>
        <AnalyticsLineChart
          :labels="performanceTrend.map((point) => point.label)"
          :series="[
            { label: 'Pipeline', values: performanceTrend.map((point) => point.pipeline), color: 'depth' },
            { label: 'Revenue', values: performanceTrend.map((point) => point.revenue), color: 'product' },
          ]"
          :value-formatter="formatCompactCurrency"
          variant="area"
        />
      </SurfaceCard>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SurfaceCard variant="product" padding="md" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Link2 class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Attribution split</p>
            <h2 class="sv-section-heading mt-1">Sourced vs influenced</h2>
          </div>
        </div>
        <AnalyticsSegmentBar :segments="sourceSegments" />
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <div class="flex items-center justify-between gap-3">
              <StatusBadge label="Sourced" variant="success" />
              <p class="text-[15px] font-semibold text-black">{{ formatCompactCurrency(sourcedRevenue) }}</p>
            </div>
            <p class="mt-2 text-[13px] text-black/52">{{ formatPercent((sourcedRevenue / totals.revenue) * 100, 0) }} of closed revenue</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <div class="flex items-center justify-between gap-3">
              <StatusBadge label="Influenced" variant="info" />
              <p class="text-[15px] font-semibold text-black">{{ formatCompactCurrency(influencedRevenue) }}</p>
            </div>
            <p class="mt-2 text-[13px] text-black/52">{{ formatPercent((influencedRevenue / totals.revenue) * 100, 0) }} of closed revenue</p>
          </div>
        </div>
        <AnalyticsBarsList :items="sourceRows" />
      </SurfaceCard>

      <SurfaceCard variant="depth" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <ShieldCheck class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Signal quality</p>
            <h2 class="sv-section-heading mt-1">Confidence cards</h2>
          </div>
        </div>
        <div class="grid gap-3 lg:grid-cols-2">
          <div
            v-for="item in signalQuality"
            :key="item.id"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <p class="sv-section-title">{{ item.label }}</p>
            <p class="mt-2 text-[1rem] font-semibold text-black">{{ item.value }}</p>
            <p class="mt-2 text-[13px] leading-6 text-black/52">{{ item.note }}</p>
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <p class="sv-section-title">CAC</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ formatCurrency(totals.cac) }}</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <p class="sv-section-title">MER</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ formatMultiplier(totals.mer, 1) }}</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <p class="sv-section-title">Payback</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ paybackMonths.toFixed(1) }} mo</p>
          </div>
        </div>
      </SurfaceCard>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Campaign mapping</p>
            <h2 class="sv-section-heading mt-1">Source to outcome table</h2>
          </div>
        </div>
        <button type="button" class="inline-flex min-h-[2.75rem] items-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/64">
          <Layers3 class="h-4 w-4" :stroke-width="1.9" />
          Columns
        </button>
      </div>

      <DataTable :columns="columns" :rows="campaignRows" row-key="id">
        <template #cell-campaign="{ row }">
          <div>
            <p class="font-semibold text-black">{{ row.campaign }}</p>
            <p class="mt-1 text-[12px] text-black/46">{{ row.payback }} payback</p>
          </div>
        </template>
        <template #cell-source="{ value }">
          <StatusBadge :label="String(value)" :variant="channelVariant(String(value))" />
        </template>
      </DataTable>
    </section>
  </div>
</template>
