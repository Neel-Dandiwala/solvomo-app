<script setup lang="ts">
import type { DataTableColumn } from "~/types/app-shell";
import type { LabVersionRow } from "~/types/app-shell";

definePageMeta({ layout: "app" });

useHead({ title: "Lab — Solvomo" });

const flowStep = ref<"awareness" | "consideration" | "conversion">("consideration");
const audience = ref("Modeled high-intent visitors");
const creativeMix = ref("UGC + product demo cuts");

const { labVersions, dataStatus } = useAppData();

const deployOpen = ref(false);
const deployStage = ref<1 | 2 | 3 | 4>(1);
const deployTarget = ref<"meta" | "google" | null>(null);

const versionColumns: DataTableColumn[] = [
  { key: "name", label: "Version" },
  { key: "budget", label: "Budget" },
  { key: "platform", label: "Platform" },
  { key: "expectedRoi", label: "Expected ROI band" },
  { key: "confidence", label: "Confidence" },
  { key: "status", label: "Status" },
];

const versionRows = computed(() => labVersions.value as LabVersionRow[]);
const versionRowsForTable = computed(() => versionRows.value as unknown as Record<string, unknown>[]);

function statusVariant(s: LabVersionRow["status"]): "neutral" | "info" | "success" {
  if (s === "deployed") return "success";
  if (s === "ready") return "info";
  return "neutral";
}

function statusLabel(s: LabVersionRow["status"]) {
  if (s === "deployed") return "Deployed";
  if (s === "ready") return "Ready";
  return "Draft";
}

function slotStatus(value: unknown): LabVersionRow["status"] {
  return (value as LabVersionRow["status"]) ?? "draft";
}

function openDeploy() {
  deployOpen.value = true;
  deployStage.value = 1;
  deployTarget.value = null;
}

function nextDeployStage() {
  if (deployStage.value === 2 && !deployTarget.value) return;
  if (deployStage.value < 4) deployStage.value = (deployStage.value + 1) as 1 | 2 | 3 | 4;
  else deployOpen.value = false;
}
</script>

