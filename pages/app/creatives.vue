<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  CircleUserRound,
  Download,
  GitCompareArrows,
  Image as ImageIcon,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Creatives — Solvomo" });

const {
  reportingMeta,
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

type CreativeAsset = (typeof creativeAssets)[number];

const selectedRange = ref("Last 30 days");
const selectedFormat = ref("All formats");
const selectedPlatform = ref("All platforms");
const compareEnabled = ref(true);

const filteredAssets = computed(() =>
  creativeAssets.filter((asset: CreativeAsset) => {
    if (selectedFormat.value !== "All formats" && asset.format !== selectedFormat.value) return false;
    if (selectedPlatform.value !== "All platforms" && asset.platform !== selectedPlatform.value) return false;
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
  const spend = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.spend, 0);
  const impressions = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.impressions, 0);
  const revenue = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.revenue, 0);
  const conversions = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.conversions, 0);
  const weightedCtr = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.ctr * asset.impressions, 0);
  const weightedHook = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.hookRate * asset.impressions, 0);
  const weightedHold = filteredAssets.value.reduce((total: number, asset: CreativeAsset) => total + asset.holdRate * asset.impressions, 0);

  return {
    spend,
    impressions,
    revenue,
    conversions,
    ctr: impressions ? weightedCtr / impressions : 0,
    hookRate: impressions ? weightedHook / impressions : 0,
    holdRate: impressions ? weightedHold / impressions : 0,
    roas: spend ? revenue / spend : 0,
  };
});

const kpis = computed(() => [
  { title: "Tracked spend", value: formatCompactCurrency(creativeTotals.value.spend), delta: "+7.2%", helper: "Visual media", tone: "info" as const, icon: Zap, trend: filteredAssets.value.map((asset) => asset.spend / 1000) },
  { title: "Creative revenue", value: formatCompactCurrency(creativeTotals.value.revenue), delta: "+12.1%", helper: "Attributed", tone: "success" as const, icon: TrendingUp, trend: filteredAssets.value.map((asset) => asset.revenue / 1000) },
  { title: "CTR", value: formatPercent(creativeTotals.value.ctr), delta: "+0.09 pts", helper: "Weighted", tone: "success" as const, icon: Target, trend: filteredAssets.value.map((asset) => asset.ctr) },
  { title: "Hook rate", value: formatPercent(creativeTotals.value.hookRate, 1), delta: "+1.4 pts", helper: "3-sec", tone: "info" as const, icon: Sparkles, trend: filteredAssets.value.map((asset) => asset.hookRate) },
  { title: "Hold rate", value: formatPercent(creativeTotals.value.holdRate, 1), delta: "+0.8 pts", helper: "Retention", tone: "info" as const, icon: ShieldCheck, trend: filteredAssets.value.map((asset) => asset.holdRate) },
  { title: "ROAS", value: formatMultiplier(creativeTotals.value.roas, 1), delta: "+0.5x", helper: "Asset cohort", tone: "success" as const, icon: TrendingUp, trend: filteredAssets.value.map((asset) => asset.revenue / asset.spend) },
]);

const galleryAssets = computed(() =>
  [...filteredAssets.value]
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 4),
);

const fatiguedCreatives = computed(() =>
  [...filteredAssets.value]
    .sort((left, right) => right.fatigueScore - left.fatigueScore)
    .slice(0, 4),
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
    label: "Avg health",
    value: `${Math.round(100 - (filteredAssets.value.reduce((sum, asset) => sum + asset.fatigueScore, 0) / Math.max(filteredAssets.value.length, 1)))} / 100`,
    meta: "Creative score",
    icon: ShieldCheck,
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
  { label: "High CTR", variant: "success" as const },
  { label: "Fatigue Risk", variant: "danger" as const },
  { label: "Scaling", variant: "info" as const },
  { label: "Low Hook", variant: "warning" as const },
]);

