<script setup lang="ts">
// @ts-nocheck
import type { Component } from "vue";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Database,
  GripVertical,
  Layers3,
  Palette,
  Play,
  Save,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-vue-next";
import { creativeAssets, performanceCampaigns } from "~/composables/useDemoAnalytics";

definePageMeta({ layout: "app" });

useHead({ title: "Lab — Solvomo" });

const {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatMultiplier,
  formatPercent,
} = useDemoAnalytics();

type SourceId =
  | "meta"
  | "google"
  | "tiktok"
  | "linkedin"
  | "shopify"
  | "ga4"
  | "crm"
  | "creator"
  | "canva";

type PoolKind = "campaign" | "adset" | "creative" | "ad";

type ScenarioRow = {
  uid: string;
  kind: PoolKind;
  refId: string;
  label: string;
};

const dataSources: Array<{
  id: SourceId;
  label: string;
  hint: string;
  icon: Component;
  accent: string;
}> = [
  { id: "meta", label: "Meta Ads", hint: "Paid social", icon: Zap, accent: "from-[#5B7BE1]/25 to-[#5FC7D4]/15" },
  { id: "google", label: "Google Ads", hint: "Search + PMax", icon: BarChart3, accent: "from-[#5FC7D4]/20 to-white" },
  { id: "tiktok", label: "TikTok Ads", hint: "Short-form", icon: Sparkles, accent: "from-black/8 to-white" },
  { id: "linkedin", label: "LinkedIn Ads", hint: "B2B", icon: Users, accent: "from-[#5B7BE1]/18 to-white" },
  { id: "shopify", label: "Shopify", hint: "Commerce", icon: Layers3, accent: "from-emerald-500/15 to-white" },
  { id: "ga4", label: "GA4", hint: "Behavior", icon: BarChart3, accent: "from-amber-500/12 to-white" },
  { id: "crm", label: "CRM", hint: "Outcomes", icon: Database, accent: "from-violet-500/15 to-white" },
  { id: "creator", label: "Creator uploads", hint: "Influencer", icon: Upload, accent: "from-rose-400/15 to-white" },
  { id: "canva", label: "Canva", hint: "Sync creatives", icon: Palette, accent: "from-sky-400/18 to-white" },
];

const selectedSources = ref<Set<SourceId>>(
  new Set<SourceId>(["meta", "google", "canva"]),
);

