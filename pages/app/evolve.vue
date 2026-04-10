<script setup lang="ts">
import { ArrowRight, CheckCircle2, Download, Palette, Sparkles } from "lucide-vue-next";
import CreativeVariantThumb from "~/components/app/creatives/CreativeVariantThumb.vue";
import adGrid1 from "~/assets/images/creatives/ad_grid_1.png";
import adGrid2 from "~/assets/images/creatives/ad_grid_2.png";
import adGrid3 from "~/assets/images/creatives/ad_grid_3.png";

definePageMeta({ layout: "app" });

useHead({ title: "Evolve — Solvomo" });

const grids = [adGrid1, adGrid2, adGrid3] as const;

function gridSrc(sheet: 1 | 2 | 3) {
  return grids[sheet - 1] ?? adGrid1;
}

/** Performance-ready, verified visuals for experimentation and publishing. */
const verifiedAssets = [
  {
    id: "ev-1",
    name: "Founder narrative — 15s proof",
    status: "verified" as const,
    sheet: 1 as const,
    variant: 0,
    roas: "4.8x",
    lastCheck: "Today",
    channel: "Meta Ads",
  },
  {
    id: "ev-2",
    name: "Product demo — workflow cut",
    status: "verified" as const,
    sheet: 2 as const,
    variant: 3,
    roas: "5.1x",
    lastCheck: "Yesterday",
    channel: "Google Ads",
  },
  {
    id: "ev-3",
    name: "Customer story — testimonial",
    status: "approved" as const,
    sheet: 1 as const,
    variant: 4,
    roas: "4.4x",
    lastCheck: "2d ago",
    channel: "YouTube",
  },
  {
    id: "ev-4",
    name: "Retargeting — social proof grid",
    status: "verified" as const,
    sheet: 3 as const,
    variant: 1,
    roas: "5.9x",
    lastCheck: "Today",
    channel: "Meta Ads",
  },
  {
    id: "ev-5",
    name: "ABM hero — desktop proof",
    status: "review" as const,
    sheet: 2 as const,
    variant: 5,
    roas: "—",
    lastCheck: "Queued",
    channel: "LinkedIn",
  },
  {
    id: "ev-6",
    name: "Seasonal refresh — studio pack",
    status: "verified" as const,
    sheet: 3 as const,
    variant: 2,
    roas: "4.2x",
    lastCheck: "3d ago",
    channel: "Meta Ads",
  },
];

function statusBadge(s: (typeof verifiedAssets)[number]["status"]): "success" | "info" | "warning" | "neutral" {
  if (s === "verified") return "success";
  if (s === "approved") return "info";
  if (s === "review") return "warning";
  return "neutral";
}

function statusLabel(s: (typeof verifiedAssets)[number]["status"]) {
  if (s === "verified") return "Verified";
  if (s === "approved") return "Approved";
  if (s === "review") return "In review";
  return "Draft";
}

const comparePair = verifiedAssets.slice(0, 2);

const metadataItems = [
  { label: "Last synced", value: "12 min ago" },
  { label: "Verified set", value: `${verifiedAssets.length} assets` },
  { label: "Sync", value: "Canva (demo)" },
  { label: "Ready for", value: "Lab + live" },
];
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <PageHeader title="Evolve" dense metadata-tight hide-context>
      <template #actions>
        <button
          type="button"
          class="app-button button-secondary inline-flex min-h-[3rem] items-center gap-2 px-3 text-sm"
        >
          <Palette class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
          Open in Canva
        </button>
        <button
          type="button"
          class="app-button button-secondary inline-flex min-h-[3rem] items-center gap-2 px-3 text-sm"
        >
          <Download class="h-4 w-4 text-black/55" :stroke-width="1.9" aria-hidden="true" />
          Export set
        </button>
        <NuxtLink
          to="/app/lab"
          class="app-button button-primary inline-flex min-h-[3rem] items-center gap-2 px-3 text-sm text-white"
        >
          <Sparkles class="h-4 w-4 opacity-90" :stroke-width="1.9" aria-hidden="true" />
          Send to Lab
          <ArrowRight class="h-4 w-4 opacity-80" :stroke-width="1.9" aria-hidden="true" />
        </NuxtLink>
      </template>
    </PageHeader>

    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <AnalyticsMetadataStrip :items="metadataItems" />
    </SurfaceCard>

    <section class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <SurfaceCard variant="frame" padding="sm">
        <h2 class="sv-card-title">
          Verified visuals
        </h2>
        <p class="mt-1 max-w-2xl text-[13px] leading-snug text-black/48">
          Approval state and performance-ready cuts for experiments and publishing.
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="asset in verifiedAssets"
            :key="asset.id"
            class="group flex flex-col overflow-hidden rounded-[1.15rem] border border-black/[0.07] bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)] transition hover:border-black/14"
          >
            <div class="relative aspect-[16/10] bg-black/[0.03]">
              <CreativeVariantThumb
                :src="gridSrc(asset.sheet)"
                :sheet="asset.sheet"
                :variant="asset.variant"
                :alt="asset.name"
                frame-class="absolute inset-0 h-full w-full rounded-none border-0"
                crop-class="scale-[1.02]"
              />
              <div class="absolute left-2 top-2">
                <StatusBadge :variant="statusBadge(asset.status)" :label="statusLabel(asset.status)" />
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-2 border-t border-black/[0.06] p-4">
              <p class="line-clamp-2 text-[15px] font-semibold leading-snug text-black">
                {{ asset.name }}
              </p>
              <div class="flex flex-wrap items-center gap-2 text-[12px] text-black/48">
                <span>{{ asset.channel }}</span>
                <span aria-hidden="true">·</span>
                <span>ROAS {{ asset.roas }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ asset.lastCheck }}</span>
              </div>
            </div>
          </article>
        </div>
      </SurfaceCard>

      <div class="space-y-4">
        <SurfaceCard variant="frame" padding="sm">
          <h3 class="sv-card-title">
            Compare
          </h3>
          <p class="mt-1 text-[13px] leading-snug text-black/48">
            Two variants side by side before you promote or send to Lab.
          </p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div
              v-for="asset in comparePair"
              :key="asset.id"
              class="overflow-hidden rounded-xl border border-black/10 bg-black/[0.02]"
            >
              <CreativeVariantThumb
                :src="gridSrc(asset.sheet)"
                :sheet="asset.sheet"
                :variant="asset.variant"
                :alt="asset.name"
                frame-class="aspect-[4/5] w-full"
              />
              <p class="border-t border-black/8 p-2 text-[11px] font-semibold leading-tight text-black/70">
                {{ asset.name }}
              </p>
            </div>
          </div>
          <button type="button" class="app-button button-secondary mt-4 w-full min-h-[2.75rem] text-sm">
            Open comparison
          </button>
        </SurfaceCard>

        <SurfaceCard variant="soft" padding="sm">
          <div class="flex items-start gap-2.5">
            <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600/90" :stroke-width="1.9" aria-hidden="true" />
            <div>
              <p class="sv-section-title">
                Verification
              </p>
              <p class="mt-1 text-[13px] leading-relaxed text-black/48">
                Brand-safe, legible, and platform-ready — handoff from design tools to Lab and live campaigns.
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>
  </div>
</template>
