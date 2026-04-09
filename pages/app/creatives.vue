<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  Download,
  Layers3,
  Palette,
  Sparkles,
  Table2,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
} from "lucide-vue-next";
import AnalyticsLineChart from "~/components/app/analytics/AnalyticsLineChart.vue";
import CreativeVariantThumb from "~/components/app/creatives/CreativeVariantThumb.vue";
import adGrid1 from "~/assets/images/creatives/ad_grid_1.png";
import adGrid2 from "~/assets/images/creatives/ad_grid_2.png";
import adGrid3 from "~/assets/images/creatives/ad_grid_3.png";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Creatives — Solvomo" });

const { dataStatus } = useAppData();
const {
  reportingMeta,
  performanceCampaigns,
  performanceTrend,
  creativeAssets,
  creativeFormats,
  creativePlatforms,
  creativeFormatBreakdown,
  creativeInsights,
  formatCompactCurrency,
  formatCompactNumber,
  formatPercent,
  formatMultiplier,
  channelVariant,
  statusVariant,
} = useDemoAnalytics();

const adGridImages = [adGrid1, adGrid2, adGrid3] as const;

type CreativeAsset = (typeof creativeAssets)[number];

const selectedRange = ref("Last 30 days");
const selectedFormat = ref("All formats");
const selectedPlatform = ref("All platforms");
const selectedRegion = ref("All regions");
const compareEnabled = ref(true);
const sortLeaderboard = ref<"revenue" | "roas" | "fatigue">("revenue");

const creativeRegionOptions = computed(() => {
  const set = new Set<string>();
  performanceCampaigns.forEach((c) => set.add(c.region));
  return ["All regions", ...Array.from(set).sort()];
});

function campaignRegionForAsset(asset: CreativeAsset) {
  return performanceCampaigns.find((c) => c.id === asset.campaignId)?.region ?? "";
}

function gridImageForAsset(asset: CreativeAsset) {
  let h = 0;
  for (let i = 0; i < asset.id.length; i += 1) h = (h * 31 + asset.id.charCodeAt(i)) >>> 0;
  const idx = h % adGridImages.length;
  return { src: adGridImages[idx]!, sheet: (idx + 1) as 1 | 2 | 3 };
}

function baseVariantForAsset(asset: CreativeAsset) {
  let h = 0;
  for (let i = 0; i < asset.id.length; i += 1) h = (h * 33 + asset.id.charCodeAt(i)) >>> 0;
  return h % 6;
}

function variantForAsset(asset: CreativeAsset, offset = 0) {
  return (baseVariantForAsset(asset) + offset) % 6;
}

function assetForTableRow(id: string): CreativeAsset {
  return filteredAssets.value.find((a) => a.id === id) ?? filteredAssets.value[0] ?? creativeAssets[0]!;
}

function cvrFromAsset(asset: CreativeAsset) {
  const clicks = asset.impressions * (asset.ctr / 100);
  return clicks > 0 ? (asset.conversions / clicks) * 100 : 0;
}

function fatigueLabel(score: number) {
  if (score >= 60) return "Fatigue risk";
  if (score >= 40) return "Watch";
  return "Fresh";
}

const filteredAssets = computed(() =>
  creativeAssets.filter((asset: CreativeAsset) => {
    if (selectedFormat.value !== "All formats" && asset.format !== selectedFormat.value) return false;
    if (selectedPlatform.value !== "All platforms" && asset.platform !== selectedPlatform.value) return false;
    if (selectedRegion.value !== "All regions" && campaignRegionForAsset(asset) !== selectedRegion.value) return false;
    return true;
  }),
);

const metadataItems = computed(() => [
  { label: "Last synced", value: reportingMeta.lastSynced },
  { label: "Compared", value: reportingMeta.comparisonLabel },
  { label: "Tracked creatives", value: `${filteredAssets.value.length}` },
  { label: "Coverage", value: "76% of visual spend" },
]);

