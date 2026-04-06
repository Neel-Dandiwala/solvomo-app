<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  Download,
  GitCompareArrows,
  Globe,
  Laptop,
  Layers3,
  Map,
  MonitorSmartphone,
  Target,
  Users,
  Users2,
} from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Audience — Solvomo" });

const {
  reportingMeta,
  audienceSegments,
  audienceDemographics,
  audienceGeos,
  audienceDevices,
  audienceTypes,
  audienceRegions,
  audienceDevicesList,
  audienceComparisonCards,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatMultiplier,
  statusVariant,
} = useDemoAnalytics();

type AudienceSegment = (typeof audienceSegments)[number];

const selectedRange = ref("Last 30 days");
const selectedSegment = ref("All segments");
const selectedRegion = ref("All regions");
const selectedDevice = ref("All devices");

const filteredSegments = computed(() =>
  audienceSegments.filter((segment: AudienceSegment) => {
    if (selectedSegment.value !== "All segments" && segment.type !== selectedSegment.value) return false;
    if (selectedRegion.value !== "All regions" && segment.geo !== selectedRegion.value) return false;
    if (selectedDevice.value !== "All devices" && segment.device !== selectedDevice.value) return false;
    return true;
  }),
);

const metadataItems = computed(() => [
  { label: "Last synced", value: reportingMeta.lastSynced },
  { label: "Compared", value: reportingMeta.comparisonLabel },
  { label: "Segments", value: `${filteredSegments.value.length}` },
  { label: "Attribution", value: reportingMeta.attributionModel },
]);

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

  return {
    remarketing: summarize(remarketing),
    prospecting: summarize(prospecting),
  };
});

const kpis = computed(() => [
  { title: "Audience spend", value: formatCompactCurrency(audienceTotals.value.spend), delta: "+6.8%", helper: "Targeting mix", tone: "info" as const, icon: Users, trend: filteredSegments.value.map((segment) => segment.spend / 1000) },
  { title: "Leads", value: formatCompactNumber(audienceTotals.value.leads), delta: "+8.9%", helper: "All segments", tone: "success" as const, icon: Target, trend: filteredSegments.value.map((segment) => segment.leads) },
  { title: "SQLs", value: formatCompactNumber(audienceTotals.value.sqls), delta: "+7.2%", helper: "Qualified", tone: "success" as const, icon: Users2, trend: filteredSegments.value.map((segment) => segment.sqls) },
  { title: "CPA", value: formatCurrency(audienceTotals.value.cpa), delta: "-7.4%", helper: "Lead cost", tone: "success" as const, icon: MonitorSmartphone, trend: filteredSegments.value.map((segment) => segment.spend / Math.max(segment.leads, 1)) },
  { title: "ROAS", value: formatMultiplier(audienceTotals.value.roas, 1), delta: "+0.4x", helper: "Segment return", tone: "success" as const, icon: Laptop, trend: filteredSegments.value.map((segment) => segment.revenue / segment.spend) },
  { title: "Top segment", value: bestSegment.value ? formatMultiplier(bestSegment.value.revenue / bestSegment.value.spend, 1) : "—", delta: bestSegment.value?.name ?? "—", helper: "Current winner", tone: "info" as const, icon: Globe, trend: [3, 4, 4, 5, 6, 7] },
]);

const demographicBreakdown = computed(() =>
  audienceDemographics.map((item) => ({
    label: item.label,
    value: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    secondary: `${formatCompactCurrency(item.spend)} spend`,
    meta: `${formatMultiplier(item.revenue / item.spend, 1)} ROAS`,
  })),
);

const geoBreakdown = computed(() =>
  audienceGeos.map((item) => ({
    label: item.label,
    value: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    secondary: `${formatCompactCurrency(item.spend)} spend`,
    meta: `${formatMultiplier(item.revenue / item.spend, 1)} ROAS`,
  })),
);

const deviceSegments = computed(() =>
  audienceDevices.map((device, index) => ({
    label: device.label,
    value: device.spend,
    valueLabel: formatCompactCurrency(device.spend),
    tone: index === 0 ? "depth" : index === 1 ? "product" : index === 2 ? "brand" : "neutral",
  })),
);

const quickQualityChips = computed(() => [
  { label: "Top converting segment", variant: "success" as const },
  { label: "High spend low return", variant: "warning" as const },
  { label: "Desktop quality edge", variant: "info" as const },
  { label: "Overlap to watch", variant: "danger" as const },
]);

