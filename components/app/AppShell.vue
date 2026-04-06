<script setup lang="ts">
const route = useRoute();
const auth = useAuth();
const { isPlayground, sidebarCollapsed, mobileNavOpen, closeMobileNav } = useWorkspaceContext();

const isOverviewRoute = computed(() => route.path === "/app" || route.path === "/app/overview");

auth.restoreSession();
auth.ensureHydrated();

watch(
  () => route.fullPath,
  () => {
    closeMobileNav();
  },
);
</script>

<template>
  <div class="app-shell flex min-h-svh w-full flex-col text-black">
    <PlaygroundBanner v-if="isPlayground" />
    <div
      v-show="mobileNavOpen"
      class="fixed inset-0 z-20 bg-black/40 lg:hidden"
      aria-hidden="true"
      @click="closeMobileNav"
    />
    <div class="flex min-h-0 flex-1">
      <AppSidebar
        :class="{
          'app-sidebar--collapsed': sidebarCollapsed,
          'app-sidebar--mobile-open': mobileNavOpen,
        }"
      />
      <div class="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main class="app-main-scroll page-haze min-h-0 flex-1 overflow-auto">
          <div
            class="app-main-inner sv-page w-full py-8 sm:py-9 lg:py-10"
            :class="
              isOverviewRoute
                ? 'mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8 xl:px-10'
                : 'mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8'
            "
          >
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