const creativeTotals = computed(() => {
  const assets = filteredAssets.value;
  const spend = assets.reduce((total: number, asset: CreativeAsset) => total + asset.spend, 0);
  const impressions = assets.reduce((total: number, asset: CreativeAsset) => total + asset.impressions, 0);
  const revenue = assets.reduce((total: number, asset: CreativeAsset) => total + asset.revenue, 0);
  const weightedCtr = assets.reduce((total: number, asset: CreativeAsset) => total + asset.ctr * asset.impressions, 0);

  return {
    spend,
    impressions,
    revenue,
    ctr: impressions ? weightedCtr / impressions : 0,
    roas: spend ? revenue / spend : 0,
  };
});

/** Executive KPI row — fewer metrics, clearer hierarchy (aligned with Performance density). */
const kpis = computed(() => [
  {
    title: "Tracked spend",
    value: formatCompactCurrency(creativeTotals.value.spend),
    delta: "+7.2%",
    helper: "Visual media",
    tone: "info" as const,
    icon: Target,
    trend: filteredAssets.value.map((asset) => asset.spend / 1000),
  },
  {
    title: "Creative revenue",
    value: formatCompactCurrency(creativeTotals.value.revenue),
    delta: "+12.1%",
    helper: "Attributed",
    tone: "success" as const,
    icon: TrendingUp,
    trend: filteredAssets.value.map((asset) => asset.revenue / 1000),
  },
  {
    title: "Blended CTR",
    value: formatPercent(creativeTotals.value.ctr),
    delta: "+0.09 pts",
    helper: "Weighted",
    tone: "success" as const,
    icon: Target,
    trend: filteredAssets.value.map((asset) => asset.ctr),
  },
  {
    title: "ROAS",
    value: formatMultiplier(creativeTotals.value.roas, 1),
    delta: "+0.5x",
    helper: "Asset cohort",
    tone: "success" as const,
    icon: TrendingUp,
    trend: filteredAssets.value.map((asset) => asset.revenue / Math.max(asset.spend, 1)),
  },
]);

const galleryAssets = computed(() =>
  [...filteredAssets.value].sort((left, right) => right.revenue - left.revenue).slice(0, 4),
);

const intelligencePreviews = computed(() =>
  [...filteredAssets.value].sort((left, right) => right.revenue - left.revenue).slice(0, 3),
);

const fatiguedCreatives = computed(() =>
  [...filteredAssets.value].sort((left, right) => right.fatigueScore - left.fatigueScore).slice(0, 3),
);

const bestVariation = computed(() =>
  [...filteredAssets.value]
    .filter((a) => a.spend > 0)
    .sort((a, b) => b.revenue / b.spend - a.revenue / a.spend)[0] ?? null,
);

const worstWatch = computed(() =>
  [...filteredAssets.value]
    .filter((a) => a.spend > 0)
    .sort((a, b) => a.revenue / a.spend - b.revenue / b.spend)[0] ?? null,
);

const healthCards = computed(() => [
  {
    label: "Scaling",
    value: `${filteredAssets.value.filter((asset) => asset.status === "Scaling" || asset.status === "Efficient").length}`,
    meta: "Active winners",
    icon: TrendingUp,
  },
  {
    label: "Fatigue risk",
    value: `${filteredAssets.value.filter((asset) => asset.fatigueScore >= 55).length}`,
    meta: "Needs refresh",
    icon: TrendingDown,
  },
  {
    label: "Avg freshness",
    value: `${Math.round(100 - filteredAssets.value.reduce((sum, asset) => sum + asset.fatigueScore, 0) / Math.max(filteredAssets.value.length, 1))}`,
    meta: "Creative score / 100",
    icon: Sparkles,
  },
]);

const formatSegments = computed(() =>
  creativeFormatBreakdown.value.map((item, index) => ({
    label: item.label,
    value: item.spend,
    valueLabel: formatCompactCurrency(item.spend),
    tone: index === 0 ? "depth" : index === 1 ? "product" : index === 2 ? "brand" : "neutral",
  })),
);

