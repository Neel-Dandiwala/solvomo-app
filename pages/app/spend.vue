<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  Download,
  Layers3,
  PiggyBank,
  Receipt,
  Table2,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-vue-next";
import {
  spendDemoCampaigns,
  spendDemoChannelFallback,
  spendDemoLedger,
  spendDemoObjectiveFallback,
  spendDemoPacing,
  spendDemoWeeks,
  spendReportingMeta,
} from "~/data/spendPageData";

definePageMeta({ layout: "app" });

useHead({ title: "Spend — Solvomo" });

const ALL_SCOPE = "All";

const {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatMultiplier,
  channelVariant,
  statusVariant,
} = useDemoAnalytics();

const performanceChannels = computed(() => [
  ALL_SCOPE,
  ...Array.from(new Set(spendDemoCampaigns.map((row) => row.channel))).sort((a, b) => a.localeCompare(b)),
]);
const performanceRegions = computed(() => [
  ALL_SCOPE,
  ...Array.from(new Set(spendDemoCampaigns.map((row) => row.region))).sort((a, b) => a.localeCompare(b)),
]);

const selectedRange = ref("Last 8 weeks");
const selectedChannel = ref(ALL_SCOPE);
const selectedRegion = ref(ALL_SCOPE);
const compareEnabled = ref(true);

type DemoCampaign = (typeof spendDemoCampaigns)[number];

const filteredCampaigns = computed(() =>
  spendDemoCampaigns.filter((c: DemoCampaign) => {
    if (selectedChannel.value !== ALL_SCOPE && c.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== ALL_SCOPE && c.region !== selectedRegion.value) return false;
    return true;
  }),
);

const filteredPacing = computed(() =>
  [...spendDemoPacing].filter((row) => {
    if (selectedChannel.value !== ALL_SCOPE && row.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== ALL_SCOPE && row.region !== selectedRegion.value) return false;
    return true;
  }),
);

const pacingForDisplay = computed(() =>
  filteredPacing.value.length ? filteredPacing.value : [...spendDemoPacing],
);

const filteredTotals = computed(() => {
  const rows = filteredCampaigns.value;
  const spend = rows.reduce((t, r) => t + r.spend, 0);
  const revenue = rows.reduce((t, r) => t + r.revenue, 0);
  const purchases = rows.reduce((t, r) => t + r.purchases, 0);
  return {
    spend,
    revenue,
    cac: purchases ? spend / purchases : 0,
    mer: spend ? revenue / spend : 0,
  };
});

const blendedBudgetFromPacing = computed(() =>
  pacingForDisplay.value.reduce((t, row) => t + row.budget, 0),
);
const blendedActualFromPacing = computed(() =>
  pacingForDisplay.value.reduce((t, row) => t + row.actual, 0),
);
const budgetPacingPct = computed(() =>
  blendedBudgetFromPacing.value ? (blendedActualFromPacing.value / blendedBudgetFromPacing.value) * 100 : 0,
);

const dailyAverageSpend = computed(() =>
  filteredTotals.value.spend > 0 ? filteredTotals.value.spend / 31 : 0,
);

const metadataItems = computed(() => [
  { label: "Last synced", value: spendReportingMeta.lastSynced },
  { label: "Compared", value: spendReportingMeta.comparisonLabel },
  { label: "Campaigns in view", value: `${filteredCampaigns.value.length}` },
  { label: "Attribution", value: spendReportingMeta.attributionModel },
]);

