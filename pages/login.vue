<script setup lang="ts">
import { DEMO_PASSWORD_HINT } from "~/data/mock-solvomo";

useHead({ title: "Solvomo — Sign in" });

const route = useRoute();
const auth = useAuth();

const email = ref("neel@solvomo.co");
const password = ref("demo");
const error = ref("");

function useDemoUser(user: "neel" | "riya") {
  email.value = user === "neel" ? "neel@solvomo.co" : "riya@solvomo.co";
  password.value = "demo";
  error.value = "";
}

async function onSubmit() {
  error.value = "";
  if (!email.value.trim()) {
    error.value = "Enter your work email.";
    return;
  }
  if (!password.value.trim()) {
    error.value = "Enter any password for this preview.";
    return;
  }
  const result = auth.login(email.value, password.value);
  if (!result.ok) {
    error.value = result.message;
    return;
  }
  const target = auth.isOnboardingComplete.value
    ? ((route.query.redirect as string) || "/app")
    : auth.nextOnboardingPath();
  await navigateTo(target);
}
</script>

<template>
  <AuthShell alternate-href="/signup" alternate-label="Create account">
    <template #aside>
      <div class="eyebrow rounded-full">
        <span class="eyebrow-dot" />
        Decision workspace
      </div>
      <h1
        class="mt-8 max-w-[min(100%,42rem)] text-[clamp(2.75rem,5.2vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-black sm:text-[clamp(3.25rem,5.5vw,5.75rem)]"
      >
        Welcome back
        <span class="headline-brand block">to your operating system.</span>
      </h1>
      <p class="mt-8 max-w-2xl text-[1.125rem] leading-relaxed text-black/60 sm:text-[1.35rem]">
        Sign in to your command center — channel, creative, and outcome context in one disciplined surface.
      </p>
      <p class="mt-4 max-w-2xl text-sm leading-relaxed text-black/45">
        Demo: <span class="font-semibold text-black/55">neel@solvomo.co</span> (onboarded) or
        <span class="font-semibold text-black/55">riya@solvomo.co</span> (guided setup).
        {{ DEMO_PASSWORD_HINT }}
      </p>
      <div class="section-divider mt-12" />
      <div class="mt-10 grid gap-5 sm:grid-cols-2">
        <div class="surface-soft rounded-[18px] p-6 sm:p-7">
          <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
            Executive view
          </p>
          <p class="mt-3 text-[16px] leading-relaxed text-black/56 sm:text-[17px]">
            QBR-ready summaries and clear next moves.
          </p>
        </div>
        <div class="surface-depth rounded-[18px] p-6 sm:p-7">
          <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
            Operator workflow
          </p>
          <p class="mt-3 text-[16px] leading-relaxed text-black/56 sm:text-[17px]">
            Plan, review, and reallocate with confidence.
          </p>
        </div>
      </div>
    </template>

    <AuthFormCard
      title="Sign in"
      description="Access your workspace. This build uses local preview auth — no server yet."
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
            for="login-email"
            class="mb-2.5 block text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
          >
            Email
          </label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            class="auth-input"
            placeholder="neel@solvomo.co"
          >
        </div>
        <div>
          <div class="mb-2 flex items-center justify-between gap-3">
            <label
              for="login-password"
              class="text-xs font-semibold uppercase tracking-[0.14em] text-black/48"
            >
              Password
            </label>
            <button type="button" class="nav-link text-sm font-semibold">
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            class="auth-input"
            placeholder="••••••••"
          >
        </div>
        <label class="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="remember"
            class="h-4 w-4 rounded border-black/15 text-[var(--sv-depth-end)] focus:ring-[rgba(91,123,225,0.35)]"
          >
          <span class="text-[15px] text-black/56">Keep me signed in on this device</span>
        </label>
        <button
          type="submit"
          class="button-primary inline-flex w-full items-center justify-center rounded-[14px] px-5 py-4 text-base font-semibold transition-all duration-200"
        >
          <span class="relative z-10 text-white">Sign in</span>
        </button>
        <p class="text-center text-[15px] text-black/52">
          New to Solvomo?
          <NuxtLink to="/signup" class="nav-link ml-1 font-semibold text-black/60">
            Create an account
          </NuxtLink>
        </p>
      </form>
    </AuthFormCard>
  </AuthShell>
</template>
