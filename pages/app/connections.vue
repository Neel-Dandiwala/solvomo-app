<script setup lang="ts">
import { Search } from "lucide-vue-next";
import IntegrationLogo from "~/components/app/connections/IntegrationLogo.vue";
import type { ConnectionStatus } from "~/types/app-shell";
import type { MockConnection } from "~/types/mock";
import { integrationCategories, integrationsCatalog } from "~/data/integrationsCatalog";
import { demoConnectionsFallback } from "~/data/connectionsFallback";

definePageMeta({ layout: "app" });

useHead({ title: "Connections — Solvomo" });

const { connectionsShell } = useAppData();

const shellRows = computed(() => {
  const source = connectionsShell.value.length ? connectionsShell.value : demoConnectionsFallback;
  return source.map((c: MockConnection) => ({
    id: c.id,
    name: c.name,
    detail: c.description,
    status: c.status,
  }));
});

const connectedCount = computed(() => shellRows.value.filter((c) => c.status === "connected").length);
const pendingCount = computed(() => shellRows.value.filter((c) => c.status === "connecting").length);
const attentionCount = computed(() => shellRows.value.filter((c) => c.status === "needs_attention").length);

const search = ref("");
const categoryFilter = ref<"all" | (typeof integrationCategories)[number]["id"]>("all");

function shellStatusFor(shellKey?: string): ConnectionStatus | null {
  if (!shellKey) return null;
  const row = shellRows.value.find((r) => r.id === shellKey);
  return row?.status ?? null;
}

function resolveIntegration(entry: (typeof integrationsCatalog)[number]): ConnectionStatus | "coming_soon" {
  if (entry.comingSoon) return "coming_soon";
  const s = shellStatusFor(entry.shellKey);
  if (!s) return "not_connected";
  return s;
}

const enriched = computed(() =>
  integrationsCatalog.map((entry) => ({
    ...entry,
    resolved: resolveIntegration(entry),
  })),
);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return enriched.value.filter((item) => {
    if (categoryFilter.value !== "all" && item.category !== categoryFilter.value) return false;
    if (!q) return true;
    const blob = `${item.name} ${item.description}`.toLowerCase();
    return blob.includes(q);
  });
});

const byCategory = computed(() => {
  const map = new Map<(typeof integrationCategories)[number]["id"], typeof enriched.value>();
  for (const cat of integrationCategories) {
    map.set(cat.id, []);
  }
  for (const item of filtered.value) {
    map.get(item.category)?.push(item);
  }
  return integrationCategories.map((cat) => ({
    ...cat,
    items: map.get(cat.id) ?? [],
  }));
});

type ResolvedState = ConnectionStatus | "coming_soon";

function actionLabel(resolved: ResolvedState) {
  if (resolved === "connected") return "Manage";
  if (resolved === "connecting") return "Syncing";
  if (resolved === "coming_soon") return "Coming Soon";
  if (resolved === "needs_attention") return "Resolve";
  return "Connect";
}

function actionDisabled(resolved: ResolvedState) {
  return resolved === "connecting" || resolved === "coming_soon";
}

function statusBadge(resolved: ResolvedState): { variant: "success" | "pending" | "warning" | "neutral" | "info"; label: string } {
  if (resolved === "connected") return { variant: "success", label: "Connected" };
  if (resolved === "connecting") return { variant: "pending", label: "Connecting" };
  if (resolved === "coming_soon") return { variant: "neutral", label: "Coming Soon" };
  if (resolved === "needs_attention") return { variant: "warning", label: "Needs Attention" };
  return { variant: "neutral", label: "Not Connected" };
}
</script>

<template>
  <div class="max-w-full space-y-5 overflow-x-hidden pb-2">
    <PageHeader title="Connections" dense metadata-tight hide-context>
      <template #actions>
        <button type="button" class="app-button button-secondary min-h-[3rem] px-3 text-sm">
          Request Integration
        </button>
      </template>
    </PageHeader>

    <SurfaceCard variant="soft" padding="sm" class="border border-black/[0.05]">
      <AnalyticsMetadataStrip
        :items="[
          { label: 'Connected', value: String(connectedCount) },
          { label: 'Syncing', value: String(pendingCount) },
          { label: 'Needs Attention', value: String(attentionCount) },
          { label: 'Directory', value: `${integrationsCatalog.length} integrations` },
        ]"
      />
    </SurfaceCard>

    <FilterBar compact>
      <div class="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-md">
        <label for="conn-search" class="sv-section-title">Search</label>
        <div class="relative">
          <Search
            class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
            :stroke-width="1.9"
            aria-hidden="true"
          />
          <input
            id="conn-search"
            v-model="search"
            type="search"
            placeholder="Search integrations…"
            class="app-control min-h-[2.75rem] w-full pl-10"
            autocomplete="off"
          >
        </div>
      </div>
      <div class="flex min-w-0 flex-col gap-1.5">
        <span class="sv-section-title">Category</span>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex min-h-[2.75rem] items-center rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="categoryFilter === 'all' ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/60'"
            @click="categoryFilter = 'all'"
          >
            All
          </button>
          <button
            v-for="cat in integrationCategories"
            :key="cat.id"
            type="button"
            class="inline-flex min-h-[2.75rem] items-center rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="categoryFilter === cat.id ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/60'"
            @click="categoryFilter = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </FilterBar>

    <div class="space-y-10">
      <section v-for="block in byCategory" :key="block.id">
        <div v-if="block.items.length" class="space-y-4">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="sv-card-title">
                {{ block.label }}
              </h2>
              <p class="mt-1 text-[13px] text-black/48">
                {{ block.hint }}
              </p>
            </div>
            <p class="text-[12px] font-medium tabular-nums text-black/38">
              {{ block.items.length }} shown
            </p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <SurfaceCard
              v-for="item in block.items"
              :key="item.id"
              variant="frame"
              padding="none"
              class="flex h-full flex-col overflow-hidden"
            >
              <div class="flex flex-1 flex-col p-5 sm:p-6">
                <div class="flex gap-3.5">
                  <IntegrationLogo class="shrink-0" :name="item.name" />
                  <div class="min-w-0 flex-1 pt-0.5">
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                      <h3 class="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-black">
                        {{ item.name }}
                      </h3>
                      <StatusBadge :variant="statusBadge(item.resolved).variant" :label="statusBadge(item.resolved).label" />
                    </div>
                    <p class="mt-2.5 text-[13px] leading-relaxed text-black/52">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="flex border-t border-black/[0.06] bg-black/[0.015] px-5 py-3.5 sm:px-6 sm:py-4"
              >
                <button
                  type="button"
                  class="app-button min-h-[2.75rem] w-full px-4 text-sm sm:w-auto"
                  :class="
                    item.resolved === 'not_connected'
                      ? 'button-primary text-white'
                      : item.resolved === 'needs_attention'
                        ? 'border border-amber-200 bg-amber-50 font-semibold text-amber-950'
                        : 'button-secondary'
                  "
                  :disabled="actionDisabled(item.resolved)"
                >
                  {{ actionLabel(item.resolved) }}
                </button>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>
    </div>

    <SurfaceCard v-if="!filtered.length" variant="soft" padding="md" class="border border-dashed border-black/12">
      <p class="text-[14px] font-semibold text-black">
        No Integrations Match
      </p>
      <p class="mt-1 text-[13px] text-black/52">
        Try another search or category.
      </p>
    </SurfaceCard>
  </div>
</template>
