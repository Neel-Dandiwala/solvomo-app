<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Spend — Solvomo" });

const { spend } = useAppData();

const columns: DataTableColumn[] = [
  { key: "channel", label: "Channel" },
  { key: "spend", label: "Spend" },
  { key: "revenue", label: "Revenue" },
  { key: "cac", label: "CAC" },
  { key: "roi", label: "ROI" },
];

const rows = spend;
</script>

<template>
  <div>
    <PageHeader
      title="Spend / Finance"
      description="Channel-level economics for this brand profile. Revenue, CAC, and ROI unlock when finance and outcome connectors are live."
    />
    <FilterBar>
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        This month
      </button>
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        All channels
      </button>
    </FilterBar>
    <DataTable :columns="columns" :rows="rows" row-key="id" />
  </div>
</template>
