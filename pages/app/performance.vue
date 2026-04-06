<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Performance — Solvomo" });

const { dataStatus, performanceRows } = useAppData();

const view = ref<"campaigns" | "ad_groups" | "ads">("campaigns");

const rows = computed(() => performanceRows(view.value));

const columns = computed<DataTableColumn[]>(() => {
  const first =
    view.value === "campaigns"
      ? { key: "name", label: "Campaign" }
      : view.value === "ad_groups"
        ? { key: "name", label: "Ad group" }
        : { key: "name", label: "Ad" };
  return [
    first,
    { key: "platform", label: "Platform" },
    { key: "spend", label: "Spend" },
    { key: "revenue", label: "Revenue" },
    { key: "roi", label: "ROI" },
    { key: "status", label: "Status" },
  ];
});

</script>

<template>
  <div>
    <MockDataState :status="dataStatus" />

    <PageHeader
      title="Performance"
      description="Merged view across campaigns, ads, and groups for this brand profile. Metrics appear when connectors sync — no fabricated numbers."
    />

    <FilterBar hint="Date range and breakdowns ship with your data connection.">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-semibold transition"
          :class="view === 'campaigns' ? 'border-black bg-black text-white' : 'border-black/12 bg-white text-black/68'"
          @click="view = 'campaigns'"
        >
          Campaigns
        </button>
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-semibold transition"
          :class="view === 'ad_groups' ? 'border-black bg-black text-white' : 'border-black/12 bg-white text-black/68'"
          @click="view = 'ad_groups'"
        >
          Ad groups
        </button>
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-semibold transition"
          :class="view === 'ads' ? 'border-black bg-black text-white' : 'border-black/12 bg-white text-black/68'"
          @click="view = 'ads'"
        >
          Ads
        </button>
      </div>
      <input
        type="search"
        placeholder="Search…"
        class="auth-input max-w-xs py-3 text-sm"
      >
    </FilterBar>

    <DataTable :columns="columns" :rows="rows" row-key="id" empty-label="No rows synced for this view yet." />
  </div>
</template>
