<script setup lang="ts">
definePageMeta({ layout: "onboarding" });

useHead({ title: "Onboarding — Brand profile | Solvomo" });

const auth = useAuth();
const { currentWorkspace, currentBrand, brandsForWorkspace, brands } = useWorkspaceContext();
const { draft, restoreDraft } = useOnboardingDraft();

restoreDraft();

watchEffect(() => {
  if (!draft.value.brandName && currentBrand.value?.name) draft.value.brandName = currentBrand.value.name;
  if (!draft.value.currency && currentBrand.value?.currency) draft.value.currency = currentBrand.value.currency;
  if (!draft.value.attribution && currentBrand.value?.attributionPreference) {
    draft.value.attribution = currentBrand.value.attributionPreference;
  }
});

async function goToConnections() {
  const brandId = currentBrand.value?.id;
  if (brandId) {
    const idx = brands.value.findIndex((brand: (typeof brands.value)[number]) => brand.id === brandId);
    if (idx !== -1) {
      brands.value[idx] = {
        ...brands.value[idx]!,
        name: draft.value.brandName || brands.value[idx]!.name,
        currency: draft.value.currency || brands.value[idx]!.currency,
        attributionPreference: draft.value.attribution || brands.value[idx]!.attributionPreference,
      };
    }
  }
  auth.completeOnboardingStep("brand");
  await navigateTo("/onboarding/connections");
}
</script>

<template>
  <div>
    <OnboardingHero
      eyebrow="Brand setup"
      title="Scope your brand profile inside the workspace"
      :description="`Workspace (${currentWorkspace?.name}) holds members, billing, and API access. Brand profiles remain independently scoped so campaigns, creatives, and insights never mix across brands.`"
    >
      <template #aside>
        <p class="text-xs font-bold uppercase tracking-wide text-black/45">
          This step defines
        </p>
        <ul class="mt-3 space-y-2 text-sm text-black/60">
          <li>Brand naming across selectors and pages</li>
          <li>Reporting currency for this profile only</li>
          <li>Attribution assumptions for modeled views</li>
        </ul>
      </template>
    </OnboardingHero>

    <SurfaceCard variant="product" class="mt-8" padding="lg">
      <div class="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 class="text-base font-semibold">Workspace context</h2>
          <p class="mt-2 text-sm text-black/50">
            You’re configuring defaults for this workspace only. Invite teammates from Settings after onboarding.
          </p>
          <ul class="mt-4 space-y-2 text-sm text-black/65">
            <li class="flex gap-2">
              <span class="text-[var(--sv-product-end)]">●</span>
              Workspace: <span class="font-semibold text-black">{{ currentWorkspace?.name }}</span>
            </li>
            <li class="flex gap-2">
              <span class="text-[var(--sv-product-end)]">●</span>
              Brand profiles in this workspace: {{ brandsForWorkspace.length }}
            </li>
          </ul>
        </div>
        <div class="surface-soft rounded-2xl p-5">
          <h2 class="text-base font-semibold">Brand profile defaults</h2>
          <p class="mt-2 text-sm text-black/50">
            These labels appear in selectors and empty states across the product.
          </p>
          <label class="mt-5 block text-xs font-bold uppercase tracking-wide text-black/45">Display name</label>
          <input v-model="draft.brandName" class="auth-input mt-2" type="text" autocomplete="organization" />
          <label class="mt-4 block text-xs font-bold uppercase tracking-wide text-black/45">Reporting currency</label>
          <select v-model="draft.currency" class="auth-input mt-2">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <label class="mt-4 block text-xs font-bold uppercase tracking-wide text-black/45">Attribution preference</label>
          <select v-model="draft.attribution" class="auth-input mt-2">
            <option disabled value="">
              Select a model
            </option>
            <option value="Multi-touch, last non-direct">
              Multi-touch, last non-direct
            </option>
            <option value="First touch">
              First touch
            </option>
            <option value="Last click">
              Last click
            </option>
          </select>
        </div>
      </div>
      <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-6">
        <NuxtLink to="/onboarding/survey" class="nav-link inline-flex text-sm font-semibold">
          Back to survey
        </NuxtLink>
        <button
          type="button"
          class="button-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          @click="goToConnections"
        >
          Continue to connections
        </button>
      </div>
    </SurfaceCard>
  </div>
</template>