const formatRows = computed(() =>
  creativeFormatBreakdown.value.map((item) => ({
    label: item.label,
    value: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    secondary: `${formatCompactCurrency(item.spend)} spend · ${formatCompactNumber(item.conversions)} conv.`,
    meta: `${formatPercent(item.ctr)} CTR · ${formatMultiplier(item.roas, 1)} ROAS`,
  })),
);

const quickSignals = computed(() => [
  { label: "UGC cluster strong", variant: "success" as const },
  { label: "Carousel retargeting", variant: "info" as const },
  { label: "Static fatigue", variant: "warning" as const },
  { label: "Refresh LinkedIn proof", variant: "danger" as const },
]);

type VariantIntel = {
  variant: number;
  ctr: number;
  roas: number;
  spend: number;
  fatigue: number;
  label: string;
};

function variantIntel(asset: CreativeAsset, variant: number): VariantIntel {
  // Demo-only: derive slight variance per tile so the UI can communicate “iteration/testing”.
  const base = baseVariantForAsset(asset);
  const delta = (variant - base + 6) % 6;
  const roasBase = asset.revenue / Math.max(asset.spend, 1);
  const roas = roasBase * (1.08 - delta * 0.03);
  const ctr = Math.max(0.05, asset.ctr * (1.06 - delta * 0.02));
  const spend = asset.spend * (1.0 - delta * 0.06);
  const fatigue = Math.min(95, Math.max(4, asset.fatigueScore + delta * 7));
  const label = delta === 0 ? "Winner" : delta >= 4 ? "Weak" : "Alt";
  return { variant, ctr, roas, spend, fatigue, label };
}

function familyVariants(asset: CreativeAsset) {
  const variants = [0, 1, 2, 3, 4, 5].map((v) => variantIntel(asset, v));
  const winner = [...variants].sort((a, b) => b.roas - a.roas)[0]!;
  const weak = [...variants].sort((a, b) => a.roas - b.roas)[0]!;
  return { variants, winner, weak };
}

const creativeTrendSeries = computed(() => {
  const base = performanceTrend.map((point) => point.revenue * 0.085);
  const previous = base.map((value, index) => Number((value * (0.92 + (index % 4) * 0.02)).toFixed(0)));
  return {
    labels: performanceTrend.map((point) => point.label),
    formatter: formatCompactCurrency,
    series: compareEnabled.value
      ? [
          { label: "Creative revenue", values: base, color: "depth" as const },
          { label: "Previous", values: previous, color: "brand" as const },
        ]
      : [{ label: "Creative revenue", values: base, color: "depth" as const }],
  };
});

const sortedForTable = computed(() => {
  const rows = [...filteredAssets.value];
  switch (sortLeaderboard.value) {
    case "roas":
      rows.sort((a, b) => b.revenue / Math.max(b.spend, 1) - a.revenue / Math.max(a.spend, 1));
      break;
    case "fatigue":
      rows.sort((a, b) => b.fatigueScore - a.fatigueScore);
      break;
    default:
      rows.sort((a, b) => b.revenue - a.revenue);
  }
  return rows;
});

const tableRows = computed(() =>
  sortedForTable.value.map((asset) => ({
    id: asset.id,
    name: asset.name,
    format: asset.format,
    platform: asset.platform,
    spend: formatCompactCurrency(asset.spend),
    ctr: formatPercent(asset.ctr),
    cvr: formatPercent(cvrFromAsset(asset)),
    roas: formatMultiplier(asset.revenue / asset.spend, 1),
    status: asset.status,
    fatigue: `${asset.fatigueScore}`,
    fatigueLabel: fatigueLabel(asset.fatigueScore),
    daysLive: `${asset.daysLive}d`,
  })),
);

const columns: DataTableColumn[] = [
  { key: "name", label: "Creative" },
  { key: "format", label: "Format" },
  { key: "spend", label: "Spend" },
  { key: "ctr", label: "CTR" },
  { key: "cvr", label: "CVR" },
  { key: "roas", label: "ROAS" },
  { key: "fatigue", label: "Fatigue" },
  { key: "status", label: "Status" },
];

const sectionIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.02] text-black/62";

const sectionIconClassSm =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/8 bg-black/[0.02] text-black/62";

function kpiColClass(index: number) {
  return index < 2 ? "col-span-12 sm:col-span-6" : "col-span-12 sm:col-span-6 xl:col-span-3";
}
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Creatives" dense metadata-tight hide-context />

    <FilterBar compact>
      <div class="flex min-w-0 flex-col gap-1.5">
        <span class="sv-section-title">Period</span>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="option in ['Last 30 days', 'Last 8 weeks', 'Quarter to date']"
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
      <div class="flex shrink-0 flex-col gap-1.5">
        <label for="cr-filter-format" class="sv-section-title">Format</label>
        <select id="cr-filter-format" v-model="selectedFormat" class="app-control w-[11.5rem]">
          <option v-for="option in creativeFormats" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex shrink-0 flex-col gap-1.5">
        <label for="cr-filter-platform" class="sv-section-title">Platform</label>
        <select id="cr-filter-platform" v-model="selectedPlatform" class="app-control w-[11.5rem]">
          <option v-for="option in creativePlatforms" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex shrink-0 flex-col gap-1.5">
        <label for="cr-filter-region" class="sv-section-title">Region</label>
        <select id="cr-filter-region" v-model="selectedRegion" class="app-control w-[12.5rem]">
          <option v-for="option in creativeRegionOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex shrink-0 flex-col gap-1.5">
        <label for="cr-sort" class="sv-section-title">Sort table</label>
        <select id="cr-sort" v-model="sortLeaderboard" class="app-control w-[10.75rem]">
          <option value="revenue">By revenue</option>
          <option value="roas">By ROAS</option>
          <option value="fatigue">By fatigue</option>
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
          v-for="chip in quickSignals"
          :key="chip.label"
          :label="chip.label"
          :variant="chip.variant"
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

      <!-- Creative intelligence hero -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-w-0">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <div :class="sectionIconClass">
              <Sparkles class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div class="min-w-0">
              <h3 class="sv-card-title">Creative intelligence</h3>
              <p class="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-black/52">
                Visual-first read on what is winning, what is tiring, and where spend is concentrated — not a spreadsheet of
                every sub-metric.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 grid gap-3 lg:grid-cols-3">
          <article
            v-for="asset in intelligencePreviews"
            :key="asset.id"
            class="sv-card-inset rounded-[1.25rem] border border-black/[0.06] bg-white/90 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-[13px] font-semibold text-black">{{ asset.name }}</p>
                <p class="mt-1 text-[11px] text-black/45">Family variants · {{ asset.format }} · {{ asset.platform }}</p>
              </div>
              <StatusBadge
                :label="fatigueLabel(asset.fatigueScore)"
                :variant="asset.fatigueScore >= 55 ? 'warning' : 'success'"
              />
            </div>

            <div class="mt-4 grid grid-cols-3 gap-3">
              <CreativeVariantThumb
                v-for="item in familyVariants(asset).variants"
                :key="`v-${asset.id}-${item.variant}`"
                :src="gridImageForAsset(asset).src"
                :sheet="gridImageForAsset(asset).sheet"
                :variant="item.variant"
                :alt="`${asset.name} variant ${item.variant + 1}`"
                frame-class="aspect-[9/16] w-full rounded-[0.9rem] border-black/[0.08]"
                crop-class="h-full w-full"
              />
            </div>

            <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-black/58">
              <div class="flex items-center gap-2">
                <span class="sv-section-title">Winner</span>
                <span class="font-semibold tabular-nums text-black">
                  v{{ familyVariants(asset).winner.variant + 1 }} · {{ formatMultiplier(familyVariants(asset).winner.roas, 1) }} ROAS
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="sv-section-title">Weak</span>
                <span class="font-semibold tabular-nums text-black/70">
                  v{{ familyVariants(asset).weak.variant + 1 }} · {{ formatPercent(familyVariants(asset).weak.ctr) }} CTR
                </span>
              </div>
            </div>
          </article>
        </div>
      </SurfaceCard>

      <!-- Top creatives + variation / watch -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-h-0 lg:col-span-7">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div :class="sectionIconClass">
              <Palette class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <h3 class="sv-card-title">Top creatives</h3>
              <p class="mt-0.5 text-[12px] text-black/48">Preview tiles from tracked ad grids</p>
            </div>
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <article
            v-for="asset in galleryAssets"
            :key="asset.id"
            class="group overflow-hidden rounded-[1.15rem] border border-black/[0.07] bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]"
          >
            <div class="relative aspect-[4/3] overflow-hidden border-b border-black/[0.05] bg-black/[0.03]">
              <div class="absolute inset-0 p-4">
                <div class="grid h-full grid-cols-2 gap-3">
                  <CreativeVariantThumb
                    v-for="idx in [0, 1]"
                    :key="`top-${asset.id}-${idx}`"
                    :src="gridImageForAsset(asset).src"
                    :sheet="gridImageForAsset(asset).sheet"
                    :variant="variantForAsset(asset, idx)"
                    :alt="`${asset.name} variant ${variantForAsset(asset, idx) + 1}`"
                    frame-class="aspect-[9/16] w-full rounded-[0.9rem] border-black/[0.08]"
                    crop-class="h-full w-full"
                  />
                </div>
              </div>
              <div class="absolute left-2 top-2 flex items-center gap-1.5">
                <span
                  class="rounded-full border border-black/[0.08] bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-black/55"
                >
                  {{ asset.format }}
                </span>
              </div>
            </div>
            <div class="p-3.5">
              <div class="flex items-start justify-between gap-2">
                <p class="line-clamp-2 min-w-0 text-[13px] font-semibold leading-snug text-black">{{ asset.name }}</p>
                <StatusBadge :label="asset.status" :variant="statusVariant(asset.status)" />
              </div>
              <p class="mt-1 text-[11px] text-black/45">{{ campaignRegionForAsset(asset) }} · {{ asset.daysLive }}d live</p>
              <div class="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <p class="sv-section-title">CTR</p>
                  <p class="mt-0.5 font-semibold tabular-nums text-black">{{ formatPercent(asset.ctr) }}</p>
                </div>
                <div>
                  <p class="sv-section-title">CVR</p>
                  <p class="mt-0.5 font-semibold tabular-nums text-black">{{ formatPercent(cvrFromAsset(asset)) }}</p>
                </div>
                <div>
                  <p class="sv-section-title">Spend</p>
                  <p class="mt-0.5 font-semibold tabular-nums text-black">{{ formatCompactCurrency(asset.spend) }}</p>
                </div>
                <div>
                  <p class="sv-section-title">ROAS</p>
                  <p class="mt-0.5 font-semibold tabular-nums text-black">{{ formatMultiplier(asset.revenue / asset.spend, 1) }}</p>
                </div>
              </div>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <StatusBadge :label="fatigueLabel(asset.fatigueScore)" :variant="asset.fatigueScore >= 55 ? 'warning' : 'success'" />
                <StatusBadge :label="asset.platform" :variant="channelVariant(asset.platform)" />
              </div>
            </div>
          </article>
        </div>
      </SurfaceCard>

      <div class="col-span-12 flex min-h-0 flex-col gap-4 lg:col-span-5">
        <SurfaceCard v-if="bestVariation && worstWatch" variant="frame" padding="sm" class="min-w-0">
          <div class="mb-3 flex items-center gap-3">
            <div :class="sectionIconClass">
              <Layers3 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <h3 class="sv-card-title">Variation check</h3>
              <p class="mt-0.5 text-[12px] text-black/48">Best vs underperforming</p>
            </div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-[1rem] border border-black/[0.06] bg-black/[0.02] p-3">
              <p class="sv-section-title">Top ROAS</p>
              <div class="mt-2 flex gap-2">
                <CreativeVariantThumb
                  :src="gridImageForAsset(bestVariation).src"
                  :sheet="gridImageForAsset(bestVariation).sheet"
                  :variant="variantForAsset(bestVariation, 0)"
                  :alt="`${bestVariation.name} winner variant`"
                  frame-class="h-16 w-12 shrink-0 rounded-[0.85rem] border-black/[0.08]"
                  crop-class="h-full w-full"
                />
                <div class="min-w-0">
                  <p class="line-clamp-2 text-[12px] font-semibold leading-snug text-black">{{ bestVariation.name }}</p>
                  <p class="mt-1 text-[13px] font-semibold tabular-nums text-black">
                    {{ formatMultiplier(bestVariation.revenue / bestVariation.spend, 1) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="rounded-[1rem] border border-black/[0.06] bg-black/[0.02] p-3">
              <p class="sv-section-title">Watchlist</p>
              <div class="mt-2 flex gap-2">
                <CreativeVariantThumb
                  :src="gridImageForAsset(worstWatch).src"
                  :sheet="gridImageForAsset(worstWatch).sheet"
                  :variant="variantForAsset(worstWatch, 2)"
                  :alt="`${worstWatch.name} watch variant`"
                  frame-class="h-16 w-12 shrink-0 rounded-[0.85rem] border-black/[0.08]"
                  crop-class="h-full w-full"
                />
                <div class="min-w-0">
                  <p class="line-clamp-2 text-[12px] font-semibold leading-snug text-black">{{ worstWatch.name }}</p>
                  <p class="mt-1 text-[13px] font-semibold tabular-nums text-black/70">
                    {{ formatMultiplier(worstWatch.revenue / worstWatch.spend, 1) }} ROAS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="product" padding="sm" class="min-w-0">
          <div class="mb-3 flex items-center gap-3">
            <div :class="sectionIconClass">
              <Sparkles class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <h3 class="sv-card-title">Signals</h3>
              <p class="mt-0.5 text-[12px] text-black/48">Patterns from your library</p>
            </div>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="insight in creativeInsights"
              :key="insight.title"
              class="rounded-[1rem] border border-black/[0.06] bg-white/90 px-3.5 py-3"
            >
              <p class="sv-section-title">{{ insight.title }}</p>
              <p class="mt-1 text-[13px] font-semibold text-black">{{ insight.value }}</p>
              <p class="mt-1.5 text-[12px] leading-relaxed text-black/50">{{ insight.note }}</p>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <!-- Trend -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-h-0 min-w-0 flex-col gap-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div :class="sectionIconClass">
              <TrendingUp class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <h3 class="sv-card-title">Creative performance trend</h3>
              <p class="mt-0.5 text-[12px] text-black/48">Attributed creative revenue · {{ reportingMeta.comparisonLabel }}</p>
            </div>
          </div>
        </div>
        <AnalyticsLineChart
          :labels="creativeTrendSeries.labels"
          :series="creativeTrendSeries.series"
          :value-formatter="creativeTrendSeries.formatter"
          variant="area"
          compact
        />
      </SurfaceCard>

      <!-- Allocation | Fatigue — side by side with deliberate gutter -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-h-0 lg:col-span-6">
        <div class="mb-4 flex items-center gap-3">
          <div :class="sectionIconClass">
            <Layers3 class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div>
            <h3 class="sv-card-title">Spend allocation</h3>
            <p class="mt-0.5 text-[12px] text-black/48">By format</p>
          </div>
        </div>
        <AnalyticsSegmentBar :segments="formatSegments" />
        <AnalyticsBarsList :items="formatRows" />
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-h-0 lg:col-span-6">
        <div class="mb-4 flex items-center gap-3">
          <div :class="sectionIconClass">
            <TimerReset class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div>
            <h3 class="sv-card-title">Fatigue &amp; health</h3>
            <p class="mt-0.5 text-[12px] text-black/48">Who needs a refresh</p>
          </div>
        </div>
        <div class="mb-6 grid gap-2.5">
          <div
            v-for="card in healthCards"
            :key="card.label"
            class="flex items-center justify-between gap-3 rounded-[1rem] border border-black/[0.06] bg-black/[0.02] px-3.5 py-3"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div :class="sectionIconClassSm">
                <component :is="card.icon" class="h-4 w-4" :stroke-width="1.9" />
              </div>
              <div class="min-w-0">
                <p class="sv-section-title">{{ card.label }}</p>
                <p class="mt-0.5 text-[12px] text-black/48">{{ card.meta }}</p>
              </div>
            </div>
            <p class="shrink-0 text-[15px] font-semibold tabular-nums text-black">{{ card.value }}</p>
          </div>
        </div>
        <p class="mb-3 sv-section-title">Highest fatigue</p>
        <div class="space-y-3">
          <div
            v-for="asset in fatiguedCreatives"
            :key="asset.id"
            class="flex gap-3 rounded-[1rem] border border-black/[0.06] bg-white/90 p-3"
          >
            <CreativeVariantThumb
              :src="gridImageForAsset(asset).src"
              :sheet="gridImageForAsset(asset).sheet"
              :variant="variantForAsset(asset, 4)"
              :alt="`${asset.name} fatigued variant`"
              frame-class="h-16 w-12 shrink-0 rounded-[0.85rem] border-black/[0.08]"
              crop-class="h-full w-full"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <p class="truncate text-[13px] font-semibold text-black">{{ asset.name }}</p>
                <StatusBadge
                  :label="`${asset.fatigueScore}`"
                  :variant="asset.fatigueScore >= 65 ? 'danger' : 'warning'"
                />
              </div>
              <p class="mt-0.5 text-[11px] text-black/45">{{ asset.daysLive }}d live · {{ asset.secondaryTag }}</p>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(216,143,141,0.92),rgba(245,158,11,0.92))]"
                  :style="{ width: `${Math.min(100, asset.fatigueScore)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <!-- Detailed listing -->
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-w-0">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div :class="sectionIconClass">
              <Table2 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <h3 class="sv-card-title">Creative library</h3>
              <p class="mt-0.5 text-[12px] text-black/48">Full list · sort with control above</p>
            </div>
          </div>
        </div>
        <DataTable :columns="columns" :rows="tableRows" row-key="id" embed>
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <CreativeVariantThumb
                :src="gridImageForAsset(assetForTableRow(String(row.id))).src"
                :sheet="gridImageForAsset(assetForTableRow(String(row.id))).sheet"
                :variant="variantForAsset(assetForTableRow(String(row.id)), 1)"
                :alt="`${row.name} thumbnail`"
                frame-class="h-12 w-10 shrink-0 rounded-[0.85rem] border-black/[0.08]"
                crop-class="h-full w-full"
              />
              <div class="min-w-0">
                <p class="font-semibold text-black">{{ row.name }}</p>
                <p class="mt-0.5 text-[11px] text-black/45">{{ row.platform }} · {{ row.daysLive }}</p>
              </div>
            </div>
          </template>
          <template #cell-format="{ value }">
            <StatusBadge :label="String(value)" variant="neutral" />
          </template>
          <template #cell-roas="{ value }">
            <span class="font-semibold tabular-nums text-black">{{ value }}</span>
          </template>
          <template #cell-status="{ value }">
            <StatusBadge :label="String(value)" :variant="statusVariant(String(value))" />
          </template>
          <template #cell-fatigue="{ row }">
            <div class="flex flex-col items-start gap-1">
              <span class="font-semibold tabular-nums text-black">{{ row.fatigue }}</span>
              <span class="text-[11px] text-black/45">{{ row.fatigueLabel }}</span>
            </div>
          </template>
        </DataTable>
      </SurfaceCard>
    </section>
  </div>
</template>