function toggleSource(id: SourceId) {
  const next = new Set(selectedSources.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedSources.value = next;
}

const assetTab = ref<PoolKind>("campaign");

const tabOptions: Array<{ id: PoolKind; label: string }> = [
  { id: "campaign", label: "Campaigns" },
  { id: "adset", label: "Ad sets" },
  { id: "creative", label: "Creatives" },
  { id: "ad", label: "Ads" },
];

const adSets = computed(() =>
  performanceCampaigns.flatMap((c) => [
    {
      id: `${c.id}-as-a`,
      label: `Broad · ${c.name.split(" - ")[0] ?? c.name}`,
      campaignId: c.id,
      channel: c.channel,
    },
    {
      id: `${c.id}-as-b`,
      label: `Tight · ${c.name.split(" - ")[0] ?? c.name}`,
      campaignId: c.id,
      channel: c.channel,
    },
  ]),
);

function campaignFor(id: string) {
  return performanceCampaigns.find((c) => c.id === id);
}

function ctrForCampaign(id: string) {
  const c = campaignFor(id);
  if (!c || !c.impressions) return 1.35;
  return (c.clicks / c.impressions) * 100;
}

function creativeFor(id: string) {
  return creativeAssets.find((a) => a.id === id);
}

const poolLabel = computed(() => {
  switch (assetTab.value) {
    case "campaign":
      return "Campaigns";
    case "adset":
      return "Ad sets";
    case "creative":
      return "Creatives";
    case "ad":
      return "Ads";
    default:
      return "";
  }
});

const poolItems = computed(() => {
  if (assetTab.value === "campaign") {
    return performanceCampaigns.map((c) => ({
      id: c.id,
      label: c.name,
      sub: c.channel,
      kind: "campaign" as const,
    }));
  }
  if (assetTab.value === "adset") {
    return adSets.value.map((a) => ({
      id: a.id,
      label: a.label,
      sub: a.channel,
      kind: "adset" as const,
    }));
  }
  if (assetTab.value === "creative") {
    return creativeAssets.slice(0, 12).map((a) => ({
      id: a.id,
      label: a.name,
      sub: a.platform,
      kind: "creative" as const,
    }));
  }
  return creativeAssets.slice(0, 12).map((a) => ({
    id: `ad-${a.id}`,
    label: `Ad · ${a.name}`,
    sub: a.platform,
    kind: "ad" as const,
    creativeId: a.id,
  }));
});

const pipeline = ref<ScenarioRow[]>([
  {
    uid: "seed-1",
    kind: "campaign",
    refId: "cmp-meta-prospecting",
    label: "Meta Prospecting - Founder Narrative",
  },
  {
    uid: "seed-2",
    kind: "campaign",
    refId: "cmp-google-brand",
    label: "Google Brand Search - High Intent",
  },
]);

const rawWeights = ref<number[]>([52, 48]);

watch(
  () => pipeline.value.length,
  (n) => {
    if (n <= 0) {
      rawWeights.value = [];
      return;
    }
    if (rawWeights.value.length === n) return;
    const eq = 100 / n;
    rawWeights.value = Array.from({ length: n }, () => eq);
  },
  { immediate: true },
);

const allocationPct = computed(() => {
  const raw = rawWeights.value;
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((w) => (w / sum) * 100);
});

function normalizeWeights() {
  const sum = rawWeights.value.reduce((a, b) => a + b, 0) || 1;
  rawWeights.value = rawWeights.value.map((w) => (w / sum) * 100);
}

function addToPipeline(kind: PoolKind, refId: string, label: string) {
  const uid = `${kind}-${refId}-${Date.now().toString(36)}`;
  pipeline.value = [...pipeline.value, { uid, kind, refId, label }];
  const n = pipeline.value.length;
  const eq = 100 / n;
  rawWeights.value = Array.from({ length: n }, () => eq);
}

function removeFromPipeline(uid: string) {
  pipeline.value = pipeline.value.filter((r) => r.uid !== uid);
  const n = pipeline.value.length;
  if (n === 0) rawWeights.value = [];
  else {
    const eq = 100 / n;
    rawWeights.value = Array.from({ length: n }, () => eq);
  }
}

function movePipeline(uid: string, dir: -1 | 1) {
  const i = pipeline.value.findIndex((r) => r.uid === uid);
  if (i < 0) return;
  const j = i + dir;
  if (j < 0 || j >= pipeline.value.length) return;
  const copy = [...pipeline.value];
  const t = copy[i]!;
  copy[i] = copy[j]!;
  copy[j] = t;
  pipeline.value = copy;
  const w = [...rawWeights.value];
  const wt = w[i]!;
  w[i] = w[j]!;
  w[j] = wt;
  rawWeights.value = w;
}

const dragPayload = ref<string | null>(null);

function onDragStart(e: DragEvent, kind: PoolKind, refId: string, label: string) {
  dragPayload.value = JSON.stringify({ kind, refId, label });
  e.dataTransfer?.setData("application/json", dragPayload.value);
  e.dataTransfer!.effectAllowed = "copy";
}

function onDragEnd() {
  dragPayload.value = null;
}

const dropActive = ref(false);

function onDragOver(e: DragEvent) {
  e.preventDefault();
  dropActive.value = true;
}

function onDragLeave() {
  dropActive.value = false;
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  dropActive.value = false;
  const raw = e.dataTransfer?.getData("application/json") ?? dragPayload.value;
  if (!raw) return;
  try {
    const p = JSON.parse(raw) as { kind: PoolKind; refId: string; label: string };
    if (p?.refId && p?.label && p?.kind) addToPipeline(p.kind, p.refId, p.label);
  } catch {
    /* ignore */
  }
}

function clickAddPool(item: { kind: PoolKind; id: string; label: string }) {
  addToPipeline(item.kind, item.id, item.label);
}

const scenarioBudget = ref(92000);

/** Assumptions — compact model knobs (display % / index scales). */
const ctrUplift = ref(8);
const cvrBasis = ref(2.15);
const fatigueDecay = ref(14);
const audienceOverlap = ref(22);
const remarketingEff = ref(74);
const attributionConf = ref(82);

function rowCtr(row: ScenarioRow): number {
  if (row.kind === "campaign") return ctrForCampaign(row.refId);
  if (row.kind === "adset") {
    const campId = row.refId.split("-as-")[0] ?? "";
    return ctrForCampaign(campId) * 0.97;
  }
  if (row.kind === "creative") {
    const cr = creativeFor(row.refId);
    return cr?.ctr ?? 1.4;
  }
  const creativeId = row.refId.replace(/^ad-/, "");
  const cr = creativeFor(creativeId);
  return cr?.ctr ?? 1.35;
}

const blendedCtr = computed(() => {
  const rows = pipeline.value;
  const pct = allocationPct.value;
  if (!rows.length) return 1.4;
  let s = 0;
  rows.forEach((row, i) => {
    s += rowCtr(row) * ((pct[i] ?? 0) / 100);
  });
  return s;
});

const sourceFactor = computed(() => {
  const n = selectedSources.value.size;
  if (!n) return 0.92;
  let f = 1;
  if (selectedSources.value.has("ga4")) f += 0.02;
  if (selectedSources.value.has("crm")) f += 0.03;
  if (selectedSources.value.has("canva")) f += 0.015;
  if (selectedSources.value.has("creator")) f += 0.01;
  return Math.min(1.12, f);
});

const simulation = computed(() => {
  const spend = Math.max(1000, scenarioBudget.value);
  const ctr0 = blendedCtr.value;
  const ctr =
    ctr0 *
    (1 + ctrUplift.value / 100) *
    (1 - fatigueDecay.value / 220) *
    (1 - audienceOverlap.value / 400) *
    sourceFactor.value;

  const cvr =
    cvrBasis.value *
    (remarketingEff.value / 100) *
    (attributionConf.value / 100) *
    0.92;

  const cpm = 9.2 + fatigueDecay.value * 0.04;
  const impressions = (spend / cpm) * 1000;
  const clicks = impressions * (ctr / 100);
  const sessions = clicks * 0.91;
  const conversions = sessions * (cvr / 100);
  const aov = 418;
  const revenue = conversions * aov;
  const roas = revenue / spend;
  const roi = (revenue - spend) / spend;
  const cac = conversions > 0 ? spend / conversions : 0;
  const reach = impressions * 0.62;

  const confidence = Math.round(
    Math.min(
      96,
      58 + attributionConf.value * 0.22 - fatigueDecay.value * 0.15 - audienceOverlap.value * 0.08,
    ),
  );

  const efficiency = Math.round(
    Math.min(99, 52 + roas * 8 + (100 - fatigueDecay.value) * 0.12),
  );

  return {
    impressions,
    clicks,
    sessions,
    conversions,
    revenue,
    roas,
    roi,
    cac,
    reach,
    ctr,
    cvr,
    confidence,
    efficiency,
  };
});

const funnelStages = computed(() => {
  const s = simulation.value;
  const max = Math.max(s.impressions, 1);
  return [
    { key: "spend", label: "Spend", value: scenarioBudget.value, width: 100, format: "currency" as const },
    {
      key: "impressions",
      label: "Impressions",
      value: s.impressions,
      width: Math.max(8, (s.impressions / max) * 100),
      format: "num" as const,
    },
    {
      key: "clicks",
      label: "Clicks",
      value: s.clicks,
      width: Math.max(8, (s.clicks / max) * 100),
      format: "num" as const,
    },
    {
      key: "sessions",
      label: "Sessions",
      value: s.sessions,
      width: Math.max(8, (s.sessions / max) * 100),
      format: "num" as const,
    },
    {
      key: "conversions",
      label: "Conversions",
      value: s.conversions,
      width: Math.max(8, (s.conversions / max) * 100),
      format: "num" as const,
    },
    {
      key: "revenue",
      label: "Revenue",
      value: s.revenue,
      width: Math.max(10, Math.min(100, (s.revenue / (scenarioBudget.value * 6)) * 18)),
      format: "currency" as const,
    },
  ];
});

const runPulse = ref(0);
const scenarioName = ref("North America · mixed funnel");

function runSimulation() {
  runPulse.value += 1;
}

function formatFunnelVal(v: number, format: "currency" | "num") {
  if (format === "currency") return formatCompactCurrency(v);
  return formatCompactNumber(v);
}

const outputTiles = computed(() => {
  const s = simulation.value;
  return [
    { label: "Projected ROAS", value: formatMultiplier(s.roas, 1), delta: "+0.3x vs baseline", tone: "text-[#5B7BE1]" },
    { label: "Projected ROI", value: `${(s.roi * 100).toFixed(0)}%`, delta: "After modeled costs", tone: "text-emerald-700/90" },
    { label: "CAC", value: formatCurrency(s.cac, 0), delta: "Blended", tone: "text-black" },
    { label: "Revenue", value: formatCompactCurrency(s.revenue), delta: "Attributed", tone: "text-black" },
    { label: "Conversions", value: formatCompactNumber(s.conversions), delta: "Post-click", tone: "text-black" },
    { label: "Reach (est.)", value: formatCompactNumber(s.reach), delta: "Unique", tone: "text-black" },
    { label: "Efficiency score", value: `${s.efficiency}`, delta: "Model composite", tone: "text-black" },
    { label: "Confidence", value: `${s.confidence}%`, delta: "Assumption-weighted", tone: "text-black/80" },
  ];
});
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2 lab-page">
    <PageHeader title="Lab" dense metadata-tight hide-context description="Build a spend scenario and preview projected outcomes.">
      <template #actions>
        <label class="flex min-h-[3rem] min-w-[10rem] flex-col justify-center gap-1">
          <span class="sv-section-title">Scenario</span>
          <select v-model="scenarioName" class="app-control min-h-[2.5rem] py-1.5 text-sm">
            <option>North America · mixed funnel</option>
            <option>Brand-heavy · Q2 test</option>
            <option>Creative swap · founder vs demo</option>
          </select>
        </label>
        <button type="button" class="app-button button-secondary min-h-[3rem] gap-2 px-3 text-sm">
          <Save class="h-4 w-4 text-black/50" :stroke-width="1.9" aria-hidden="true" />
          Save
        </button>
        <button type="button" class="app-button button-primary min-h-[3rem] gap-2 px-4 text-sm text-white" @click="runSimulation">
          <Play class="h-4 w-4 opacity-95" :stroke-width="1.9" aria-hidden="true" />
          Run simulation
        </button>
      </template>
    </PageHeader>

    <!-- Builder canvas -->
    <div class="grid gap-4 xl:grid-cols-[minmax(17rem,19rem)_minmax(0,1fr)_minmax(17rem,20rem)]">
      <!-- Left: sources + assets -->
      <div class="flex flex-col gap-4">
        <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
          <p class="sv-section-title">
            Data sources
          </p>
          <p class="mt-1 text-[13px] leading-snug text-black/45">
            Connect signals into this scenario. Canva brings design-ready cuts.
          </p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <button
              v-for="src in dataSources"
              :key="src.id"
              type="button"
              class="lab-source-card group relative flex flex-col overflow-hidden rounded-2xl border p-3 text-left transition"
              :class="
                selectedSources.has(src.id)
                  ? 'border-black/25 bg-white shadow-[0_12px_36px_-24px_rgba(15,23,42,0.45)] ring-1 ring-black/10'
                  : 'border-black/10 bg-white/80 hover:border-black/16'
              "
              @click="toggleSource(src.id)"
            >
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90"
                :class="src.accent"
              />
              <div class="relative flex items-start gap-2.5">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white/90 shadow-sm">
                  <component :is="src.icon" class="h-4 w-4 text-black/60" :stroke-width="1.9" aria-hidden="true" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] font-semibold leading-tight text-black">
                    {{ src.label }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-black/45">
                    {{ src.hint }}
                  </p>
                </div>
              </div>
              <span
                class="relative mt-2 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide"
                :class="selectedSources.has(src.id) ? 'bg-black text-white' : 'bg-black/[0.06] text-black/45'"
              >
                {{ selectedSources.has(src.id) ? "On" : "Off" }}
              </span>
            </button>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="frame" padding="sm" class="min-h-[20rem] flex-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="sv-section-title">
                Asset pool
              </p>
              <p class="mt-0.5 text-[13px] text-black/45">
                {{ poolLabel }}
              </p>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <button
              v-for="tab in tabOptions"
              :key="tab.id"
              type="button"
              class="rounded-full border px-3 py-1.5 text-[12px] font-semibold transition"
              :class="assetTab === tab.id ? 'border-black bg-black text-white' : 'border-black/10 text-black/55 hover:border-black/18'"
              @click="assetTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <ul class="mt-4 max-h-[min(22rem,52vh)] space-y-2 overflow-y-auto pr-1">
            <li
              v-for="item in poolItems"
              :key="item.id"
              class="flex items-stretch gap-2"
            >
              <button
                type="button"
                draggable="true"
                class="lab-pool-item group flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2.5 text-left transition hover:border-black/18 hover:bg-white"
                @dragstart="onDragStart($event, item.kind, item.id, item.label)"
                @dragend="onDragEnd"
                @click="clickAddPool({ kind: item.kind, id: item.id, label: item.label })"
              >
                <GripVertical class="h-4 w-4 shrink-0 text-black/25 group-hover:text-black/45" :stroke-width="1.9" aria-hidden="true" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-semibold text-black">
                    {{ item.label }}
                  </p>
                  <p class="truncate text-[11px] text-black/42">
                    {{ item.sub }}
                  </p>
                </div>
              </button>
            </li>
          </ul>
          <p class="mt-3 text-[11px] leading-relaxed text-black/40">
            Drag into the scenario strip, or click to add. Reorder with arrows on each block.
          </p>
        </SurfaceCard>
      </div>

      <!-- Center: allocation + funnel -->
      <div class="flex min-w-0 flex-col gap-4">
        <SurfaceCard variant="frame" padding="sm" class="border border-black/[0.06]">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="sv-section-title">
                Scenario path
              </p>
              <h2 class="sv-card-title mt-1">
                Spend allocation
              </h2>
              <p class="mt-1 max-w-xl text-[13px] leading-snug text-black/48">
                Allocated budget for this run. Distribution follows the mix you place in the strip.
              </p>
            </div>
            <div class="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-right">
              <p class="text-[11px] font-bold uppercase tracking-wide text-black/40">
                Allocated
              </p>
              <p class="mt-1 text-[1.35rem] font-semibold tabular-nums tracking-tight text-black">
                {{ formatCompactCurrency(scenarioBudget) }}
              </p>
            </div>
          </div>

          <div class="mt-5">
            <label class="flex items-center justify-between gap-3 text-[13px] font-semibold text-black">
              <span>Total scenario budget</span>
              <span class="tabular-nums text-black/55">{{ formatCompactCurrency(scenarioBudget) }}</span>
            </label>
            <input
              v-model.number="scenarioBudget"
              type="range"
              min="20000"
              max="240000"
              step="1000"
              class="lab-range mt-2 w-full"
            >
          </div>

          <div
            class="lab-dropzone mt-6 rounded-[1.25rem] border-2 border-dashed px-3 py-4 transition"
            :class="dropActive ? 'border-[#5B7BE1] bg-[#5B7BE1]/[0.06]' : 'border-black/12 bg-black/[0.015]'"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
          >
            <div class="mb-3 flex items-center justify-between gap-2">
              <span class="text-[12px] font-bold uppercase tracking-wide text-black/40">In this simulation</span>
              <span class="text-[11px] text-black/38">Drop zone</span>
            </div>
            <div v-if="!pipeline.length" class="py-8 text-center text-[13px] text-black/42">
              Drag campaigns, ad sets, creatives, or ads here.
            </div>
            <TransitionGroup v-else name="lab-list" tag="ul" class="space-y-3">
              <li
                v-for="(row, idx) in pipeline"
                :key="row.uid"
                class="lab-scenario-row rounded-2xl border border-black/10 bg-white p-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]"
              >
                <div class="flex flex-wrap items-start gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black/50">
                        {{ row.kind }}
                      </span>
                      <span class="text-[12px] tabular-nums text-black/45">{{ allocationPct[idx]?.toFixed(0) ?? "—" }}%</span>
                    </div>
                    <p class="mt-1.5 text-[14px] font-semibold leading-snug text-black">
                      {{ row.label }}
                    </p>
                  </div>
                  <div class="flex flex-col gap-1">
                    <button
                      type="button"
                      class="rounded-lg border border-black/10 p-1 text-black/45 hover:bg-black/[0.04] hover:text-black"
                      aria-label="Move up"
                      @click="movePipeline(row.uid, -1)"
                    >
                      <ChevronUp class="h-4 w-4" :stroke-width="1.9" />
                    </button>
                    <button
                      type="button"
                      class="rounded-lg border border-black/10 p-1 text-black/45 hover:bg-black/[0.04] hover:text-black"
                      aria-label="Move down"
                      @click="movePipeline(row.uid, 1)"
                    >
                      <ChevronDown class="h-4 w-4" :stroke-width="1.9" />
                    </button>
                  </div>
                </div>
                <div class="mt-3">
                  <input
                    v-model.number="rawWeights[idx]"
                    type="range"
                    min="4"
                    max="96"
                    step="1"
                    class="lab-range w-full"
                    @input="normalizeWeights"
                  >
                </div>
                <button
                  type="button"
                  class="mt-2 text-[12px] font-semibold text-black/40 hover:text-black/65"
                  @click="removeFromPipeline(row.uid)"
                >
                  Remove
                </button>
              </li>
            </TransitionGroup>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-2 border-t border-black/8 pt-5">
            <span class="text-[11px] font-bold uppercase tracking-wide text-black/38">Flow</span>
            <div class="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-black/45">
              <span>Sources</span>
              <ArrowRight class="h-3.5 w-3.5 shrink-0" :stroke-width="2" />
              <span>Assets</span>
              <ArrowRight class="h-3.5 w-3.5 shrink-0" :stroke-width="2" />
              <span>Spend</span>
              <ArrowRight class="h-3.5 w-3.5 shrink-0" :stroke-width="2" />
              <span>Model</span>
              <ArrowRight class="h-3.5 w-3.5 shrink-0" :stroke-width="2" />
              <span>Outcomes</span>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="frame" padding="sm" class="relative overflow-hidden">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="sv-section-title">
                Simulation funnel
              </p>
              <h3 class="sv-card-title mt-1">
                Modeled flow
              </h3>
              <p class="mt-1 text-[13px] text-black/48">
                Spend flows into delivery, then outcomes — scaled from your mix and assumptions.
              </p>
            </div>
            <Sparkles class="h-5 w-5 text-[#5B7BE1]/80" :stroke-width="1.9" aria-hidden="true" />
          </div>
          <div :key="runPulse" class="lab-funnel mt-6 space-y-3">
            <div
              v-for="(stage, si) in funnelStages"
              :key="stage.key"
              class="lab-funnel-row"
              :style="{ transitionDelay: `${si * 45}ms` }"
            >
              <div class="flex items-center justify-between gap-3 text-[12px]">
                <span class="font-semibold text-black/55">{{ stage.label }}</span>
                <span class="tabular-nums text-black">{{ formatFunnelVal(stage.value, stage.format) }}</span>
              </div>
              <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  class="lab-funnel-bar h-full rounded-full bg-gradient-to-r from-[#5FC7D4]/90 to-[#5B7BE1]/95"
                  :style="{ width: `${Math.min(100, stage.width)}%` }"
                />
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#5B7BE1]/10 blur-3xl" aria-hidden="true" />
        </SurfaceCard>
      </div>

      <!-- Right: outputs + assumptions -->
      <div class="flex flex-col gap-4">
        <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
          <p class="sv-section-title">
            Projected outcomes
          </p>
          <p class="mt-1 text-[13px] text-black/45">
            Scenario vs baseline hints (demo calibration).
          </p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div
              v-for="tile in outputTiles"
              :key="tile.label"
              class="rounded-2xl border border-black/[0.07] bg-white px-3 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.4)]"
            >
              <p class="text-[10px] font-bold uppercase tracking-wide text-black/40">
                {{ tile.label }}
              </p>
              <p class="mt-2 text-[1.15rem] font-semibold tabular-nums leading-none" :class="tile.tone">
                {{ tile.value }}
              </p>
              <p class="mt-2 text-[11px] text-black/42">
                {{ tile.delta }}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="frame" padding="sm">
          <p class="sv-section-title">
            Assumptions
          </p>
          <p class="mt-1 text-[13px] leading-snug text-black/45">
            Light-touch levers — adjust and re-run.
          </p>
          <div class="mt-4 space-y-4">
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>CTR uplift</span>
                <span class="tabular-nums text-black/55">+{{ ctrUplift }}%</span>
              </div>
              <input v-model.number="ctrUplift" type="range" min="-15" max="35" step="1" class="lab-range mt-2 w-full">
            </div>
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>Conversion rate</span>
                <span class="tabular-nums text-black/55">{{ cvrBasis.toFixed(2) }}%</span>
              </div>
              <input v-model.number="cvrBasis" type="range" min="0.4" max="5.5" step="0.05" class="lab-range mt-2 w-full">
            </div>
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>Fatigue decay</span>
                <span class="tabular-nums text-black/55">{{ fatigueDecay }}</span>
              </div>
              <input v-model.number="fatigueDecay" type="range" min="0" max="60" step="1" class="lab-range mt-2 w-full">
            </div>
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>Audience overlap</span>
                <span class="tabular-nums text-black/55">{{ audienceOverlap }}%</span>
              </div>
              <input v-model.number="audienceOverlap" type="range" min="0" max="55" step="1" class="lab-range mt-2 w-full">
            </div>
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>Remarketing efficiency</span>
                <span class="tabular-nums text-black/55">{{ remarketingEff }}%</span>
              </div>
              <input v-model.number="remarketingEff" type="range" min="35" max="100" step="1" class="lab-range mt-2 w-full">
            </div>
            <div>
              <div class="flex justify-between text-[12px] font-semibold text-black">
                <span>Attribution confidence</span>
                <span class="tabular-nums text-black/55">{{ attributionConf }}%</span>
              </div>
              <input v-model.number="attributionConf" type="range" min="40" max="100" step="1" class="lab-range mt-2 w-full">
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard variant="soft" padding="sm" class="border border-dashed border-black/12">
          <div class="flex gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white">
              <Palette class="h-5 w-5 text-sky-600/90" :stroke-width="1.9" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-black">
                Canva in the loop
              </p>
              <p class="mt-1 text-[13px] leading-relaxed text-black/48">
                Pull verified frames from Evolve or sync variants from Canva as a source, then run them through this model.
              </p>
              <NuxtLink to="/app/evolve" class="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5B7BE1] hover:underline">
                Open Evolve
                <ArrowRight class="h-3.5 w-3.5" :stroke-width="2" />
              </NuxtLink>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-range {
  accent-color: rgba(91, 123, 225, 0.95);
  height: 0.35rem;
}

.lab-funnel-bar {
  transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.lab-funnel-row {
  animation: lab-fade-in 0.5s ease both;
}

@keyframes lab-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lab-list-enter-active,
.lab-list-leave-active {
  transition: all 0.35s ease;
}
.lab-list-enter-from,
.lab-list-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.lab-page :deep(.sv-page-description) {
  max-width: 28rem;
}
</style>
