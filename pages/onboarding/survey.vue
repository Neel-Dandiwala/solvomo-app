<script setup lang="ts">
definePageMeta({ layout: "onboarding" });

useHead({ title: "Onboarding — Survey | Solvomo" });

const auth = useAuth();
const { draft, restoreDraft } = useOnboardingDraft();

restoreDraft();

/** North-star metric: Revenue | Leads | CAC */
const goalOptions = [
  { id: "revenue", label: "Revenue", hint: "Efficient growth, MER / ROAS guardrails" },
  { id: "leads", label: "Leads", hint: "Pipeline quality and volume" },
  { id: "cac", label: "CAC", hint: "Acquisition cost discipline" },
];

const budgetOptions = [
  { id: "under25", label: "Under $25k / mo" },
  { id: "25to100", label: "$25k–$100k / mo" },
  { id: "100to500", label: "$100k–$500k / mo" },
  { id: "500plus", label: "$500k+ / mo" },
];

const platformOptions = ["Meta Ads", "Google Ads", "LinkedIn", "TikTok", "Other"];

const businessOptions = [
  { id: "dtc", label: "DTC", hint: "Consumer brand, owned site + paid" },
  { id: "b2b", label: "B2B", hint: "Pipeline, ABM, longer cycles" },
  { id: "agency", label: "Agency", hint: "Multi-client, scoped workspaces" },
];

const completionCount = computed(() => {
  let total = 0;
  if (draft.value.primaryGoal) total += 1;
  if (draft.value.budgetBand) total += 1;
  if (draft.value.platforms.length) total += 1;
  if (draft.value.businessType) total += 1;
  return total;
});

function togglePlatform(name: string) {
  if (draft.value.platforms.includes(name)) draft.value.platforms = draft.value.platforms.filter((p: string) => p !== name);
  else draft.value.platforms.push(name);
}

async function finishSurvey() {
  auth.completeOnboardingStep("survey");
  await navigateTo("/onboarding/brand-setup");
}
</script>

<template>
  <div>
    <OnboardingHero
      eyebrow="About your goals"
      title="Calibrate your decision stack"
      description="Your answers configure the command center, alert posture, and default planning language. Nothing is scored yet."
    >
      <template #aside>
        <p class="text-xs font-bold uppercase tracking-wide text-black/45">
          Setup progress
        </p>
        <p class="mt-3 text-2xl font-semibold tracking-tight text-black">
          {{ completionCount }}/4
        </p>
        <p class="mt-2 text-sm text-black/55">
          Complete the survey before we create brand-level scope.
        </p>
        <div class="mt-4 h-2 rounded-full bg-black/[0.06]">
          <div class="h-full rounded-full bg-black transition-all" :style="{ width: `${(completionCount / 4) * 100}%` }" />
        </div>
      </template>
    </OnboardingHero>

    <div class="space-y-6">
      <SurfaceCard variant="product">
        <h2 class="text-lg font-semibold">
          What is the primary goal for media decisions?
        </h2>
        <p class="mt-1 text-sm text-black/50">
          Pick one north star. You can layer secondary goals later per brand profile.
        </p>
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            v-for="opt in goalOptions"
            :key="opt.id"
            type="button"
            class="rounded-2xl border px-4 py-4 text-left transition"
            :class="
              draft.primaryGoal === opt.id
                ? 'border-[var(--sv-product-end)] bg-[rgba(91,123,225,0.06)] shadow-[inset_0_0_0_1px_rgba(91,123,225,0.2)]'
                : 'border-black/10 hover:border-black/16 hover:bg-black/[0.02]'
            "
            @click="draft.primaryGoal = opt.id"
          >
            <span class="font-semibold">{{ opt.label }}</span>
            <span class="mt-1 block text-xs text-black/45">{{ opt.hint }}</span>
          </button>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="depth">
        <h2 class="text-lg font-semibold">
          Monthly media budget band
        </h2>
        <p class="mt-1 text-sm text-black/50">
          Used for pacing context and alert defaults. This setup stays inside your workspace.
        </p>
        <div class="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            v-for="b in budgetOptions"
            :key="b.id"
            type="button"
            class="rounded-xl border px-4 py-3 text-left text-sm font-semibold transition"
            :class="
              draft.budgetBand === b.id
                ? 'border-[var(--sv-depth-end)] bg-[rgba(90,79,207,0.06)]'
                : 'border-black/10 hover:bg-black/[0.02]'
            "
            @click="draft.budgetBand = b.id"
          >
            {{ b.label }}
          </button>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="frame">
        <h2 class="text-lg font-semibold">
          Platforms in active use
        </h2>
        <p class="mt-1 text-sm text-black/50">
          We’ll prioritize connection setup and reporting views for what you select here.
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <button
            v-for="c in platformOptions"
            :key="c"
            type="button"
            class="rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="
              draft.platforms.includes(c)
                ? 'border-black bg-black text-white'
                : 'border-black/12 text-black/65 hover:border-black/20'
            "
            @click="togglePlatform(c)"
          >
            {{ c }}
          </button>
        </div>
      </SurfaceCard>

      <SurfaceCard variant="product">
        <h2 class="text-lg font-semibold">
          How do you go to market?
        </h2>
        <p class="mt-1 text-sm text-black/50">
          DTC, B2B, and Agency teams use different defaults for funnels, signal review, and governance.
        </p>
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            v-for="opt in businessOptions"
            :key="opt.id"
            type="button"
            class="rounded-2xl border px-4 py-4 text-left transition"
            :class="
              draft.businessType === opt.id
                ? 'border-[var(--sv-product-end)] bg-[rgba(91,123,225,0.06)] shadow-[inset_0_0_0_1px_rgba(91,123,225,0.2)]'
                : 'border-black/10 hover:border-black/16 hover:bg-black/[0.02]'
            "
            @click="draft.businessType = opt.id"
          >
            <span class="font-semibold">{{ opt.label }}</span>
            <span class="mt-1 block text-xs text-black/45">{{ opt.hint }}</span>
          </button>
        </div>

        <div class="surface-soft mt-8 rounded-2xl p-5">
          <p class="text-xs font-bold uppercase tracking-wide text-black/45">
            What happens next
          </p>
          <p class="mt-2 text-sm leading-relaxed text-black/60">
            Your overview will emphasize the KPIs that match
            <span class="font-semibold text-black">{{ draft.primaryGoal ?? "your goal" }}</span>,
            with connectors and Lab tuned to
            <span class="font-semibold text-black">{{ draft.businessType ?? "your model" }}</span>.
            Next you’ll define brand-level scope inside the shared workspace shell.
          </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-black/8 pt-6">
          <button
            type="button"
            class="button-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            @click="finishSurvey"
          >
            Continue to brand profile
          </button>
        </div>
      </SurfaceCard>
    </div>
  </div>
</template>
