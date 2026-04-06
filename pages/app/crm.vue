<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "CRM / Outcomes — Solvomo" });

const { crm } = useAppData();

const columns: DataTableColumn[] = [
  { key: "lead_source", label: "Lead source" },
  { key: "deals", label: "Deals" },
  { key: "revenue", label: "Revenue" },
  { key: "attribution", label: "Attribution" },
];

const rows = crm;
</script>

<template>
  <div>
    <PageHeader
      title="CRM / Outcomes"
      description="Close the loop between ad platforms and revenue for this brand profile. Definitions respect your attribution preference."
    />
    <FilterBar hint="Deals and revenue populate when CRM or order data syncs.">
      <button type="button" class="rounded-full border border-black/12 px-3 py-1.5 text-xs font-semibold text-black/65">
        All sources
      </button>
    </FilterBar>
    <DataTable :columns="columns" :rows="rows" row-key="id" />
  </div>
</template>
