<script setup lang="ts">
// @ts-nocheck
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Download,
  Gauge,
  GitCompareArrows,
  Layers3,
  MousePointerClick,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  TriangleAlert,
  Wallet,
} from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Performance — Solvomo" });

const { dataStatus } = useAppData();
const {
  reportingMeta,
  performanceCampaigns,
  performanceTrend,
  performanceChannels,
  performanceRegions,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatMultiplier,
  channelVariant,
  statusVariant,
} = useDemoAnalytics();

type PerformanceCampaign = (typeof performanceCampaigns)[number];
type TrendKey = "clicks" | "conversions" | "spend" | "roas";

const selectedRange = ref("Last 8 weeks");
const selectedChannel = ref("All channels");
const selectedRegion = ref("All regions");
const selectedTrend = ref<TrendKey>("clicks");
const compareEnabled = ref(true);

function totalsForCampaigns(rows: readonly PerformanceCampaign[]) {
  const spend = rows.reduce((total, row) => total + row.spend, 0);
  const impressions = rows.reduce((total, row) => total + row.impressions, 0);
  const clicks = rows.reduce((total, row) => total + row.clicks, 0);
  const leads = rows.reduce((total, row) => total + row.leads, 0);
  const revenue = rows.reduce((total, row) => total + row.revenue, 0);

  return {
    spend,
    impressions,
    clicks,
    leads,
    revenue,
    ctr: impressions ? (clicks / impressions) * 100 : 0,
    cpc: clicks ? spend / clicks : 0,
    cvr: clicks ? (leads / clicks) * 100 : 0,
    cpa: leads ? spend / leads : 0,
    roas: spend ? revenue / spend : 0,
  };
}

const filteredCampaigns = computed(() =>
  performanceCampaigns.filter((campaign: PerformanceCampaign) => {
    if (selectedChannel.value !== "All channels" && campaign.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== "All regions" && campaign.region !== selectedRegion.value) return false;
    return true;
  }),
);

const filteredTotals = computed(() => totalsForCampaigns(filteredCampaigns.value));

const metadataItems = computed(() => [
  { label: "Last synced", value: reportingMeta.lastSynced },
  { label: "Compared", value: reportingMeta.comparisonLabel },
  { label: "Active campaigns", value: `${filteredCampaigns.value.length}` },
  { label: "Attribution", value: reportingMeta.attributionModel },
]);

const kpis = computed(() => [
  {
    title: "Impressions",
    value: formatCompactNumber(filteredTotals.value.impressions),
    delta: "+11.8%",
    helper: "Reach",
    tone: "info" as const,
    icon: Activity,
    trend: performanceTrend.map((point) => point.leads),
  },
  {
    title: "Clicks",
    value: formatCompactNumber(filteredTotals.value.clicks),
    delta: "+9.4%",
    helper: "Traffic",
    tone: "success" as const,
    icon: MousePointerClick,
    trend: performanceTrend.map((point) => point.leads),
  },
  {
    title: "CTR",
    value: formatPercent(filteredTotals.value.ctr),
    delta: "+0.12 pts",
    helper: "Efficiency",
    tone: "success" as const,
    icon: Target,
    trend: performanceTrend.map((point) => point.leads / 6),
  },
  {
    title: "CPC",
    value: formatCurrency(filteredTotals.value.cpc, 2),
    delta: "-6.2%",
    helper: "Traffic cost",
    tone: "success" as const,
    icon: Wallet,
    trend: performanceTrend.map((point) => point.spend / 1000),
  },
  {
    title: "CVR",
    value: formatPercent(filteredTotals.value.cvr),
    delta: "+0.19 pts",
    helper: "Post-click",
    tone: "success" as const,
    icon: Gauge,
    trend: performanceTrend.map((point) => point.leads / 5),
  },
  {
    title: "CPA",
    value: formatCurrency(filteredTotals.value.cpa),
    delta: "-8.5%",
    helper: "Lead cost",
    tone: "success" as const,
    icon: TrendingDown,
    trend: performanceTrend.map((point) => point.spend / 900),
  },
  {
    title: "ROAS",
    value: formatMultiplier(filteredTotals.value.roas, 1),
    delta: "+0.4x",
    helper: "Return",
    tone: "info" as const,
    icon: TrendingUp,
    trend: performanceTrend.map((point) => point.revenue / point.spend),
  },
]);

const trendMetricOptions = [
  { key: "clicks", label: "Clicks" },
  { key: "conversions", label: "Conversions" },
  { key: "spend", label: "Spend" },
  { key: "roas", label: "ROAS" },
] as const;

