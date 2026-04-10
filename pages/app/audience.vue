<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  ChevronDown,
  Download,
  Gauge,
  Layers3,
  Lightbulb,
  Radar,
  Sparkles,
  TrendingUp,
} from "lucide-vue-next";
import { toValue } from "vue";
import type { DataTableColumn } from "~/types/app-shell";
import {
  audienceSegments,
  audienceDemographics,
  audienceGeos,
  audienceDevices,
} from "~/composables/useDemoAnalytics";

definePageMeta({ layout: "app" });

useHead({ title: "Audience — Solvomo" });

const { dataStatus } = useAppData();
const {
  reportingMeta,
  audienceChannels,
  audienceRegions,
  audienceComparisonCards,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatMultiplier,
  channelVariant,
  statusVariant,
} = useDemoAnalytics();

type AudienceSegment = (typeof audienceSegments)[number];

/** Composable computed ref — normalize for v-for / scripts */
const expansionInsightCards = computed(() => {
  const raw = toValue(audienceComparisonCards);
  return Array.isArray(raw) ? raw : [];
});

const ALL_SCOPE = "All";

const selectedRange = ref("Last 8 weeks");
const selectedChannel = ref(ALL_SCOPE);
const selectedRegion = ref(ALL_SCOPE);
const compareEnabled = ref(true);
/** Open by default so intelligence bullets are visible (Overview-style, no hidden empty state). */
const insightPanelOpen = ref(true);

const filteredSegments = computed(() =>
  audienceSegments.filter((segment: AudienceSegment) => {
    if (selectedChannel.value !== ALL_SCOPE && segment.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== ALL_SCOPE && segment.geo !== selectedRegion.value) return false;
    return true;
  }),
);

const audienceContextLine = computed(() =>
  [
    `${reportingMeta.lastSynced} synced`,
    compareEnabled.value ? reportingMeta.comparisonLabel : "Compare off",
    `${filteredSegments.value.length} segments in view`,
    reportingMeta.attributionModel,
  ].join(" · "),
);

const audienceTotals = computed(() => {
  const spend = filteredSegments.value.reduce((total: number, segment: AudienceSegment) => total + segment.spend, 0);
  const leads = filteredSegments.value.reduce((total: number, segment: AudienceSegment) => total + segment.leads, 0);
  const revenue = filteredSegments.value.reduce((total: number, segment: AudienceSegment) => total + segment.revenue, 0);
  const sqls = filteredSegments.value.reduce((total: number, segment: AudienceSegment) => total + segment.sqls, 0);

  return {
    spend,
    leads,
    sqls,
    revenue,
    cpa: leads ? spend / leads : 0,
    roas: spend ? revenue / spend : 0,
  };
});

const bestSegment = computed(() =>
  [...filteredSegments.value].sort((left, right) => (right.revenue / right.spend) - (left.revenue / left.spend))[0],
);

const remarketingVsProspecting = computed(() => {
  const remarketing = filteredSegments.value.filter((segment) => segment.type === "Remarketing" || segment.type === "Engagement");
  const prospecting = filteredSegments.value.filter((segment) => !remarketing.includes(segment));

  const summarize = (rows: AudienceSegment[]) => {
    const spend = rows.reduce((sum, row) => sum + row.spend, 0);
    const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const leads = rows.reduce((sum, row) => sum + row.leads, 0);
    return { spend, revenue, leads, roas: spend ? revenue / spend : 0 };
  };

  const rem = summarize(remarketing);
  const pro = summarize(prospecting);

  return {
    remarketing: {
      ...rem,
      heroLabel: "5.0x",
      badge: "Baseline",
      sublabel: "Remarketing + engagement",
    },
    prospecting: {
      ...pro,
      heroLabel: "5.1x",
      badge: "Improved",
      sublabel: "Cold + broad prospecting",
      liftVersusRemarketing: "+0.1x vs baseline",
      liftPct: "+2.0%",
    },
  };
});

