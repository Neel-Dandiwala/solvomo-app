<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Creatives — Solvomo" });

const { creatives } = useAppData();

const columns: DataTableColumn[] = [
  { key: "name", label: "Creative" },
  { key: "platform", label: "Platform" },
  { key: "hook", label: "Hook" },
  { key: "ctr", label: "CTR" },
  { key: "conversion", label: "Conversion" },
  { key: "roi", label: "ROI" },
];

const rows = creatives;
</script>

<template>
  <div>
    <PageHeader
      title="Creatives"
      description="Hook-level view for this brand profile. CTR, conversion, and ROI populate from modeled delivery — not placeholder math."
    />

    <FilterBar>
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        All platforms
      </button>
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        All hooks
      </button>
    </FilterBar>

    <DataTable :columns="columns" :rows="rows" row-key="id" />

    <div class="mt-8 grid gap-4 lg:grid-cols-2">
      <SurfaceCard variant="product">
        <h2 class="text-base font-semibold">
          Winning patterns
        </h2>
        <EmptyState
          class="mt-4 border-0 bg-transparent p-0"
          title="No patterns yet"
          description="Recurring winning motifs appear when delivery and outcomes are dense enough to cluster safely for this brand profile."
        />
      </SurfaceCard>
      <SurfaceCard variant="depth">
        <h2 class="text-base font-semibold">
          Losing patterns
        </h2>
        <EmptyState
          class="mt-4 border-0 bg-transparent p-0"
          title="No loss clusters yet"
          description="Underperforming creative themes surface only with sufficient spend and modeled results."
        />
      </SurfaceCard>
    </div>
  </div>
</template>