const trendConfig = computed(() => {
  const base = performanceTrend.map((point) => {
    switch (selectedTrend.value) {
      case "conversions":
        return point.leads;
      case "spend":
        return point.spend;
      case "roas":
        return point.revenue / point.spend;
      default:
        return point.leads * 18;
    }
  });

  const previous = base.map((value, index) => Number((value * (0.9 + (index % 3) * 0.02)).toFixed(2)));

  return {
    labels: performanceTrend.map((point) => point.label),
    formatter: selectedTrend.value === "spend" ? formatCompactCurrency : selectedTrend.value === "roas" ? (value: number) => formatMultiplier(value, 1) : formatCompactNumber,
    series: compareEnabled.value
      ? [
          { label: trendMetricOptions.find((item) => item.key === selectedTrend.value)?.label ?? "Metric", values: base, color: "depth" as const },
          { label: "Previous", values: previous, color: "brand" as const },
        ]
      : [{ label: trendMetricOptions.find((item) => item.key === selectedTrend.value)?.label ?? "Metric", values: base, color: "depth" as const }],
  };
});

const channelBreakdown = computed(() => {
  const grouped = new Map<string, { spend: number; revenue: number; leads: number; clicks: number }>();

  filteredCampaigns.value.forEach((campaign: PerformanceCampaign) => {
    const current = grouped.get(campaign.channel) ?? { spend: 0, revenue: 0, leads: 0, clicks: 0 };
    current.spend += campaign.spend;
    current.revenue += campaign.revenue;
    current.leads += campaign.leads;
    current.clicks += campaign.clicks;
    grouped.set(campaign.channel, current);
  });

  return Array.from(grouped.entries())
    .map(([label, value]) => ({
      label,
      value: value.revenue,
      spend: value.spend,
      revenue: value.revenue,
      leads: value.leads,
      clicks: value.clicks,
      roas: value.revenue / value.spend,
      ctr: value.clicks / filteredTotals.value.impressions * 100,
    }))
    .sort((left, right) => right.revenue - left.revenue);
});

const bestPerformer = computed(() =>
  [...filteredCampaigns.value].sort((left, right) => (right.revenue / right.spend) - (left.revenue / left.spend))[0],
);

const worstPerformer = computed(() =>
  [...filteredCampaigns.value].sort((left, right) => (left.revenue / left.spend) - (right.revenue / right.spend))[0],
);

const quickSignals = computed(() => [
  { label: "Meta scaling", variant: "success" as const, icon: TrendingUp },
  { label: "Search intent strong", variant: "info" as const, icon: Target },
  { label: "LinkedIn under plan", variant: "warning" as const, icon: TriangleAlert },
  { label: "CTV fatigue", variant: "danger" as const, icon: TrendingDown },
]);

const campaignRows = computed(() =>
  [...filteredCampaigns.value]
    .sort((left, right) => right.revenue - left.revenue)
    .map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      objective: campaign.objective,
      channel: campaign.channel,
      region: campaign.region,
      spend: formatCompactCurrency(campaign.spend),
      clicks: formatCompactNumber(campaign.clicks),
      conversions: formatCompactNumber(campaign.leads),
      ctr: formatPercent((campaign.clicks / campaign.impressions) * 100),
      cpa: formatCurrency(campaign.spend / campaign.leads),
      revenue: formatCompactCurrency(campaign.revenue),
      roas: formatMultiplier(campaign.revenue / campaign.spend, 1),
      status: campaign.status,
    })),
);

const columns: DataTableColumn[] = [
  { key: "name", label: "Campaign" },
  { key: "channel", label: "Channel" },
  { key: "region", label: "Region" },
  { key: "spend", label: "Spend" },
  { key: "clicks", label: "Clicks" },
  { key: "conversions", label: "Conv." },
  { key: "ctr", label: "CTR" },
  { key: "cpa", label: "CPA" },
  { key: "revenue", label: "Revenue" },
  { key: "roas", label: "ROAS" },
  { key: "status", label: "Status" },
];
</script>