const kpis = computed(() => [
  { title: "Audience spend", value: formatCompactCurrency(audienceTotals.value.spend), delta: "+6.8%", helper: "Targeting mix" },
  { title: "Leads", value: formatCompactNumber(audienceTotals.value.leads), delta: "+8.9%", helper: "All segments" },
  { title: "SQLs", value: formatCompactNumber(audienceTotals.value.sqls), delta: "+7.2%", helper: "Qualified" },
  { title: "CPA", value: formatCurrency(audienceTotals.value.cpa), delta: "-7.4%", helper: "Lead cost" },
  { title: "ROAS", value: formatMultiplier(audienceTotals.value.roas, 1), delta: "+0.4x", helper: "Segment return" },
  {
    title: "Top segment",
    value: bestSegment.value ? formatMultiplier(bestSegment.value.revenue / bestSegment.value.spend, 1) : "—",
    delta: "",
    helper: bestSegment.value?.name ?? "No leader",
  },
]);

const demographicBreakdown = computed(() =>
  [...audienceDemographics].map((item) => ({
    label: item.label,
    value: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    secondary: `${formatCompactCurrency(item.spend)} spend`,
    meta: `${formatMultiplier(item.revenue / item.spend, 1)} ROAS`,
  })),
);

const geoBreakdown = computed(() =>
  [...audienceGeos].map((item) => ({
    label: item.label,
    value: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    secondary: `${formatCompactCurrency(item.spend)} spend`,
    meta: `${formatMultiplier(item.revenue / item.spend, 1)} ROAS`,
  })),
);

const deviceSegments = computed(() =>
  [...audienceDevices].map((device, index) => ({
    label: device.label,
    value: device.spend,
    valueLabel: formatCompactCurrency(device.spend),
    tone: index === 0 ? "depth" : index === 1 ? "product" : index === 2 ? "brand" : "neutral",
  })),
);

const roasByAudienceType = computed(() => {
  const source =
    filteredSegments.value.length > 0 ? filteredSegments.value : [...audienceSegments];
  const map = new Map<string, { spend: number; revenue: number }>();
  source.forEach((s) => {
    const cur = map.get(s.type) ?? { spend: 0, revenue: 0 };
    cur.spend += s.spend;
    cur.revenue += s.revenue;
    map.set(s.type, cur);
  });
  return Array.from(map.entries())
    .map(([label, v]) => ({
      label,
      value: v.revenue,
      valueLabel: formatMultiplier(v.spend ? v.revenue / v.spend : 0, 1),
      secondary: `${formatCompactCurrency(v.spend)} spend`,
      meta: "Blended ROAS",
    }))
    .sort((a, b) => b.value - a.value);
});

const quickQualityChips = computed(() => [
  { label: "Top converting segment", variant: "success" as const },
  { label: "High spend low return", variant: "warning" as const },
  { label: "Desktop quality edge", variant: "info" as const },
  { label: "Overlap to watch", variant: "danger" as const },
]);

const insightCardIcons = [Lightbulb, TrendingUp, Gauge, Radar];

const segmentRows = computed(() =>
  [...filteredSegments.value]
    .sort((left, right) => right.revenue - left.revenue)
    .map((segment) => ({
      id: segment.id,
      name: segment.name,
      type: segment.type,
      channel: segment.channel,
      geo: segment.geo,
      device: segment.device,
      spend: formatCompactCurrency(segment.spend),
      leads: formatCompactNumber(segment.leads),
      sqls: formatCompactNumber(segment.sqls),
      cpa: formatCurrency(segment.spend / segment.leads),
      roas: formatMultiplier(segment.revenue / segment.spend, 1),
      revenue: formatCompactCurrency(segment.revenue),
      signal: segment.signal,
    })),
);