const segmentRows = computed(() =>
  [...filteredSegments.value]
    .sort((left, right) => right.revenue - left.revenue)
    .map((segment) => ({
      id: segment.id,
      name: segment.name,
      type: segment.type,
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
  <div class="space-y-8">
    <PageHeader title="Audience">
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
      <select v-model="selectedSegment" class="app-control min-w-[11rem]">
        <option v-for="option in audienceTypes" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedRegion" class="app-control min-w-[11rem]">
        <option v-for="option in audienceRegions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedDevice" class="app-control min-w-[11rem]">
        <option v-for="option in audienceDevicesList" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </FilterBar>

    <div class="flex flex-wrap gap-2">
      <StatusBadge v-for="chip in quickQualityChips" :key="chip.label" :label="chip.label" :variant="chip.variant" />
    </div>

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

    <section class="grid gap-6 xl:grid-cols-2">
      <SurfaceCard variant="soft" padding="lg" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/62">
            <Users class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Demographics</p>
            <h2 class="sv-section-heading mt-1">Age cohort performance</h2>
          </div>
        </div>
        <AnalyticsBarsList :items="demographicBreakdown" />
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="lg" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Map class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Geo</p>
            <h2 class="sv-section-heading mt-1">Regional performance</h2>
          </div>
        </div>
        <AnalyticsBarsList :items="geoBreakdown" />
      </SurfaceCard>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <SurfaceCard variant="product" padding="md" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <MonitorSmartphone class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Device split</p>
            <h2 class="sv-section-heading mt-1">Quality by device</h2>
          </div>
        </div>
        <AnalyticsSegmentBar :segments="deviceSegments" />
        <div class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="device in audienceDevices"
            :key="device.label"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-[15px] font-semibold text-black">{{ device.label }}</p>
              <p class="text-[15px] font-semibold text-black">{{ formatMultiplier(device.revenue / device.spend, 1) }}</p>
            </div>
            <div class="mt-2 flex items-center justify-between gap-3 text-[13px] text-black/52">
              <span>{{ formatPercent(device.cvr) }} CVR</span>
              <span>{{ formatCompactCurrency(device.revenue) }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="depth" padding="md" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Comparison</p>
            <h2 class="sv-section-heading mt-1">Remarketing vs prospecting</h2>
          </div>
        </div>
        <div class="grid gap-3">
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <div class="flex items-center justify-between gap-3">
              <StatusBadge label="Remarketing" variant="success" />
              <p class="text-[15px] font-semibold text-black">{{ formatMultiplier(remarketingVsProspecting.remarketing.roas, 1) }}</p>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-3 text-[13px] text-black/58">
              <div><span class="sv-section-title">Spend</span><p class="mt-1 font-semibold text-black">{{ formatCompactCurrency(remarketingVsProspecting.remarketing.spend) }}</p></div>
              <div><span class="sv-section-title">Leads</span><p class="mt-1 font-semibold text-black">{{ formatCompactNumber(remarketingVsProspecting.remarketing.leads) }}</p></div>
              <div><span class="sv-section-title">Revenue</span><p class="mt-1 font-semibold text-black">{{ formatCompactCurrency(remarketingVsProspecting.remarketing.revenue) }}</p></div>
            </div>
          </div>
          <div class="sv-card-inset rounded-[1rem] px-4 py-4">
            <div class="flex items-center justify-between gap-3">
              <StatusBadge label="Prospecting" variant="info" />
              <p class="text-[15px] font-semibold text-black">{{ formatMultiplier(remarketingVsProspecting.prospecting.roas, 1) }}</p>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-3 text-[13px] text-black/58">
              <div><span class="sv-section-title">Spend</span><p class="mt-1 font-semibold text-black">{{ formatCompactCurrency(remarketingVsProspecting.prospecting.spend) }}</p></div>
              <div><span class="sv-section-title">Leads</span><p class="mt-1 font-semibold text-black">{{ formatCompactNumber(remarketingVsProspecting.prospecting.leads) }}</p></div>
              <div><span class="sv-section-title">Revenue</span><p class="mt-1 font-semibold text-black">{{ formatCompactCurrency(remarketingVsProspecting.prospecting.revenue) }}</p></div>
            </div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="card in audienceComparisonCards"
              :key="card.title"
              class="sv-card-inset rounded-[1rem] px-4 py-4"
            >
              <p class="sv-section-title">{{ card.title }}</p>
              <p class="mt-2 text-[15px] font-semibold text-black">{{ card.value }}</p>
              <p class="mt-2 text-[13px] leading-6 text-black/52">{{ card.note }}</p>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Target class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Segments</p>
            <h2 class="sv-section-heading mt-1">Audience table</h2>
          </div>
        </div>
        <button type="button" class="inline-flex min-h-[2.75rem] items-center gap-2 rounded-[1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black/64">
          <Layers3 class="h-4 w-4" :stroke-width="1.9" />
          Columns
        </button>
      </div>

      <DataTable :columns="columns" :rows="segmentRows" row-key="id">
        <template #cell-name="{ row }">
          <div>
            <p class="font-semibold text-black">{{ row.name }}</p>
            <p class="mt-1 text-[12px] text-black/46">{{ row.geo }} · {{ row.device }}</p>
          </div>
        </template>
        <template #cell-type="{ value }">
          <StatusBadge :label="String(value)" variant="neutral" />
        </template>
        <template #cell-roas="{ value }">
          <StatusBadge :label="String(value)" variant="success" />
        </template>
        <template #cell-signal="{ value }">
          <StatusBadge :label="String(value)" :variant="statusVariant(String(value))" />
        </template>
      </DataTable>
    </section>
  </div>
</template>
