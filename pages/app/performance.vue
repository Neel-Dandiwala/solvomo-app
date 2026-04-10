<script setup lang="ts">
// @ts-nocheck
import {
  Activity,
  Award,
  BarChart3,
  CalendarRange,
  Download,
  Eye,
  Gauge,
  Layers3,
  MousePointerClick,
  PieChart,
  Table2,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  TriangleAlert,
  Wallet,
} from "lucide-vue-next";
import AnalyticsCampaignRevSpendBars from "~/components/app/analytics/AnalyticsCampaignRevSpendBars.vue";
import AnalyticsConicDonutLite from "~/components/app/analytics/AnalyticsConicDonutLite.vue";
import AnalyticsMetricHBarRank from "~/components/app/analytics/AnalyticsMetricHBarRank.vue";
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

const ALL_SCOPE = "All";

const selectedRange = ref("Last 8 weeks");
const selectedChannel = ref(ALL_SCOPE);
const selectedRegion = ref(ALL_SCOPE);
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
    if (selectedChannel.value !== ALL_SCOPE && campaign.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== ALL_SCOPE && campaign.region !== selectedRegion.value) return false;
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

const trendStatsRow = computed(() => [
  { label: "Active Mix", value: `${filteredCampaigns.value.length} campaigns` },
  { label: "Lead Volume", value: formatCompactNumber(filteredTotals.value.leads) },
  { label: "Spend", value: formatCompactCurrency(filteredTotals.value.spend) },
  { label: "Revenue", value: formatCompactCurrency(filteredTotals.value.revenue) },
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
  { label: "Meta scaling", variant: "success" as const },
  { label: "Search intent strong", variant: "info" as const },
  { label: "LinkedIn under plan", variant: "warning" as const },
  { label: "CTV fatigue", variant: "danger" as const },
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

function kpiColClass(index: number) {
  if (index < 4) return "col-span-12 sm:col-span-6 xl:col-span-3";
  return "col-span-12 sm:col-span-6 xl:col-span-4";
}

function campaignRoas(c: PerformanceCampaign) {
  return c.spend ? c.revenue / c.spend : 0;
}

function shortCampaignLabel(name: string, max = 24) {
  const t = name.trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

const topRevenueCampaignIntel = computed(() => {
  const rows = filteredCampaigns.value;
  if (!rows.length) return null;
  return [...rows].sort((a, b) => b.revenue - a.revenue)[0];
});

const topRoasCampaignIntel = computed(() => {
  const rows = filteredCampaigns.value.filter((c) => c.spend > 0);
  if (!rows.length) return null;
  return [...rows].sort((a, b) => campaignRoas(b) - campaignRoas(a))[0];
});

const watchlistCampaignIntel = computed(() => {
  const rows = filteredCampaigns.value.filter((c) => c.spend > 0);
  if (!rows.length) return null;
  return [...rows].sort((a, b) => campaignRoas(a) - campaignRoas(b))[0];
});

const spendConcentrationIntel = computed(() => {
  const rows = filteredCampaigns.value;
  const total = filteredTotals.value.spend;
  if (!rows.length || total <= 0)
    return { topPct: 0, topThreePct: 0, segments: [] as Array<{ pct: number; color: string }> };
  const sorted = [...rows].sort((a, b) => b.spend - a.spend);
  const topPct = (sorted[0].spend / total) * 100;
  const topThreePct = sorted.slice(0, 3).reduce((s, c) => s + c.spend, 0) / total * 100;
  const palette = ["#5FC7D4", "#5B7BE1", "#5A4FCF", "#D88F8D"];
  const segments = sorted.slice(0, 4).map((c, i) => ({
    pct: (c.spend / total) * 100,
    color: palette[i % palette.length]!,
  }));
  return { topPct, topThreePct, segments };
});

const campaignRevSpendChartRows = computed(() =>
  [...filteredCampaigns.value]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((c) => ({
      label: shortCampaignLabel(c.name, 26),
      revenue: c.revenue,
      spend: c.spend,
    })),
);

const roasRankChartRows = computed(() =>
  [...filteredCampaigns.value]
    .filter((c) => c.spend > 0)
    .sort((a, b) => campaignRoas(b) - campaignRoas(a))
    .slice(0, 6)
    .map((c) => ({ label: shortCampaignLabel(c.name, 22), value: campaignRoas(c) })),
);

const objectiveMixSegments = computed(() => {
  const map = new Map<string, number>();
  filteredCampaigns.value.forEach((c) => {
    map.set(c.objective, (map.get(c.objective) ?? 0) + c.revenue);
  });
  const colors = ["depth", "product", "brand", "interaction"] as const;
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label,
      value,
      color: colors[i % colors.length]!,
      detail: formatCompactCurrency(value),
    }));
});