<template>
  <div>
    <MockDataState :status="dataStatus" />

    <PageHeader title="Lab" description="Simulation workspace for Versions — draft, compare, and stage deploy to production integrations.">
      <template #actions>
        <button type="button" class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold">
          Save Version
        </button>
        <button type="button" class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold">
          Compare
        </button>
        <button type="button" class="button-primary rounded-xl px-4 py-2 text-sm font-semibold text-white" @click="openDeploy">
          Preview Deploy
        </button>
      </template>
    </PageHeader>

    <div class="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
      <SurfaceCard variant="soft" class="h-fit xl:sticky xl:top-4" padding="sm">
        <h2 class="text-xs font-bold uppercase tracking-wide text-black/45">
          Controls
        </h2>
        <label class="mt-4 block text-xs font-semibold text-black/50">Campaign flow</label>
        <select v-model="flowStep" class="auth-input mt-2 py-2 text-sm">
          <option value="awareness">
            Awareness
          </option>
          <option value="consideration">
            Consideration
          </option>
          <option value="conversion">
            Conversion
          </option>
        </select>
        <label class="mt-4 block text-xs font-semibold text-black/50">Audience cell</label>
        <input v-model="audience" class="auth-input mt-2 py-2 text-sm" type="text">
        <label class="mt-4 block text-xs font-semibold text-black/50">Creative mix</label>
        <textarea v-model="creativeMix" class="auth-input mt-2 min-h-[5rem] resize-y text-sm" />
        <p class="mt-4 text-xs text-black/45">
          Lab changes are scoped to the selected brand profile and environment.
        </p>
      </SurfaceCard>

      <SurfaceCard variant="frame" padding="lg">
        <h2 class="text-base font-semibold">
          Flow canvas
        </h2>
        <p class="mt-1 text-sm text-black/50">
          Campaign stages chain to modeled outcomes. Connectors unlock quantitative links; structure is always visible.
        </p>
        <div class="mt-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <div class="surface-product flex flex-1 flex-col rounded-2xl p-4 text-center">
            <span class="text-xs font-bold uppercase tracking-wide text-black/45">Spend</span>
            <span class="mt-2 text-sm font-semibold">Delivery layer</span>
          </div>
          <span class="hidden text-black/30 md:block" aria-hidden="true">→</span>
          <div class="surface-depth flex flex-1 flex-col rounded-2xl p-4 text-center">
            <span class="text-xs font-bold uppercase tracking-wide text-black/45">Creative + audience</span>
            <span class="mt-2 text-sm font-semibold">{{ creativeMix }}</span>
          </div>
          <span class="hidden text-black/30 md:block" aria-hidden="true">→</span>
          <div class="surface-brand flex flex-1 flex-col rounded-2xl p-4 text-center">
            <span class="text-xs font-bold uppercase tracking-wide text-black/45">Outcome</span>
            <span class="mt-2 text-sm font-semibold">{{ flowStep }} intent</span>
          </div>
        </div>
        <EmptyState
          class="mt-8"
          title="Canvas metrics are dormant"
          description="Expected lift and guardrails render when historical delivery and outcomes exist for this profile."
        />
      </SurfaceCard>

      <SurfaceCard variant="product" class="h-fit xl:sticky xl:top-4" padding="sm">
        <h2 class="text-xs font-bold uppercase tracking-wide text-black/45">
          Metrics preview
        </h2>
        <dl class="mt-4 space-y-4 text-sm">
          <div>
            <dt class="text-black/45">
              Expected CTR band
            </dt>
            <dd class="mt-1 font-semibold text-black">
              —
            </dd>
          </div>
          <div>
            <dt class="text-black/45">
              Expected ROI band
            </dt>
            <dd class="mt-1 font-semibold text-black">
              —
            </dd>
          </div>
          <div>
            <dt class="text-black/45">
              Confidence
            </dt>
            <dd class="mt-1 font-semibold text-black">
              Insufficient history
            </dd>
          </div>
        </dl>
      </SurfaceCard>
    </div>

    <section class="mt-10">
      <h2 class="text-lg font-semibold">
        Versions
      </h2>
      <p class="mt-1 text-sm text-black/50">
        Each row is an immutable snapshot you can promote through staging.
      </p>
      <DataTable class="mt-4" :columns="versionColumns" :rows="versionRowsForTable" row-key="id">
        <template #cell-status="{ value }">
          <StatusBadge :variant="statusVariant(slotStatus(value))" :label="statusLabel(slotStatus(value))" />
        </template>
      </DataTable>
    </section>

    <Teleport to="body">
      <div
        v-if="deployOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deploy-title"
        @click.self="deployOpen = false"
      >
        <SurfaceCard variant="frame" class="max-h-[90vh] w-full max-w-lg overflow-y-auto" padding="lg" @click.stop>
          <h2 id="deploy-title" class="text-lg font-semibold">
            Deploy Version
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Controlled publish to a live integration. Playground stays isolated until you confirm.
          </p>
          <ol class="mt-6 space-y-4 text-sm">
            <li v-show="deployStage >= 1" class="flex gap-3" :class="deployStage >= 1 ? 'text-black' : 'text-black/35'">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-bold">1</span>
              <div>
                <p class="font-semibold">
                  Select Version
                </p>
                <p class="text-black/50">
                  Active draft is locked for this flow. Brand profile and environment are fixed for the promotion.
                </p>
              </div>
            </li>
            <li v-show="deployStage >= 2" class="flex gap-3 flex-col" :class="deployStage >= 2 ? 'text-black' : 'text-black/35'">
              <div class="flex gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-bold">2</span>
                <div>
                  <p class="font-semibold">
                    Target integration
                  </p>
                  <p class="text-black/50">
                    Choose where this Version should land in production.
                  </p>
                </div>
              </div>
              <div v-if="deployStage === 2" class="ml-10 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-xl border px-4 py-2 text-sm font-semibold transition"
                  :class="deployTarget === 'meta' ? 'border-black bg-black text-white' : 'border-black/12 text-black/65'"
                  @click="deployTarget = 'meta'"
                >
                  Meta Ads
                </button>
                <button
                  type="button"
                  class="rounded-xl border px-4 py-2 text-sm font-semibold transition"
                  :class="deployTarget === 'google' ? 'border-black bg-black text-white' : 'border-black/12 text-black/65'"
                  @click="deployTarget = 'google'"
                >
                  Google Ads
                </button>
              </div>
            </li>
            <li v-show="deployStage >= 3" class="flex gap-3" :class="deployStage >= 3 ? 'text-black' : 'text-black/35'">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-bold">3</span>
              <div>
                <p class="font-semibold">
                  Preview changes
                </p>
                <p class="text-black/50">
                  Review cards summarize budget, creative mix, and audience cells before anything is sent downstream.
                </p>
                <div v-if="deployStage === 3" class="mt-3 space-y-2 rounded-xl border border-black/8 bg-black/[0.02] p-3 text-xs text-black/55">
                  <p><span class="font-semibold text-black">Integration:</span> {{ deployTarget === 'meta' ? 'Meta Ads' : deployTarget === 'google' ? 'Google Ads' : '—' }}</p>
                  <p><span class="font-semibold text-black">Scope:</span> Production · current brand profile</p>
                </div>
              </div>
            </li>
            <li v-show="deployStage >= 4" class="flex gap-3" :class="deployStage >= 4 ? 'text-black' : 'text-black/35'">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-bold">4</span>
              <div>
                <p class="font-semibold">
                  Confirm publish
                </p>
                <p class="text-black/50">
                  Acknowledge that this action is irreversible for the selected integration slice (UI preview — no API calls).
                </p>
              </div>
            </li>
          </ol>
          <div class="mt-8 flex flex-wrap justify-end gap-2 border-t border-black/8 pt-6">
            <button type="button" class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold" @click="deployOpen = false">
              Cancel
            </button>
            <button
              type="button"
              class="button-primary rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
              :disabled="deployStage === 2 && !deployTarget"
              @click="nextDeployStage"
            >
              {{ deployStage < 4 ? "Continue" : "Confirm (demo)" }}
            </button>
          </div>
        </SurfaceCard>
      </div>
    </Teleport>
  </div>
</template>
