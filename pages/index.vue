<script setup lang="ts">
useHead({ title: "Solvomo — Marketing decision intelligence" });
</script>

<template>
  <div class="page-haze flex min-h-svh flex-col bg-white text-black antialiased">
    <div class="hero-backdrop flex flex-1 flex-col border-b border-black/10">
      <div
        class="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto w-full max-w-3xl text-center">
          <div class="eyebrow mx-auto rounded-full">
            <span class="eyebrow-dot" />
            Solvomo
          </div>
          <h1
            class="mt-8 text-[clamp(2.8rem,6vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.05em]"
          >
            Marketing
            <span class="headline-brand"> decision intelligence</span>
          </h1>
          <p class="mt-6 text-lg leading-relaxed text-black/60 sm:text-xl">
            A calm command center for growth teams — channel, creative, and outcomes in one disciplined workspace.
          </p>
          <p class="mt-4 text-sm leading-relaxed text-black/45">
            Internal preview: sign in with
            <span class="font-semibold text-black/55">neel@solvomo.co</span> (fully onboarded) or
            <span class="font-semibold text-black/55">riya@solvomo.co</span> (guided setup). Any password works.
          </p>
          <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NuxtLink
              to="/login"
              class="button-primary relative isolate inline-flex min-w-[11rem] items-center justify-center rounded-[14px] px-8 py-4 text-base font-semibold transition-all duration-200"
            >
              <span class="relative z-10 text-white">Sign in</span>
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="button-secondary relative isolate inline-flex min-w-[11rem] items-center justify-center rounded-[14px] px-8 py-4 text-base font-semibold transition-colors duration-200"
            >
              <span class="relative z-10 text-black">Create account</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