const statusMixSegments = computed(() => {
  const map = new Map<string, number>();
  filteredCampaigns.value.forEach((c) => {
    map.set(c.status, (map.get(c.status) ?? 0) + c.spend);
  });
  const colors = ["depth", "product", "brand", "interaction"] as const;
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label,
      value,
      color: colors[i % colors.length]!,
      detail: formatCompactCurrency(value),
    }));
});

const campaignWorkspaceRevenueTotal = computed(() => formatCompactCurrency(filteredTotals.value.revenue));
const campaignWorkspaceSpendTotal = computed(() => formatCompactCurrency(filteredTotals.value.spend));

function formatRoasBarValue(value: number) {
  return formatMultiplier(value, 1);
}

const selectedCampaignId = ref<string | null>(null);

watch(
  filteredCampaigns,
  (rows) => {
    if (!rows.length) {
      selectedCampaignId.value = null;
      return;
    }
    const ids = new Set(rows.map((r) => r.id));
    if (!selectedCampaignId.value || !ids.has(selectedCampaignId.value)) {
      const top = [...rows].sort((a, b) => b.revenue - a.revenue)[0];
      selectedCampaignId.value = top?.id ?? null;
    }
  },
  { immediate: true },
);

const selectedCampaign = computed(
  () => filteredCampaigns.value.find((c) => c.id === selectedCampaignId.value) ?? null,
);

function campaignDetailInsight(c: PerformanceCampaign) {
  switch (c.status) {
    case "Fatiguing":
      return "Frequency is rising week over week; consider creative refresh or audience exclusions.";
    case "Under target":
      return "Pipeline creation is behind plan — review bid floors and lead-form friction.";
    case "Scaling":
      return "Delivery is absorbing budget cleanly; monitor CPA while scaling.";
    case "Efficient":
    case "Top performer":
      return "Efficiency is above cohort median; protect winning ad sets and hold the creative mix.";
    case "Stable":
      return "Performance is steady vs prior period; small bid tests are the next lever.";
    default:
      return "Snapshot reflects the selected filters and attribution window.";
  }
}

/** Deterministic demo-only satellite metrics (not in raw campaign row). */
function campaignDemoSatellite(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const creativesInTest = 4 + (h % 9);
  const syncMin = 6 + (h % 48);
  return {
    creativesInTest,
    syncLabel: `${syncMin} min ago`,
    audienceOverlap: `${28 + (h % 15)}%`,
  };
}