const kpis = computed(() => [
  {
    title: "Total Spend",
    value: formatCompactCurrency(filteredTotals.value.spend),
    delta: "+8.4%",
    helper: "Paid + tracked",
    tone: "info" as const,
    icon: Wallet,
    trend: spendDemoWeeks.map((row) => row.actual),
  },
  {
    title: "Daily Avg",
    value: formatCurrency(dailyAverageSpend.value),
    delta: "+5.2%",
    helper: "31-day avg",
    tone: "neutral" as const,
    icon: PiggyBank,
    trend: spendDemoWeeks.map((row) => row.actual / 7),
  },
  {
    title: "Budget Pacing",
    value: formatPercent(budgetPacingPct.value, 1),
    delta: budgetPacingPct.value > 100 ? "Over plan" : "Within plan",
    helper: "Actual vs budget",
    tone: budgetPacingPct.value > 100 ? ("warning" as const) : ("success" as const),
    icon: Target,
    trend: spendDemoWeeks.map((row) => row.actual / Math.max(row.budget, 1) * 100),
  },
  {
    title: "CAC",
    value: formatCurrency(filteredTotals.value.cac),
    delta: "-4.3%",
    helper: "Blended",
    tone: "success" as const,
    icon: TrendingDown,
    trend: spendDemoWeeks.map((row) => row.actual / Math.max(row.roas * 2, 1)),
  },
  {
    title: "Blended ROAS",
    value: formatMultiplier(filteredTotals.value.mer, 1),
    delta: "+0.4x",
    helper: "Revenue / spend",
    tone: "success" as const,
    icon: TrendingUp,
    trend: spendDemoWeeks.map((row) => row.roas),
  },
]);

function kpiColClass(index: number) {
  return index < 3 ? "col-span-12 sm:col-span-6 xl:col-span-4" : "col-span-12 sm:col-span-6 xl:col-span-6";
}

const channelBreakdownSpend = computed(() => {
  const grouped = new Map<string, { spend: number; revenue: number }>();
  filteredCampaigns.value.forEach((c: DemoCampaign) => {
    const cur = grouped.get(c.channel) ?? { spend: 0, revenue: 0 };
    cur.spend += c.spend;
    cur.revenue += c.revenue;
    grouped.set(c.channel, cur);
  });
  const rows = Array.from(grouped.entries())
    .map(([label, v]) => ({ label, spend: v.spend, revenue: v.revenue, roas: v.revenue / v.spend }))
    .sort((a, b) => b.spend - a.spend);
  if (rows.length) return rows;
  return spendDemoChannelFallback.map((row) => ({
    label: row.label,
    spend: row.spend,
    revenue: row.revenue,
    roas: row.revenue / row.spend,
  }));
});

const objectiveBreakdownSpend = computed(() => {
  const grouped = new Map<string, { spend: number; revenue: number }>();
  filteredCampaigns.value.forEach((c: DemoCampaign) => {
    const cur = grouped.get(c.objective) ?? { spend: 0, revenue: 0 };
    cur.spend += c.spend;
    cur.revenue += c.revenue;
    grouped.set(c.objective, cur);
  });
  const rows = Array.from(grouped.entries())
    .map(([label, v]) => ({ label, spend: v.spend, revenue: v.revenue, roas: v.revenue / v.spend }))
    .sort((a, b) => b.spend - a.spend);
  if (rows.length) return rows;
  return spendDemoObjectiveFallback.map((row) => ({
    label: row.label,
    spend: row.spend,
    revenue: row.revenue,
    roas: row.revenue / row.spend,
  }));
});

const budgetSplitRows = computed(() => {
  const rows = channelBreakdownSpend.value;
  const total = rows.reduce((s, r) => s + r.spend, 0) || 1;
  return rows.map((r) => ({ ...r, widthPct: (r.spend / total) * 100 }));
});

const objectiveBarsMax = computed(() =>
  Math.max(1, ...objectiveBreakdownSpend.value.map((r) => r.spend)),
);

const weeklyRows = computed(() =>
  spendDemoWeeks.map((row, index) => ({
    id: `wk-${index + 1}`,
    week: row.label,
    actual: formatCompactCurrency(row.actual),
    budget: formatCompactCurrency(row.budget),
    variance: `${row.actual >= row.budget ? "+" : ""}${formatCompactCurrency(row.actual - row.budget)}`,
    driver: row.primaryDriver,
    roas: formatMultiplier(row.roas, 1),
  })),
);

const pacingRows = computed(() =>
  [...pacingForDisplay.value]
    .sort((left, right) => right.actual - left.actual)
    .map((row) => ({
      id: row.id,
      campaign: row.campaign,
      channel: row.channel,
      region: row.region,
      objective: row.objective,
      budget: formatCompactCurrency(row.budget),
      actual: formatCompactCurrency(row.actual),
      pace: formatPercent(row.pace, 0),
      alert: row.alert,
      rawPace: row.pace,
    })),
);

