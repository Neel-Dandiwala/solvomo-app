<script setup lang="ts">
import { DEMO_PASSWORD_HINT } from "~/data/mock-solvomo";

useHead({ title: "Solvomo — Create account" });

const auth = useAuth();

const name = ref("");
const email = ref("riya@solvomo.co");
const password = ref("riya");
const passwordConfirm = ref("riya");
const error = ref("");

function useDemoUser(user: "neel" | "riya") {
  email.value = user === "neel" ? "neel@solvomo.co" : "riya@solvomo.co";
  error.value = "";
}

async function onSubmit() {
  error.value = "";
  if (password.value !== passwordConfirm.value) {
    error.value = "Try again.";
    return;
  }
  const result = auth.signup({
    email: email.value,
    password: password.value,
    name: name.value.trim(),
  });
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  await navigateTo("/onboarding/survey");
}
</script>

<template>
  <AuthShell alternate-href="/login" alternate-label="Sign in">
    <template #aside>
      <div class="eyebrow rounded-full">
        <span class="eyebrow-dot" />
        New workspace
      </div>
      <h1
        class="mt-8 max-w-[min(100%,38rem)] text-[clamp(2.75rem,5.2vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-black sm:text-[clamp(3.25rem,5.5vw,5.75rem)]"
      >
        Let’s set up
        <span class="headline-product block">your workspace.</span>
      </h1>
      <p class="mt-8 max-w-2xl text-[1.125rem] leading-relaxed text-black/60 sm:text-[1.35rem]">
        We’ll walk you through goals, brand scope, and data sources — then drop you into the command center.
      </p>
      <p class="mt-4 max-w-2xl text-sm text-black/45">
        {{ DEMO_PASSWORD_HINT }} You’ll use the guided onboarding path after this step.
      </p>
      <div class="section-divider-brand mt-12" />
      <div class="mt-10 space-y-5">
        <div class="surface-product rounded-[18px] p-6">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">
            What you get
          </p>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-black/58">
            <li>Workspace-level members, keys, and billing (shared).</li>
            <li>Brand profiles that never mix campaigns or insights.</li>
            <li>A calm surface built for real budget accountability.</li>
          </ul>
        </div>
      </div>
    </template>

    <AuthFormCard
      title="Create account"
      description="Start in preview mode — your answers configure the product shell only."
    >
      <form class="space-y-5" @submit.prevent="onSubmit">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="button-secondary rounded-xl px-3 py-2 text-sm font-semibold"
            @click="useDemoUser('neel')"
          >
            Use Neel demo
          </button>
          <button
            type="button"
            class="button-secondary rounded-xl px-3 py-2 text-sm font-semibold"
            @click="useDemoUser('riya')"
          >
            Use Riya demo
          </button>
        </div>
        <p v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {{ error }}
        </p>
        <div>
          <label
            for="signup-name"
            class="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
          >
            Full name (optional)
          </label>
          <input
            id="signup-name"
            v-model="name"
            type="text"
            name="name"
            autocomplete="name"
            class="auth-input"
            placeholder="Riya Aggarwal"
          >
        </div>
        <div>
          <label
            for="signup-email"
            class="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
          >
            Work email
          </label>
          <input
            id="signup-email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            class="auth-input"
            placeholder="riya@solvomo.co"
          >
        </div>
        <div>
          <label
            for="signup-password"
            class="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
          >
            Password
          </label>
          <input
            id="signup-password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="new-password"
            class="auth-input"
            placeholder="••••••"
          >
        </div>
        <div>
          <label
            for="signup-password-confirm"
            class="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
          >
            Confirm password
          </label>
          <input
            id="signup-password-confirm"
            v-model="passwordConfirm"
            type="password"
            name="passwordConfirm"
            autocomplete="new-password"
            class="auth-input"
            placeholder="Repeat password"
          >
        </div>
        <label class="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="terms"
            required
            class="mt-0.5 h-4 w-4 shrink-0 rounded border-black/15 focus:ring-[rgba(91,123,225,0.35)]"
          >
          <span class="text-[15px] leading-relaxed text-black/56">
            I agree to the Terms and Privacy policy (preview).
          </span>
        </label>
        <button
          type="submit"
          class="button-primary inline-flex w-full items-center justify-center rounded-[14px] px-5 py-4 text-base font-semibold transition-all duration-200"
        >
          <span class="relative z-10 text-white">Continue to onboarding</span>
        </button>
        <NuxtLink
          to="/login"
          class="button-secondary relative isolate inline-flex w-full items-center justify-center rounded-[14px] px-5 py-4 text-base font-semibold transition-colors duration-200"
        >
          <span class="relative z-10 text-black">Already have an account? Sign in</span>
        </NuxtLink>
      </form>
    </AuthFormCard>
  </AuthShell>
</template>