function onCampaignTableRowClick(row: Record<string, unknown>) {
  if (row.id) selectedCampaignId.value = String(row.id);
}
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Performance" dense metadata-tight hide-context />

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
            <CalendarRange class="h-4 w-4 shrink-0" :stroke-width="1.9" />
            {{ option }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="perf-filter-channel" class="sv-section-title">Channel</label>
        <select id="perf-filter-channel" v-model="selectedChannel" class="app-control min-w-[12rem]">
          <option v-for="option in performanceChannels" :key="`ch-${option}`" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="perf-filter-region" class="sv-section-title">Region</label>
        <select id="perf-filter-region" v-model="selectedRegion" class="app-control min-w-[12rem]">
          <option v-for="option in performanceRegions" :key="`rg-${option}`" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div
        class="inline-flex min-h-[3rem] items-center gap-2.5 rounded-[var(--sv-radius-control)] border border-[var(--sv-line)] bg-white px-3.5 text-sm font-semibold text-black/85 shadow-[0_10px_24px_-26px_rgba(15,23,42,0.18)]"
      >
        <span class="text-[13px] font-semibold text-black/72">Compare</span>
        <button
          type="button"
          role="switch"
          :aria-checked="compareEnabled"
          :aria-label="compareEnabled ? 'Period comparison on' : 'Period comparison off'"
          :class="compareEnabled ? 'bg-[rgba(91,123,225,0.95)]' : 'bg-black/15'"
          class="relative h-7 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(91,123,225,0.35)] focus-visible:ring-offset-2"
          @click="compareEnabled = !compareEnabled"
        >
          <span
            class="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200"
            :class="compareEnabled ? 'translate-x-[1.125rem]' : 'translate-x-0'"
            aria-hidden="true"
          />
        </button>
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
      <div class="col-span-12 flex flex-wrap gap-2">
        <StatusBadge
          v-for="signal in quickSignals"
          :key="signal.label"
          :label="signal.label"
          :variant="signal.variant"
        />
      </div>
      <AnalyticsMetricCard
        v-for="(item, idx) in kpis"
        :key="item.title"
        :class="kpiColClass(idx)"
        :title="item.title"
        :value="item.value"
        :delta="item.delta"
        :helper="item.helper"
        :tone="item.tone"
        :icon="item.icon"
        :trend="item.trend"
        dense
      />
      <SurfaceCard
        variant="frame"
        padding="sm"
        class="col-span-12 flex h-fit min-h-0 min-w-0 w-full flex-col gap-4"
      >
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <div class="sv-section-icon-wrap">
              <BarChart3 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <h3 class="sv-card-title">Metric Timeline</h3>
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

        <div
          class="grid min-w-0 grid-cols-2 gap-3 border-b border-black/[0.06] pb-4 sm:grid-cols-4 lg:gap-0 lg:pb-4 xl:divide-x xl:divide-black/[0.06]"
        >
          <div
            v-for="(stat, idx) in trendStatsRow"
            :key="stat.label"
            class="min-w-0 lg:px-4"
            :class="[idx === 0 && 'lg:pl-0', idx === trendStatsRow.length - 1 && 'lg:pr-0']"
          >
            <p class="sv-section-title">{{ stat.label }}</p>
            <p class="mt-1.5 text-[15px] font-semibold tabular-nums text-black">{{ stat.value }}</p>
          </div>
        </div>

        <AnalyticsLineChart
          :labels="trendConfig.labels"
          :series="trendConfig.series"
          :value-formatter="trendConfig.formatter"
          variant="area"
        />
      </SurfaceCard>

      <div class="col-span-12 flex min-h-0 w-full flex-col gap-4">
        <SurfaceCard variant="frame" padding="sm" class="min-w-0">
          <div class="mb-4 flex items-center gap-3">
            <div class="sv-section-icon-wrap">
              <Layers3 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <h3 class="sv-card-title">Channel Comparison</h3>
          </div>
          <div class="divide-y divide-black/[0.06]">
            <div v-for="item in channelBreakdown" :key="item.label" class="py-4 first:pt-0 last:pb-0">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2.5">
                  <StatusBadge :label="item.label" :variant="channelVariant(item.label)" />
                  <span class="truncate text-[13px] text-black/46">{{ formatMultiplier(item.roas, 1) }} ROAS</span>
                </div>
                <p class="shrink-0 text-[15px] font-semibold tabular-nums text-black">{{ formatCompactCurrency(item.revenue) }}</p>
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

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SurfaceCard variant="frame" padding="sm" class="min-w-0">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="sv-section-icon-wrap">
                  <Trophy class="h-5 w-5" :stroke-width="1.9" />
                </div>
                <h3 class="sv-card-title">Best</h3>
              </div>
              <StatusBadge label="Top ROAS" variant="success" />
            </div>
            <p class="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-black">{{ bestPerformer?.name }}</p>
            <div class="mt-4 grid grid-cols-2 gap-0 border-t border-black/[0.06] pt-4">
              <div class="min-w-0 border-r border-black/[0.06] pr-3">
                <p class="sv-section-title">ROAS</p>
                <p class="mt-1.5 text-[15px] font-semibold tabular-nums text-black">
                  {{ bestPerformer ? formatMultiplier(bestPerformer.revenue / bestPerformer.spend, 1) : "—" }}
                </p>
              </div>
              <div class="min-w-0 pl-3">
                <p class="sv-section-title">Spend</p>
                <p class="mt-1.5 text-[15px] font-semibold tabular-nums text-black">
                  {{ bestPerformer ? formatCompactCurrency(bestPerformer.spend) : "—" }}
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard variant="frame" padding="sm" class="min-w-0">
            <div class="mb-3 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="sv-section-icon-wrap">
                  <TriangleAlert class="h-5 w-5" :stroke-width="1.9" />
                </div>
                <h3 class="sv-card-title">Watch</h3>
              </div>
              <StatusBadge label="Review" variant="warning" />
            </div>
            <p class="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-black">{{ worstPerformer?.name }}</p>
            <div class="mt-4 grid grid-cols-2 gap-0 border-t border-black/[0.06] pt-4">
              <div class="min-w-0 border-r border-black/[0.06] pr-3">
                <p class="sv-section-title">ROAS</p>
                <p class="mt-1.5 text-[15px] font-semibold tabular-nums text-black">
                  {{ worstPerformer ? formatMultiplier(worstPerformer.revenue / worstPerformer.spend, 1) : "—" }}
                </p>
              </div>
              <div class="min-w-0 pl-3">
                <p class="sv-section-title">CPA</p>
                <p class="mt-1.5 text-[15px] font-semibold tabular-nums text-black">
                  {{ worstPerformer ? formatCurrency(worstPerformer.spend / worstPerformer.leads) : "—" }}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <!-- Campaign workspace: intelligence + charts + cohort table -->
    <section class="grid grid-cols-12 gap-3 lg:gap-4">
      <div
        class="col-span-12 flex flex-col gap-3 border-b border-black/[0.06] pb-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div class="flex min-w-0 items-start gap-3">
          <div class="sv-section-icon-wrap">
            <Table2 class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div class="min-w-0">
            <h3 class="sv-card-title">Campaign Performance</h3>
            <p class="mt-1 max-w-xl text-[12px] leading-snug text-black/52">
              {{ filteredCampaigns.length }} campaigns in this view · mix, efficiency, and full cohort.
            </p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex min-h-[3rem] shrink-0 items-center gap-2 rounded-[var(--sv-radius-control)] border border-[var(--sv-line)] bg-white px-3.5 text-sm font-semibold text-black/85 shadow-[0_10px_24px_-26px_rgba(15,23,42,0.18)] transition hover:border-black/18 hover:bg-black/[0.02]"
        >
          <Layers3 class="h-4 w-4 text-black/55" :stroke-width="1.9" />
          Columns
        </button>
      </div>

      <!-- Insight strip -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 sm:col-span-6 xl:col-span-3">
        <div class="flex items-start justify-between gap-2">
          <p class="sv-section-title">Top Revenue</p>
          <Award class="h-4 w-4 shrink-0 text-black/35" :stroke-width="1.9" aria-hidden="true" />
        </div>
        <p class="mt-2 line-clamp-2 min-h-[2.5rem] text-[14px] font-semibold leading-snug text-black">
          {{ topRevenueCampaignIntel?.name ?? "—" }}
        </p>
        <div class="mt-3 flex flex-wrap items-end justify-between gap-2">
          <StatusBadge
            v-if="topRevenueCampaignIntel"
            :label="topRevenueCampaignIntel.channel"
            :variant="channelVariant(topRevenueCampaignIntel.channel)"
          />
          <span v-else class="text-[13px] text-black/40">No data</span>
          <span class="text-[15px] font-semibold tabular-nums text-black">
            {{ topRevenueCampaignIntel ? formatCompactCurrency(topRevenueCampaignIntel.revenue) : "—" }}
          </span>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 sm:col-span-6 xl:col-span-3">
        <div class="flex items-start justify-between gap-2">
          <p class="sv-section-title">Highest ROAS</p>
          <TrendingUp class="h-4 w-4 shrink-0 text-black/35" :stroke-width="1.9" aria-hidden="true" />
        </div>
        <p class="mt-2 line-clamp-2 min-h-[2.5rem] text-[14px] font-semibold leading-snug text-black">
          {{ topRoasCampaignIntel?.name ?? "—" }}
        </p>
        <div class="mt-3 flex flex-wrap items-end justify-between gap-2">
          <span class="text-[12px] text-black/48">Return / spend</span>
          <span class="text-[15px] font-semibold tabular-nums text-black">
            {{ topRoasCampaignIntel ? formatMultiplier(campaignRoas(topRoasCampaignIntel), 1) : "—" }}
          </span>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 sm:col-span-6 xl:col-span-3">
        <div class="flex items-start justify-between gap-2">
          <p class="sv-section-title">Needs Attention</p>
          <Eye class="h-4 w-4 shrink-0 text-black/35" :stroke-width="1.9" aria-hidden="true" />
        </div>
        <p class="mt-2 line-clamp-2 min-h-[2.5rem] text-[14px] font-semibold leading-snug text-black">
          {{ watchlistCampaignIntel?.name ?? "—" }}
        </p>
        <div class="mt-3 flex flex-wrap items-end justify-between gap-2">
          <StatusBadge
            v-if="watchlistCampaignIntel"
            :label="watchlistCampaignIntel.status"
            :variant="statusVariant(watchlistCampaignIntel.status)"
          />
          <span v-else class="text-[13px] text-black/40">—</span>
          <span class="text-[15px] font-semibold tabular-nums text-black">
            {{ watchlistCampaignIntel ? formatMultiplier(campaignRoas(watchlistCampaignIntel), 1) : "—" }}
          </span>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 sm:col-span-6 xl:col-span-3">
        <div class="flex items-start justify-between gap-2">
          <p class="sv-section-title">Spend Concentration</p>
          <PieChart class="h-4 w-4 shrink-0 text-black/35" :stroke-width="1.9" aria-hidden="true" />
        </div>
        <p class="mt-2 text-[13px] leading-snug text-black/55">
          Leading campaign holds
          <span class="font-semibold tabular-nums text-black/80">{{ spendConcentrationIntel.topPct.toFixed(0) }}%</span>
          of spend · top three
          <span class="font-semibold tabular-nums text-black/80">{{ spendConcentrationIntel.topThreePct.toFixed(0) }}%</span>
        </p>
        <div class="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div class="flex h-full w-full">
            <div
              v-for="(seg, idx) in spendConcentrationIntel.segments"
              :key="idx"
              class="h-full min-w-0 first:rounded-l-full last:rounded-r-full"
              :style="{ width: `${seg.pct}%`, backgroundColor: seg.color }"
            />
          </div>
        </div>
      </SurfaceCard>

      <!-- Charts row -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-3 xl:col-span-7">
        <div>
          <h4 class="sv-card-title">Revenue vs Spend</h4>
          <p class="mt-1 text-[12px] text-black/48">Top campaigns by revenue · scaled to the cohort max.</p>
        </div>
        <AnalyticsCampaignRevSpendBars
          v-if="campaignRevSpendChartRows.length"
          :rows="campaignRevSpendChartRows"
          :format-revenue="formatCompactCurrency"
          :format-spend="formatCompactCurrency"
        />
        <p v-else class="py-6 text-center text-[13px] text-black/45">No campaigns match the current filters.</p>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-3 xl:col-span-5">
        <div>
          <h4 class="sv-card-title">Objective Mix</h4>
          <p class="mt-1 text-[12px] text-black/48">Share of revenue by campaign objective.</p>
        </div>
        <AnalyticsConicDonutLite
          v-if="objectiveMixSegments.length"
          :segments="objectiveMixSegments"
          center-label="Revenue"
          :center-value="campaignWorkspaceRevenueTotal"
        />
        <p v-else class="py-6 text-center text-[13px] text-black/45">No objective data.</p>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-3 lg:col-span-6">
        <div>
          <h4 class="sv-card-title">ROAS Ranking</h4>
          <p class="mt-1 text-[12px] text-black/48">Efficiency order · higher is better.</p>
        </div>
        <AnalyticsMetricHBarRank
          v-if="roasRankChartRows.length"
          :rows="roasRankChartRows"
          :format-value="formatRoasBarValue"
        />
        <p v-else class="py-6 text-center text-[13px] text-black/45">No ROAS data.</p>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-3 lg:col-span-6">
        <div>
          <h4 class="sv-card-title">Status Mix</h4>
          <p class="mt-1 text-[12px] text-black/48">Share of spend by lifecycle status.</p>
        </div>
        <AnalyticsConicDonutLite
          v-if="statusMixSegments.length"
          :segments="statusMixSegments"
          center-label="Spend"
          :center-value="campaignWorkspaceSpendTotal"
        />
        <p v-else class="py-6 text-center text-[13px] text-black/45">No status data.</p>
      </SurfaceCard>

      <!-- Cohort table -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 overflow-hidden p-0">
        <div class="border-b border-black/[0.06] px-4 py-3 sm:px-5 sm:py-4">
          <h4 class="sv-card-title">Campaign Detail</h4>
          <p class="mt-1 text-[12px] text-black/50">
            Cohort table plus a drill-down for the selected campaign — click a row to switch.
          </p>
        </div>

        <div
          v-if="selectedCampaign"
          class="border-b border-black/[0.06] bg-gradient-to-b from-black/[0.02] to-transparent px-4 py-4 sm:px-5"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div class="min-w-0 flex-1">
              <p class="sv-section-title">Drill-down</p>
              <p class="mt-1.5 text-[15px] font-semibold leading-snug text-black">
                {{ selectedCampaign.name }}
              </p>
              <p class="mt-2 max-w-2xl text-[13px] leading-relaxed text-black/55">
                {{ campaignDetailInsight(selectedCampaign) }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <StatusBadge :label="selectedCampaign.objective" variant="info" />
                <StatusBadge :label="selectedCampaign.deviceMix" variant="neutral" />
                <StatusBadge :label="selectedCampaign.status" :variant="statusVariant(selectedCampaign.status)" />
              </div>
            </div>
            <dl
              class="grid min-w-0 shrink-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:max-w-[28rem] lg:grid-cols-4"
            >
              <div>
                <dt class="sv-section-title">Pipeline</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ formatCompactCurrency(selectedCampaign.pipeline) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">SQLs</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ formatCompactNumber(selectedCampaign.sqls) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Customers</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ formatCompactNumber(selectedCampaign.purchases) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Leads</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ formatCompactNumber(selectedCampaign.leads) }}
                </dd>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <dt class="sv-section-title">Demo · creatives in test</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ campaignDemoSatellite(selectedCampaign.id).creativesInTest }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Demo · sync</dt>
                <dd class="mt-1 text-[13px] font-medium text-black/70">
                  {{ campaignDemoSatellite(selectedCampaign.id).syncLabel }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Demo · audience overlap</dt>
                <dd class="mt-1 text-[14px] font-semibold tabular-nums text-black">
                  {{ campaignDemoSatellite(selectedCampaign.id).audienceOverlap }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <DataTable
          embed
          :columns="columns"
          :rows="campaignRows"
          row-key="id"
          :highlight-row-key="selectedCampaignId"
          @row-click="onCampaignTableRowClick"
        >
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
      </SurfaceCard>
    </section>
  </div>
</template>