const ledgerRows = computed(() => {
  const filtered = spendDemoLedger.filter((row) => {
    if (selectedChannel.value !== ALL_SCOPE && row.channel !== selectedChannel.value) return false;
    if (selectedRegion.value !== ALL_SCOPE && row.region !== selectedRegion.value) return false;
    return true;
  });
  const source = filtered.length ? filtered : [...spendDemoLedger];
  return source.map((row) => ({
    id: row.id,
    date: row.date,
    campaign: row.campaign,
    channel: row.channel,
    region: row.region,
    amount: formatCompactCurrency(row.amount),
    status: row.status,
    goal: row.goal,
  }));
});

const chartMax = computed(() =>
  Math.max(
    1,
    ...spendDemoWeeks.map((w) => w.actual),
    ...spendDemoWeeks.map((w) => w.budget),
  ),
);

const lineChartPointsActual = computed(() =>
  spendDemoWeeks
    .map((w, i) => {
      const x = spendDemoWeeks.length === 1 ? 50 : (i / (spendDemoWeeks.length - 1)) * 100;
      const y = 56 - (w.actual / chartMax.value) * 56;
      return `${x},${y}`;
    })
    .join(" "),
);

const lineChartPointsBudget = computed(() =>
  spendDemoWeeks
    .map((w, i) => {
      const x = spendDemoWeeks.length === 1 ? 50 : (i / (spendDemoWeeks.length - 1)) * 100;
      const y = 56 - (w.budget / chartMax.value) * 56;
      return `${x},${y}`;
    })
    .join(" "),
);

const tableWrapClass =
  "overflow-x-auto rounded-[1.5rem] border border-black/8 bg-white shadow-[var(--sv-shadow-card)]";
const thClass =
  "data-table-th px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-black/52 sm:px-6 sm:py-4";