const columns: DataTableColumn[] = [
  { key: "name", label: "Segment" },
  { key: "type", label: "Type" },
  { key: "channel", label: "Channel" },
  { key: "geo", label: "Geo" },
  { key: "device", label: "Device" },
  { key: "spend", label: "Spend" },
  { key: "leads", label: "Leads" },
  { key: "sqls", label: "SQLs" },
  { key: "cpa", label: "CPA" },
  { key: "roas", label: "ROAS" },
  { key: "signal", label: "Signal" },
];
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <MockDataState :status="dataStatus" />

    <PageHeader title="Audience" dense metadata-tight hide-context />

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
        <label for="aud-filter-channel" class="sv-section-title">Channel</label>
        <select id="aud-filter-channel" v-model="selectedChannel" class="app-control min-w-[12rem]">
          <option v-for="option in audienceChannels" :key="`ch-${option}`" :value="option">
            {{ option === ALL_SCOPE ? "All channels" : option }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="aud-filter-region" class="sv-section-title">Region</label>
        <select id="aud-filter-region" v-model="selectedRegion" class="app-control min-w-[12rem]">
          <option v-for="option in audienceRegions" :key="`rg-${option}`" :value="option">
            {{ option === ALL_SCOPE ? "All regions" : option }}
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

    <!-- Operating strip: matches Overview (context + KPI row, no stacked duplicate headers) -->
    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div class="min-w-0 lg:max-w-[42%]">
          <p class="text-[15px] font-semibold tracking-[-0.02em] text-black">
            Audience overview
          </p>
          <p class="mt-1.5 text-[12px] leading-snug text-black/55">
            {{ audienceContextLine }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <StatusBadge
              v-for="chip in quickQualityChips"
              :key="chip.label"
              :label="chip.label"
              :variant="chip.variant"
            />
          </div>
        </div>
        <div
          class="grid min-w-0 flex-1 grid-cols-2 items-start gap-3 border-t border-black/[0.06] pt-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:border-t-0 lg:pt-0 xl:divide-x xl:divide-black/[0.06]"
        >
          <div
            v-for="(item, kidx) in kpis"
            :key="item.title"
            class="min-w-0 overflow-hidden lg:px-3 xl:px-4"
            :class="[kidx === 0 && 'lg:pl-0', kidx === kpis.length - 1 && 'lg:pr-0']"
          >
            <p class="sv-section-title">
              {{ item.title }}
            </p>
            <p class="mt-2 text-[17px] font-semibold tabular-nums leading-none tracking-[-0.02em] text-black">
              {{ item.value }}
            </p>
            <p v-if="item.helper" class="mt-1.5 text-[12px] text-black/48">
              {{ item.helper }}
            </p>
            <p
              v-if="item.delta"
              class="mt-1.5 inline-flex items-center rounded-full border border-black/[0.08] bg-black/[0.02] px-2 py-0.5 text-[11px] font-semibold text-black/55"
            >
              {{ item.delta }}
            </p>
          </div>
        </div>
      </div>
    </SurfaceCard>

    <section class="grid grid-cols-12 content-start items-start gap-3 lg:gap-4">
      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-w-0 lg:col-span-6">
        <h3 class="sv-card-title">
          Demographics
        </h3>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <AnalyticsBarsList :items="demographicBreakdown" />
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-w-0 lg:col-span-6">
        <h3 class="sv-card-title">
          Regional Performance
        </h3>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <AnalyticsBarsList :items="geoBreakdown" />
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12">
        <button
          type="button"
          class="flex w-full items-start gap-3 text-left"
          @click="insightPanelOpen = !insightPanelOpen"
        >
          <Sparkles class="mt-0.5 h-4 w-4 shrink-0 text-black/35" :stroke-width="1.9" aria-hidden="true" />
          <div class="min-w-0 flex-1">
            <h3 class="sv-card-title">
              Audience intelligence
            </h3>
            <p class="mt-2 text-[13px] leading-snug text-black/55">
              Optimization opportunity — expand lookalike SQL seed while tightening remarketing overlap.
            </p>
          </div>
          <ChevronDown
            class="h-5 w-5 shrink-0 text-black/40 transition duration-200"
            :class="insightPanelOpen ? 'rotate-180' : ''"
            :stroke-width="1.9"
            aria-hidden="true"
          />
        </button>
        <div v-show="insightPanelOpen" class="mt-3 border-t border-black/[0.06] pt-3">
          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li class="rounded-[var(--sv-radius-control)] border border-black/[0.06] bg-black/[0.02] px-4 py-3 text-[13px] leading-relaxed text-black/58">
              <span class="font-semibold text-black/78">Expansion</span>
              · SQL lookalike 5% has headroom before frequency climbs.
            </li>
            <li class="rounded-[var(--sv-radius-control)] border border-black/[0.06] bg-black/[0.02] px-4 py-3 text-[13px] leading-relaxed text-black/58">
              <span class="font-semibold text-black/78">Overlap</span>
              · Trim duplicated reach between Meta prospecting and remarketing.
            </li>
            <li class="rounded-[var(--sv-radius-control)] border border-black/[0.06] bg-black/[0.02] px-4 py-3 text-[13px] leading-relaxed text-black/58">
              <span class="font-semibold text-black/78">Geo</span>
              · North America still carries the majority of efficient spend.
            </li>
          </ul>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 overflow-hidden p-0">
        <div class="border-b border-black/[0.06] px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <h3 class="sv-card-title">
            Audience Segments
          </h3>
          <button
            type="button"
            class="mt-3 inline-flex min-h-[2.75rem] w-full shrink-0 items-center justify-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/64 sm:mt-0 sm:w-auto"
          >
            <Layers3 class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
            Columns
          </button>
        </div>
        <DataTable
          embed
          :columns="columns"
          :rows="segmentRows"
          row-key="id"
          empty-label="No segments match filters. Choose All channels and All regions to see the full demo cohort."
        >
          <template #cell-name="{ row }">
            <div>
              <p class="font-semibold text-black">{{ row.name }}</p>
              <p class="mt-1 text-[12px] text-black/46">{{ row.geo }} · {{ row.device }}</p>
            </div>
          </template>
          <template #cell-type="{ value }">
            <StatusBadge :label="String(value)" variant="neutral" />
          </template>
          <template #cell-channel="{ value }">
            <StatusBadge :label="String(value)" :variant="channelVariant(String(value))" />
          </template>
          <template #cell-roas="{ value }">
            <StatusBadge :label="String(value)" variant="success" />
          </template>
          <template #cell-signal="{ value }">
            <StatusBadge :label="String(value)" :variant="statusVariant(String(value))" />
          </template>
        </DataTable>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-5">
        <h3 class="sv-card-title">
          Remarketing vs Prospecting
        </h3>
        <div class="grid gap-4 border-t border-black/[0.06] pt-4 lg:grid-cols-2">
          <div class="flex min-w-0 flex-col rounded-[1rem] border border-black/[0.08] border-l-[3px] border-l-black/30 bg-black/[0.02] p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="sv-section-title">Remarketing</p>
                <p class="mt-1 text-[12px] text-black/48">{{ remarketingVsProspecting.remarketing.sublabel }}</p>
              </div>
              <StatusBadge :label="remarketingVsProspecting.remarketing.badge" variant="neutral" />
            </div>
            <div class="mt-4 flex flex-wrap items-end gap-2">
              <p class="text-[2rem] font-semibold leading-none tabular-nums tracking-tight text-black">
                {{ remarketingVsProspecting.remarketing.heroLabel }}
              </p>
              <span class="text-[12px] font-medium text-black/45">ROAS</span>
            </div>
            <p class="mt-2 text-[12px] text-black/48">
              Modeled: {{ formatMultiplier(remarketingVsProspecting.remarketing.roas, 1) }} on live data
            </p>
            <dl class="mt-4 grid grid-cols-3 gap-3 border-t border-black/[0.06] pt-4 text-[13px] text-black/58">
              <div>
                <dt class="sv-section-title">Spend</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactCurrency(remarketingVsProspecting.remarketing.spend) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Leads</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactNumber(remarketingVsProspecting.remarketing.leads) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Revenue</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactCurrency(remarketingVsProspecting.remarketing.revenue) }}
                </dd>
              </div>
            </dl>
          </div>

          <div
            class="flex min-w-0 flex-col rounded-[1rem] border border-[rgba(91,123,225,0.22)] border-l-[3px] border-l-[rgba(91,123,225,0.75)] bg-[rgba(91,123,225,0.04)] p-4 sm:p-5"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="sv-section-title">Prospecting</p>
                <p class="mt-1 text-[12px] text-black/48">{{ remarketingVsProspecting.prospecting.sublabel }}</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <StatusBadge :label="remarketingVsProspecting.prospecting.badge" variant="success" />
                <span class="inline-flex items-center rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[rgb(21,83,45)]">
                  {{ remarketingVsProspecting.prospecting.liftPct }}
                </span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap items-end gap-2">
              <p class="text-[2rem] font-semibold leading-none tabular-nums tracking-tight text-[rgb(30,58,138)]">
                {{ remarketingVsProspecting.prospecting.heroLabel }}
              </p>
              <span class="text-[12px] font-medium text-black/45">ROAS</span>
            </div>
            <p class="mt-2 text-[12px] font-medium text-[rgb(21,83,45)]">
              {{ remarketingVsProspecting.prospecting.liftVersusRemarketing }}
            </p>
            <p class="mt-1 text-[12px] text-black/48">
              Modeled: {{ formatMultiplier(remarketingVsProspecting.prospecting.roas, 1) }} on live data
            </p>
            <dl class="mt-4 grid grid-cols-3 gap-3 border-t border-[rgba(91,123,225,0.15)] pt-4 text-[13px] text-black/58">
              <div>
                <dt class="sv-section-title">Spend</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactCurrency(remarketingVsProspecting.prospecting.spend) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Leads</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactNumber(remarketingVsProspecting.prospecting.leads) }}
                </dd>
              </div>
              <div>
                <dt class="sv-section-title">Revenue</dt>
                <dd class="mt-1 font-semibold tabular-nums text-black">
                  {{ formatCompactCurrency(remarketingVsProspecting.prospecting.revenue) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12">
        <h3 class="sv-card-title">
          Lookalike &amp; expansion
        </h3>
        <div class="mt-3 grid gap-3 border-t border-black/[0.06] pt-3 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="(card, index) in expansionInsightCards"
            :key="card.title"
            class="flex min-w-0 flex-col gap-2 rounded-[var(--sv-radius-control)] border border-black/[0.06] bg-black/[0.02] p-4"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-[13px] font-semibold leading-snug text-black">
                {{ card.title }}
              </p>
              <component
                :is="insightCardIcons[index % insightCardIcons.length]"
                class="h-4 w-4 shrink-0 text-black/35"
                :stroke-width="1.9"
                aria-hidden="true"
              />
            </div>
            <p class="text-[14px] font-semibold leading-snug text-black">
              {{ card.value }}
            </p>
            <p class="text-[12px] leading-relaxed text-black/52">
              {{ card.note }}
            </p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-6">
        <h3 class="sv-card-title">
          Device split
        </h3>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <AnalyticsSegmentBar :segments="deviceSegments" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="device in audienceDevices"
            :key="device.label"
            class="rounded-[var(--sv-radius-control)] border border-black/[0.06] bg-black/[0.02] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-[15px] font-semibold text-black">{{ device.label }}</p>
              <p class="text-[15px] font-semibold tabular-nums text-black">
                {{ formatMultiplier(device.revenue / device.spend, 1) }}
              </p>
            </div>
            <div class="mt-2 flex items-center justify-between gap-3 text-[13px] text-black/52">
              <span>{{ formatPercent(device.cvr) }} CVR</span>
              <span>{{ formatCompactCurrency(device.revenue) }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-6">
        <h3 class="sv-card-title">
          Efficiency by audience type
        </h3>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <AnalyticsBarsList :items="roasByAudienceType" />
        </div>
      </SurfaceCard>
    </section>
  </div>
</template>
