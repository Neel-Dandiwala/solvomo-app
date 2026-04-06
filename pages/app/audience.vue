<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Audience — Solvomo" });

const { audience } = useAppData();

const columns: DataTableColumn[] = [
  { key: "audience", label: "Audience" },
  { key: "platform", label: "Platform" },
  { key: "spend", label: "Spend" },
  { key: "roi", label: "ROI" },
  { key: "performance", label: "Performance" },
];

const rows = audience;
</script>

<template>
  <div>
    <PageHeader
      title="Audience"
      description="Targeting cells for this brand profile only. Cross-brand blending is not supported."
    />
    <FilterBar hint="Spend and ROI require connected delivery and outcomes.">
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        All platforms
      </button>
    </FilterBar>
    <DataTable :columns="columns" :rows="rows" row-key="id" />
  </div>
</template>
