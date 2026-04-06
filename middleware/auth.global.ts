const ONBOARDING_ORDER = ["/onboarding/survey", "/onboarding/brand-setup", "/onboarding/connections"] as const;

function firstIncompleteOnboardingIndex(auth: ReturnType<typeof useAuth>): number {
  const done = auth.session.value?.onboardingSteps ?? [];
  if (!done.includes("survey")) return 0;
  if (!done.includes("brand")) return 1;
  if (!done.includes("connections")) return 2;
  return 3;
}

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth();
  auth.restoreSession();
  const path = to.path;

  const isApp = path.startsWith("/app");
  const isOnboarding = path.startsWith("/onboarding");
  const isLogin = path === "/login";
  const isSignup = path === "/signup";
  const isHome = path === "/";

  if (isHome && auth.isAuthenticated.value) {
    return navigateTo(
      auth.isOnboardingComplete.value ? "/app" : auth.nextOnboardingPath(),
    );
  }

  if (isApp) {
    if (!auth.isAuthenticated.value) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }
    if (!auth.isOnboardingComplete.value) {
      const next = auth.nextOnboardingPath();
      return navigateTo(next);
    }
  }

  if (isOnboarding) {
    if (!auth.isAuthenticated.value) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }
    if (auth.isOnboardingComplete.value) {
      return navigateTo("/app");
    }

    if (path === "/onboarding" || path === "/onboarding/") {
      return navigateTo(auth.nextOnboardingPath());
    }

    const idx = ONBOARDING_ORDER.indexOf(path as (typeof ONBOARDING_ORDER)[number]);
    if (idx !== -1) {
      const need = firstIncompleteOnboardingIndex(auth);
      if (idx > need) {
        return navigateTo(ONBOARDING_ORDER[need]);
      }
    }
  }

  if (isLogin || isSignup) {
    if (auth.isAuthenticated.value) {
      if (!auth.isOnboardingComplete.value) {
        return navigateTo(auth.nextOnboardingPath());
      }
      return navigateTo("/app");
    }
  }
});