const tdClass = "data-table-td border-t border-black/6 px-4 py-3 text-black/86 sm:px-6 sm:py-4";
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <PageHeader title="Spend" dense metadata-tight hide-context />

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
        <label for="spend-filter-channel" class="sv-section-title">Channel</label>
        <select id="spend-filter-channel" v-model="selectedChannel" class="app-control min-w-[12rem]">
          <option v-for="option in performanceChannels" :key="`ch-${option}`" :value="option">
            {{ option === ALL_SCOPE ? "All channels" : option }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="spend-filter-region" class="sv-section-title">Region</label>
        <select id="spend-filter-region" v-model="selectedRegion" class="app-control min-w-[12rem]">
          <option v-for="option in performanceRegions" :key="`rg-${option}`" :value="option">
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

    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <AnalyticsMetadataStrip :items="metadataItems" />
    </SurfaceCard>

    <section class="grid grid-cols-12 content-start items-start gap-3 lg:gap-4">
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

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-h-0 lg:col-span-6">
        <div class="mb-3 flex items-center gap-3">
          <div class="sv-section-icon-wrap">
            <Layers3 class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <h3 class="sv-card-title">
            Budget Split
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <div class="space-y-4">
            <div class="flex h-4 w-full overflow-hidden rounded-full bg-black/[0.05]">
              <div
                v-for="row in budgetSplitRows"
                :key="row.label"
                class="min-h-[1rem] flex-shrink-0 bg-black/35"
                :style="{ width: `${row.widthPct}%` }"
              />
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="row in budgetSplitRows"
                :key="`${row.label}-split`"
                class="sv-card-inset flex items-center justify-between gap-3 rounded-[1rem] px-4 py-3"
              >
                <span class="truncate text-[14px] font-medium text-black/72">{{ row.label }}</span>
                <div class="text-right text-[14px] font-semibold text-black">
                  {{ formatCompactCurrency(row.spend) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 min-h-0 lg:col-span-6">
        <div class="mb-3 flex items-center gap-3">
          <div class="sv-section-icon-wrap">
            <Target class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <h3 class="sv-card-title">
            Spend by Goal
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <div class="space-y-3">
            <div
              v-for="row in objectiveBreakdownSpend"
              :key="row.label"
              class="sv-card-inset rounded-[1.25rem] px-4 py-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-[15px] font-semibold tracking-[-0.02em] text-black">
                    {{ row.label }}
                  </p>
                  <p class="mt-1 text-[13px] text-black/54">
                    {{ formatCompactCurrency(row.revenue) }} revenue
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[15px] font-semibold text-black">{{ formatCompactCurrency(row.spend) }}</p>
                  <p class="mt-1 text-[12px] text-black/46">{{ formatMultiplier(row.roas, 1) }} ROAS</p>
                </div>
              </div>
              <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]"
                  :style="{ width: `${Math.max(10, (row.spend / objectiveBarsMax) * 100)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12 flex min-h-[12rem] min-w-0 w-full flex-col">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="sv-section-icon-wrap">
              <Wallet class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <h3 class="sv-card-title">
              Spend vs Budget
            </h3>
          </div>
          <StatusBadge
            :label="budgetPacingPct > 100 ? 'Over pacing' : 'On plan'"
            :variant="budgetPacingPct > 100 ? 'warning' : 'success'"
          />
        </div>
        <div class="mt-3 border-t border-black/[0.06] pt-3">
          <div class="sv-chart-panel min-h-0 w-full min-w-0">
            <svg viewBox="0 0 100 64" class="h-60 w-full overflow-visible lg:h-72" preserveAspectRatio="none">
              <line x1="0" y1="14" x2="100" y2="14" stroke="rgba(0,0,0,0.05)" stroke-width="0.8" />
              <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(0,0,0,0.05)" stroke-width="0.8" />
              <line x1="0" y1="42" x2="100" y2="42" stroke="rgba(0,0,0,0.05)" stroke-width="0.8" />
              <line x1="0" y1="56" x2="100" y2="56" stroke="rgba(0,0,0,0.08)" stroke-width="0.8" />
              <polyline
                v-if="compareEnabled"
                fill="none"
                stroke="#D88F8D"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="lineChartPointsBudget"
              />
              <polyline
                fill="none"
                stroke="#5B7BE1"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="lineChartPointsActual"
              />
            </svg>
            <div class="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-black/58">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-[#5B7BE1]" />
                <span class="font-medium">Actual</span>
              </div>
              <div v-if="compareEnabled" class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-[#D88F8D]" />
                <span class="font-medium">Budget</span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap justify-between gap-2 text-[13px] text-black/52">
              <span v-for="w in spendDemoWeeks" :key="w.label" class="min-w-0 truncate">{{ w.label }}</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12">
        <div class="mb-3 flex items-center gap-3">
          <div class="sv-section-icon-wrap">
            <Target class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <h3 class="sv-card-title">
            Campaign Progress
          </h3>
        </div>
        <div class="space-y-3 border-t border-black/[0.06] pt-3">
          <div
            v-for="row in pacingForDisplay"
            :key="row.id"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-[14px] font-semibold text-black">
                  {{ row.campaign }}
                </p>
                <p class="mt-1 text-[12px] text-black/46">
                  {{ row.objective }}
                </p>
              </div>
              <StatusBadge :label="row.alert" :variant="statusVariant(row.alert)" />
            </div>
            <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                class="h-full rounded-full bg-black/40"
                :style="{ width: `${Math.min(row.pace, 120)}%` }"
              />
            </div>
            <div class="mt-3 flex items-center justify-between gap-3 text-[13px] text-black/52">
              <span>{{ formatCompactCurrency(row.actual) }} actual</span>
              <span>{{ formatCompactCurrency(row.budget) }} budget</span>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="sm" class="col-span-12">
        <div class="mb-3 flex items-center gap-3">
          <div class="sv-section-icon-wrap">
            <Receipt class="h-5 w-5" :stroke-width="1.9" />
          </div>
          <h3 class="sv-card-title">
            Transaction History
          </h3>
        </div>
        <div class="border-t border-black/[0.06] pt-3">
          <div :class="tableWrapClass">
            <table class="data-table min-w-full text-left text-[15px]">
              <thead>
                <tr class="data-table-head-row">
                  <th :class="thClass" scope="col">Date</th>
                  <th :class="thClass" scope="col">Campaign</th>
                  <th :class="thClass" scope="col">Channel</th>
                  <th :class="thClass" scope="col">Region</th>
                  <th :class="thClass" scope="col">Spend</th>
                  <th :class="thClass" scope="col">Status</th>
                  <th :class="thClass" scope="col">Goal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in ledgerRows" :key="row.id" class="data-table-row">
                  <td :class="tdClass">{{ row.date }}</td>
                  <td :class="tdClass">{{ row.campaign }}</td>
                  <td :class="tdClass">
                    <StatusBadge :label="row.channel" :variant="channelVariant(row.channel)" />
                  </td>
                  <td :class="tdClass">{{ row.region }}</td>
                  <td :class="tdClass">{{ row.amount }}</td>
                  <td :class="tdClass">
                    <StatusBadge
                      :label="row.status"
                      :variant="
                        row.status === 'Settled' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Adjusted' ? 'info' : 'neutral'
                      "
                    />
                  </td>
                  <td :class="tdClass">{{ row.goal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SurfaceCard>

      <div class="col-span-12 grid grid-cols-12 gap-3 lg:gap-4">
        <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-6">
          <div class="mb-3 flex items-center gap-3">
            <div class="sv-section-icon-wrap">
              <CalendarRange class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <h3 class="sv-card-title">
              Weekly Summary
            </h3>
          </div>
          <div class="border-t border-black/[0.06] pt-3">
            <div :class="tableWrapClass">
              <table class="data-table min-w-full text-left text-[15px]">
                <thead>
                  <tr class="data-table-head-row">
                    <th :class="thClass" scope="col">Week</th>
                    <th :class="thClass" scope="col">Actual</th>
                    <th :class="thClass" scope="col">Budget</th>
                    <th :class="thClass" scope="col">Variance</th>
                    <th :class="thClass" scope="col">Driver</th>
                    <th :class="thClass" scope="col">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in weeklyRows" :key="row.id" class="data-table-row">
                    <td :class="tdClass">{{ row.week }}</td>
                    <td :class="tdClass">{{ row.actual }}</td>
                    <td :class="tdClass">{{ row.budget }}</td>
                    <td :class="tdClass">{{ row.variance }}</td>
                    <td :class="tdClass">{{ row.driver }}</td>
                    <td :class="tdClass">{{ row.roas }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="frame" padding="sm" class="col-span-12 xl:col-span-6">
          <div class="mb-3 flex items-center gap-3">
            <div class="sv-section-icon-wrap">
              <Table2 class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <h3 class="sv-card-title">
              Budget Detail
            </h3>
          </div>
          <div class="border-t border-black/[0.06] pt-3">
            <div :class="tableWrapClass">
              <table class="data-table min-w-full text-left text-[15px]">
                <thead>
                  <tr class="data-table-head-row">
                    <th :class="thClass" scope="col">Campaign</th>
                    <th :class="thClass" scope="col">Channel</th>
                    <th :class="thClass" scope="col">Region</th>
                    <th :class="thClass" scope="col">Objective</th>
                    <th :class="thClass" scope="col">Budget</th>
                    <th :class="thClass" scope="col">Actual</th>
                    <th :class="thClass" scope="col">Pace</th>
                    <th :class="thClass" scope="col">Alert</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in pacingRows" :key="row.id" class="data-table-row">
                    <td :class="tdClass">{{ row.campaign }}</td>
                    <td :class="tdClass">
                      <StatusBadge :label="row.channel" :variant="channelVariant(row.channel)" />
                    </td>
                    <td :class="tdClass">{{ row.region }}</td>
                    <td :class="tdClass">{{ row.objective }}</td>
                    <td :class="tdClass">{{ row.budget }}</td>
                    <td :class="tdClass">{{ row.actual }}</td>
                    <td :class="tdClass">
                      <div class="min-w-[7rem]">
                        <p class="text-[13px] font-semibold text-black">{{ row.pace }}</p>
                        <div class="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.06]">
                          <div
                            class="h-full rounded-full bg-black/40"
                            :style="{ width: `${Math.min(Number(row.rawPace), 120)}%` }"
                          />
                        </div>
                      </div>
                    </td>
                    <td :class="tdClass">
                      <StatusBadge :label="row.alert" :variant="statusVariant(row.alert)" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  </div>
</template>
