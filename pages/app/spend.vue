<script setup lang="ts">
// @ts-nocheck
import {
  CalendarRange,
  Download,
  GitCompareArrows,
  Layers3,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-vue-next";
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Spend — Solvomo" });

const {
  reportingMeta,
  totals,
  spendBudgetByWeek,
  campaignPacing,
  spendChannels,
  spendObjectives,
  performanceChannelBreakdown,
  spendObjectiveBreakdown,
  spendRecommendations,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatMultiplier,
  channelVariant,
  statusVariant,
} = useDemoAnalytics();

const selectedRange = ref("This quarter");
const selectedChannel = ref("All channels");
const selectedObjective = ref("All objectives");
const compareEnabled = ref(true);

const filteredPacing = computed(() =>
  campaignPacing.filter((row) => {
    if (selectedChannel.value !== "All channels" && row.channel !== selectedChannel.value) return false;
    if (selectedObjective.value !== "All objectives" && row.objective !== selectedObjective.value) return false;
    return true;
  }),
);

const metadataItems = computed(() => [
  { label: "Last synced", value: reportingMeta.lastSynced },
  { label: "Compared", value: reportingMeta.comparisonLabel },
  { label: "Budgets", value: `${filteredPacing.value.length}` },
  { label: "Attribution", value: reportingMeta.attributionModel },
]);

const blendedBudget = computed(() => spendBudgetByWeek.reduce((total, row) => total + row.budget, 0));
const blendedActual = computed(() => spendBudgetByWeek.reduce((total, row) => total + row.actual, 0));
const dailyAverageSpend = computed(() => blendedActual.value / 31);
const budgetPacing = computed(() => (blendedActual.value / blendedBudget.value) * 100);

const kpis = computed(() => [
  { title: "Total spend", value: formatCompactCurrency(totals.value.spend), delta: "+8.4%", helper: "Paid + tracked", tone: "info" as const, icon: Wallet, trend: spendBudgetByWeek.map((row) => row.actual) },
  { title: "Daily avg", value: formatCurrency(dailyAverageSpend.value), delta: "+5.2%", helper: "31-day avg", tone: "neutral" as const, icon: PiggyBank, trend: spendBudgetByWeek.map((row) => row.actual / 7) },
  { title: "Budget pacing", value: formatPercent(budgetPacing.value, 1), delta: budgetPacing.value > 100 ? "Over plan" : "Within plan", helper: "Actual vs budget", tone: budgetPacing.value > 100 ? "warning" as const : "success" as const, icon: Target, trend: spendBudgetByWeek.map((row) => row.actual / row.budget * 100) },
  { title: "CAC", value: formatCurrency(totals.value.cac), delta: "-4.3%", helper: "Blended", tone: "success" as const, icon: TrendingDown, trend: spendBudgetByWeek.map((row) => row.actual / Math.max(row.roas * 2, 1)) },
  { title: "Blended ROAS", value: formatMultiplier(totals.value.mer, 1), delta: "+0.4x", helper: "Revenue / spend", tone: "success" as const, icon: TrendingUp, trend: spendBudgetByWeek.map((row) => row.roas) },
]);

const allocationSegments = computed(() =>
  performanceChannelBreakdown.value.map((row, index) => ({
    label: row.label,
    value: row.spend,
    valueLabel: formatCompactCurrency(row.spend),
    tone: index === 0 ? "depth" : index === 1 ? "product" : index === 2 ? "brand" : "neutral",
  })),
);

const weeklyRows = computed(() =>
  spendBudgetByWeek.map((row, index) => ({
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
  [...filteredPacing.value]
    .sort((left, right) => right.actual - left.actual)
    .map((row) => ({
      id: row.id,
      campaign: row.campaign,
      channel: row.channel,
      objective: row.objective,
      budget: formatCompactCurrency(row.budget),
      actual: formatCompactCurrency(row.actual),
      pace: formatPercent(row.pace, 0),
      alert: row.alert,
      rawPace: row.pace,
    })),
);

const weeklyColumns: DataTableColumn[] = [
  { key: "week", label: "Week" },
  { key: "actual", label: "Actual" },
  { key: "budget", label: "Budget" },
  { key: "variance", label: "Variance" },
  { key: "driver", label: "Driver" },
  { key: "roas", label: "ROAS" },
];

const pacingColumns: DataTableColumn[] = [
  { key: "campaign", label: "Campaign" },
  { key: "channel", label: "Channel" },
  { key: "objective", label: "Objective" },
  { key: "budget", label: "Budget" },
  { key: "actual", label: "Actual" },
  { key: "pace", label: "Pace" },
  { key: "alert", label: "Alert" },
];
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="Spend">
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
          v-for="option in ['This quarter', 'This month', 'Last 8 weeks']"
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
        <option v-for="option in spendChannels" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedObjective" class="app-control min-w-[11rem]">
        <option v-for="option in spendObjectives" :key="option" :value="option">
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

    <section class="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
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

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <SurfaceCard variant="soft" padding="lg" class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/62">
              <Wallet class="h-5 w-5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Trend</p>
              <h2 class="sv-section-heading mt-1">Spend vs budget</h2>
            </div>
          </div>
          <StatusBadge :label="budgetPacing > 100 ? 'Over pacing' : 'On plan'" :variant="budgetPacing > 100 ? 'warning' : 'success'" />
        </div>
        <AnalyticsLineChart
          :labels="spendBudgetByWeek.map((row) => row.label)"
          :series="[
            { label: 'Actual', values: spendBudgetByWeek.map((row) => row.actual), color: 'product' },
            { label: 'Budget', values: spendBudgetByWeek.map((row) => row.budget), color: 'brand' },
          ]"
          :value-formatter="formatCompactCurrency"
          variant="area"
        />
      </SurfaceCard>

      <div class="space-y-6">
        <SurfaceCard variant="frame" padding="md" class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
              <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Allocation</p>
              <h2 class="sv-section-heading mt-1">Budget split</h2>
            </div>
          </div>
          <AnalyticsSegmentBar :segments="allocationSegments" />
          <AnalyticsBarsList
            :items="performanceChannelBreakdown.map((row) => ({
              label: row.label,
              value: row.spend,
              valueLabel: formatCompactCurrency(row.spend),
              secondary: `${formatCompactCurrency(row.revenue)} revenue`,
              meta: `${formatMultiplier(row.roas, 1)} ROAS`,
            }))"
          />
        </SurfaceCard>

        <SurfaceCard variant="depth" padding="md" class="space-y-5">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
              <Target class="h-4.5 w-4.5" :stroke-width="1.9" />
            </div>
            <div>
              <p class="sv-section-title">Objectives</p>
              <h2 class="sv-section-heading mt-1">Spend by goal</h2>
            </div>
          </div>
          <AnalyticsBarsList
            :items="spendObjectiveBreakdown.map((row) => ({
              label: row.label,
              value: row.spend,
              valueLabel: formatCompactCurrency(row.spend),
              secondary: `${formatCompactCurrency(row.revenue)} revenue`,
              meta: `${formatMultiplier(row.roas, 1)} ROAS`,
            }))"
          />
        </SurfaceCard>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <SurfaceCard variant="product" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <Target class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Pacing</p>
            <h2 class="sv-section-heading mt-1">Campaign progress</h2>
          </div>
        </div>
        <div class="space-y-3">
          <div
            v-for="row in filteredPacing"
            :key="row.id"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-[14px] font-semibold text-black">{{ row.campaign }}</p>
                <p class="mt-1 text-[12px] text-black/46">{{ row.objective }}</p>
              </div>
              <StatusBadge :label="row.alert" :variant="statusVariant(row.alert)" />
            </div>
            <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
              <div
                class="h-full rounded-full"
                :class="row.pace > 100 ? 'bg-[linear-gradient(90deg,rgba(245,158,11,0.92),rgba(216,143,141,0.92))]' : row.pace < 90 ? 'bg-[linear-gradient(90deg,rgba(91,123,225,0.92),rgba(90,79,207,0.92))]' : 'bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]'"
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

      <SurfaceCard variant="frame" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <PiggyBank class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Recommendations</p>
            <h2 class="sv-section-heading mt-1">Budget widgets</h2>
          </div>
        </div>
        <div class="space-y-3">
          <div
            v-for="item in spendRecommendations"
            :key="item.title"
            class="sv-card-inset rounded-[1rem] px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-[15px] font-semibold text-black">{{ item.title }}</p>
              <StatusBadge label="Suggested" variant="info" />
            </div>
            <p class="mt-2 text-[13px] leading-6 text-black/52">{{ item.body }}</p>
          </div>
        </div>
      </SurfaceCard>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <SurfaceCard variant="frame" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-black/62">
            <CalendarRange class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Weekly ledger</p>
            <h2 class="sv-section-heading mt-1">Spend by week</h2>
          </div>
        </div>
        <DataTable :columns="weeklyColumns" :rows="weeklyRows" row-key="id" />
      </SurfaceCard>

      <SurfaceCard variant="soft" padding="md" class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-black/62">
            <Layers3 class="h-4.5 w-4.5" :stroke-width="1.9" />
          </div>
          <div>
            <p class="sv-section-title">Campaign pacing</p>
            <h2 class="sv-section-heading mt-1">Budget table</h2>
          </div>
        </div>
        <DataTable :columns="pacingColumns" :rows="pacingRows" row-key="id">
          <template #cell-channel="{ value }">
            <StatusBadge :label="String(value)" :variant="channelVariant(String(value))" />
          </template>
          <template #cell-pace="{ row }">
            <div class="min-w-[7rem]">
              <div class="flex items-center justify-between gap-2 text-[13px] font-semibold text-black">
                <span>{{ row.pace }}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(95,199,212,0.96),rgba(91,123,225,0.92))]"
                  :style="{ width: `${Math.min(Number(row.rawPace), 120)}%` }"
                />
              </div>
            </div>
          </template>
          <template #cell-alert="{ value }">
            <StatusBadge :label="String(value)" :variant="statusVariant(String(value))" />
          </template>
        </DataTable>
      </SurfaceCard>
    </section>
  </div>
</template>