const tableRows = computed(() =>
  [...filteredAssets.value]
    .sort((left, right) => right.revenue - left.revenue)
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
      format: asset.format,
      platform: asset.platform,
      spend: formatCompactCurrency(asset.spend),
      ctr: formatPercent(asset.ctr),
      hookRate: formatPercent(asset.hookRate, 1),
      holdRate: formatPercent(asset.holdRate, 1),
      conversions: formatCompactNumber(asset.conversions),
      roas: formatMultiplier(asset.revenue / asset.spend, 1),
      tags: `${asset.primaryTag} · ${asset.secondaryTag}`,
      status: asset.status,
      fatigue: `${asset.fatigueScore}`,
      daysLive: `${asset.daysLive}d`,
    })),
);

const columns: DataTableColumn[] = [
  { key: "name", label: "Creative" },
  { key: "format", label: "Format" },
  { key: "platform", label: "Platform" },
  { key: "spend", label: "Spend" },
  { key: "ctr", label: "CTR" },
  { key: "hookRate", label: "Hook" },
  { key: "holdRate", label: "Hold" },
  { key: "conversions", label: "Conv." },
  { key: "roas", label: "ROAS" },
  { key: "fatigue", label: "Fatigue" },
  { key: "status", label: "Status" },
];

function formatIconForAsset(asset: CreativeAsset) {
  if (asset.format === "Video") return Play;
  if (asset.format === "Carousel") return Layers3;
  if (asset.format === "UGC") return CircleUserRound;
  return ImageIcon;
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Creative">
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
          v-for="option in ['Last 30 days', 'Last 8 weeks', 'Quarter to date']"
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
      <select v-model="selectedFormat" class="app-control min-w-[11rem]">
        <option v-for="option in creativeFormats" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedPlatform" class="app-control min-w-[11rem]">
        <option v-for="option in creativePlatforms" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <button
        type="button"
        class="inline-flex min-h-[3rem] items-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/68"
        @click="compareEnabled = !compareEnabled"
      >
        <Layers3 class="h-4 w-4" :stroke-width="1.9" />
        {{ compareEnabled ? "Compare on" : "Compare off" }}
      </button>
    </FilterBar>

    <div class="flex flex-wrap gap-2">
      <StatusBadge v-for="chip in quickSignals" :key="chip.label" :label="chip.label" :variant="chip.variant" />
    </div>

    <section class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
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

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
      <SurfaceCard variant="soft" padding="lg" class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/62">
              <Sparkles class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Creative grid</p>
              <h2 class="sv-section-heading mt-1">Top assets</h2>
            </div>
          </div>
          <StatusBadge label="Live review" variant="info" />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="asset in galleryAssets"
            :key="asset.id"
            class="sv-card-inset overflow-hidden rounded-[1.35rem]"
          >
            <div class="aspect-[1.65/1] border-b border-black/6 bg-[linear-gradient(135deg,rgba(249,250,251,0.98),rgba(241,245,249,0.98))] p-4">
              <div class="flex h-full flex-col justify-between rounded-[1rem] border border-black/8 bg-white/75 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
                    <component :is="formatIconForAsset(asset)" class="h-4.5 w-4.5" :stroke-width="1.9" />
                  </div>
                  <StatusBadge :label="asset.primaryTag" :variant="asset.primaryTag.includes('Fatigue') ? 'danger' : 'success'" />
                </div>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45">
                    <span>{{ asset.format }}</span>
                    <span>{{ asset.platform }}</span>
                    <span>{{ asset.daysLive }}d live</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-[12px] text-black/58">
                    <div class="rounded-xl border border-black/8 bg-white/70 px-2.5 py-2">
                      <div class="sv-section-title">CTR</div>
                      <div class="mt-1 font-semibold text-black">{{ formatPercent(asset.ctr) }}</div>
                    </div>
                    <div class="rounded-xl border border-black/8 bg-white/70 px-2.5 py-2">
                      <div class="sv-section-title">Hook</div>
                      <div class="mt-1 font-semibold text-black">{{ formatPercent(asset.hookRate, 1) }}</div>
                    </div>
                    <div class="rounded-xl border border-black/8 bg-white/70 px-2.5 py-2">
                      <div class="sv-section-title">ROAS</div>
                      <div class="mt-1 font-semibold text-black">{{ formatMultiplier(asset.revenue / asset.spend, 1) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <p class="text-[1rem] font-semibold tracking-[-0.02em] text-black">{{ asset.name }}</p>
                <StatusBadge :label="asset.status" :variant="statusVariant(asset.status)" />
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <StatusBadge :label="asset.secondaryTag" variant="neutral" />
                <StatusBadge :label="asset.platform" :variant="channelVariant(asset.platform)" />
              </div>
              <div class="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p class="sv-section-title">Spend</p>
                  <p class="mt-1 text-[14px] font-semibold text-black">{{ formatCompactCurrency(asset.spend) }}</p>
                </div>
                <div>
                  <p class="sv-section-title">Revenue</p>
                  <p class="mt-1 text-[14px] font-semibold text-black">{{ formatCompactCurrency(asset.revenue) }}</p>
                </div>
                <div>
                  <p class="sv-section-title">Conv.</p>
                  <p class="mt-1 text-[14px] font-semibold text-black">{{ formatCompactNumber(asset.conversions) }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </SurfaceCard>

      <div class="space-y-6">
        <SurfaceCard variant="frame" padding="md" class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
              <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Format split</p>
              <h2 class="sv-section-heading mt-1">Allocation</h2>
            </div>
          </div>
          <AnalyticsSegmentBar :segments="formatSegments" />
          <AnalyticsBarsList :items="formatRows" />
        </SurfaceCard>

        <SurfaceCard variant="depth" padding="md" class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
              <TimerReset class="h-4.5 w-4.5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Health</p>
              <h2 class="sv-section-heading mt-1">Fatigue + score</h2>
            </div>
          </div>
          <div class="grid gap-3">
            <div
              v-for="card in healthCards"
              :key="card.label"
              class="sv-card-inset flex items-center justify-between rounded-[1rem] px-4 py-3.5"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-black/8 bg-white/75 text-black/62">
                  <component :is="card.icon" class="h-4 w-4" :stroke-width="1.9" />
                </div>
                <div>
                  <p class="sv-section-title">{{ card.label }}</p>
                  <p class="mt-1 text-[13px] text-black/52">{{ card.meta }}</p>
                </div>
              </div>
              <p class="text-[1rem] font-semibold text-black">{{ card.value }}</p>
            </div>
          </div>

          <div class="space-y-3 pt-1">
            <div
              v-for="asset in fatiguedCreatives"
              :key="asset.id"
              class="sv-card-inset rounded-[1rem] px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-[14px] font-semibold text-black">{{ asset.name }}</p>
                  <p class="mt-1 text-[12px] text-black/48">{{ asset.daysLive }}d live · {{ asset.secondaryTag }}</p>
                </div>
                <StatusBadge :label="`${asset.fatigueScore}`" :variant="asset.fatigueScore >= 65 ? 'danger' : 'warning'" />
              </div>
              <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(216,143,141,0.92),rgba(245,158,11,0.92))]"
                  :style="{ width: `${asset.fatigueScore}%` }"
                />
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <SurfaceCard variant="frame" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Target class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Leaderboard</p>
            <h2 class="sv-section-heading mt-1">Top creatives table</h2>
          </div>
        </div>

        <DataTable :columns="columns" :rows="tableRows" row-key="id">
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-black/[0.03] text-black/62">
                <component
                  :is="formatIconForAsset(filteredAssets.find((asset) => asset.id === row.id) || filteredAssets[0])"
                  class="h-4 w-4"
                  :stroke-width="1.9"
                />
              </div>
              <div>
                <p class="font-semibold text-black">{{ row.name }}</p>
                <p class="mt-1 text-[12px] text-black/46">{{ row.daysLive }} · {{ row.tags }}</p>
              </div>
            </div>
          </template>
          <template #cell-format="{ value }">
            <StatusBadge :label="String(value)" variant="neutral" />
          </template>
          <template #cell-platform="{ value }">
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

      <SurfaceCard variant="product" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Sparkles class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Signal cards</p>
            <h2 class="sv-section-heading mt-1">Patterns</h2>
          </div>
        </div>
        <div class="grid gap-3">
          <div
            v-for="insight in creativeInsights"
            :key="insight.title"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="sv-section-title">{{ insight.title }}</p>
              <StatusBadge label="Signal" variant="info" />
            </div>
            <p class="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-black">{{ insight.value }}</p>
            <p class="mt-2 text-[13px] leading-6 text-black/52">{{ insight.note }}</p>
          </div>
        </div>
      </SurfaceCard>
    </section>
  </div>
</template>