<template>
  <div class="space-y-8">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Performance">
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
      <select v-model="selectedChannel" class="app-control min-w-[11rem]">
        <option v-for="option in performanceChannels" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedRegion" class="app-control min-w-[11rem]">
        <option v-for="option in performanceRegions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <button
        type="button"
        class="inline-flex min-h-[3rem] items-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/68 transition hover:border-black/20"
        @click="compareEnabled = !compareEnabled"
      >
        <Layers3 class="h-4 w-4" :stroke-width="1.9" />
        {{ compareEnabled ? "Compare on" : "Compare off" }}
      </button>
    </FilterBar>

    <div class="flex flex-wrap gap-2">
      <StatusBadge
        v-for="signal in quickSignals"
        :key="signal.label"
        :label="signal.label"
        :variant="signal.variant"
      />
    </div>

    <section class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
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

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_minmax(21rem,0.95fr)]">
      <SurfaceCard variant="soft" padding="lg" class="space-y-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/64">
              <BarChart3 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Trend</p>
              <h2 class="sv-section-heading mt-1">Metric timeline</h2>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in trendMetricOptions"
              :key="option.key"
              type="button"
              class="rounded-full border px-3.5 py-2 text-sm font-semibold transition"
              :class="selectedTrend === option.key ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/58'"
              @click="selectedTrend = option.key"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <AnalyticsLineChart
          :labels="trendConfig.labels"
          :series="trendConfig.series"
          :value-formatter="trendConfig.formatter"
          variant="area"
        />

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="sv-card-inset rounded-[1rem] px-4 py-3">
            <p class="sv-section-title">Active mix</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ filteredCampaigns.length }} campaigns</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-3">
            <p class="sv-section-title">Lead volume</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ formatCompactNumber(filteredTotals.leads) }}</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-3">
            <p class="sv-section-title">Spend</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ formatCompactCurrency(filteredTotals.spend) }}</p>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-3">
            <p class="sv-section-title">Revenue</p>
            <p class="mt-2 text-[15px] font-semibold text-black">{{ formatCompactCurrency(filteredTotals.revenue) }}</p>
          </div>
        </div>
      </SurfaceCard>

      <div class="space-y-6">
        <SurfaceCard variant="frame" padding="md" class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.025] text-black/62">
              <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Channels</p>
              <h2 class="sv-section-heading mt-1">Comparison</h2>
            </div>
          </div>
          <div class="space-y-3">
            <div
              v-for="item in channelBreakdown"
              :key="item.label"
              class="sv-card-inset rounded-[1rem] px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <StatusBadge :label="item.label" :variant="channelVariant(item.label)" />
                  <span class="text-[13px] text-black/46">{{ formatMultiplier(item.roas, 1) }} ROAS</span>
                </div>
                <p class="text-[15px] font-semibold text-black">{{ formatCompactCurrency(item.revenue) }}</p>
              </div>
              <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]"
                  :style="{ width: `${(item.revenue / Math.max(...channelBreakdown.map((row) => row.revenue), 1)) * 100}%` }"
                />
              </div>
              <div class="mt-3 flex items-center justify-between gap-3 text-[13px] text-black/52">
                <span>{{ formatCompactCurrency(item.spend) }} spend</span>
                <span>{{ formatCompactNumber(item.leads) }} leads</span>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <div class="grid gap-4 sm:grid-cols-2">
          <SurfaceCard variant="product" padding="md" class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <Trophy class="h-4.5 w-4.5 text-black/62" :stroke-width="1.9" />
                <span class="sv-section-title">Best</span>
              </div>
              <ArrowUpRight class="h-4 w-4 text-[rgb(21,83,45)]" :stroke-width="1.9" />
            </div>
            <p class="text-[1rem] font-semibold tracking-[-0.02em] text-black">{{ bestPerformer?.name }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="sv-card-inset rounded-[1rem] px-3.5 py-3">
                <p class="sv-section-title">ROAS</p>
                <p class="mt-1 text-[15px] font-semibold text-black">{{ bestPerformer ? formatMultiplier(bestPerformer.revenue / bestPerformer.spend, 1) : "—" }}</p>
              </div>
              <div class="sv-card-inset rounded-[1rem] px-3.5 py-3">
                <p class="sv-section-title">Spend</p>
                <p class="mt-1 text-[15px] font-semibold text-black">{{ bestPerformer ? formatCompactCurrency(bestPerformer.spend) : "—" }}</p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard variant="depth" padding="md" class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <TriangleAlert class="h-4.5 w-4.5 text-black/62" :stroke-width="1.9" />
                <span class="sv-section-title">Watch</span>
              </div>
              <ArrowDownRight class="h-4 w-4 text-[rgb(127,29,29)]" :stroke-width="1.9" />
            </div>
            <p class="text-[1rem] font-semibold tracking-[-0.02em] text-black">{{ worstPerformer?.name }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="sv-card-inset rounded-[1rem] px-3.5 py-3">
                <p class="sv-section-title">ROAS</p>
                <p class="mt-1 text-[15px] font-semibold text-black">{{ worstPerformer ? formatMultiplier(worstPerformer.revenue / worstPerformer.spend, 1) : "—" }}</p>
              </div>
              <div class="sv-card-inset rounded-[1rem] px-3.5 py-3">
                <p class="sv-section-title">CPA</p>
                <p class="mt-1 text-[15px] font-semibold text-black">{{ worstPerformer ? formatCurrency(worstPerformer.spend / worstPerformer.leads) : "—" }}</p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.025] text-black/62">
            <Target class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Leaderboard</p>
            <h2 class="sv-section-heading mt-1">Campaigns</h2>
          </div>
        </div>
        <button type="button" class="inline-flex min-h-[2.75rem] items-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/64">
          <Layers3 class="h-4 w-4" :stroke-width="1.9" />
          Columns
        </button>
      </div>

      <DataTable :columns="columns" :rows="campaignRows" row-key="id">
        <template #cell-name="{ row }">
          <div>
            <p class="font-semibold text-black">{{ row.name }}</p>
            <p class="mt-1 text-[12px] text-black/46">{{ row.objective }}</p>
          </div>
        </template>
        <template #cell-channel="{ value }">
          <StatusBadge :label="String(value)" :variant="channelVariant(String(value))" />
        </template>
        <template #cell-roas="{ value }">
          <StatusBadge :label="String(value)" variant="success" />
        </template>
        <template #cell-status="{ value }">
          <StatusBadge :label="String(value)" :variant="statusVariant(String(value))" />
        </template>
      </DataTable>
    </section>
  </div>
</template>
