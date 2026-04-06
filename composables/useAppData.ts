import { getMockBundle, resolveUserIdFromEmail } from "~/data/mock-solvomo";
import type { SolvomoMockBundle } from "~/types/mock";

/**
 * Table and panel data for the signed-in user — sourced from `data/mock-solvomo.ts` only.
 */
export function useAppData() {
  const auth = useAuth();
  const workspace = useWorkspaceContext();

  auth.restoreSession();
  auth.ensureHydrated();

  const resolvedUserId = computed(() => {
    if (auth.activeUserId.value) return auth.activeUserId.value;
    if (auth.session.value?.email) return resolveUserIdFromEmail(auth.session.value.email);
    return null;
  });

  const bundle = computed<SolvomoMockBundle | null>(() =>
    resolvedUserId.value ? getMockBundle(resolvedUserId.value) : null,
  );

  const currentProfile = computed(() => bundle.value?.profile ?? null);
  const hasBundle = computed(() => bundle.value !== null);
  const hasWorkspaceScope = computed(
    () =>
      !!workspace.currentWorkspace.value &&
      !!workspace.currentBrand.value &&
      !!workspace.currentEnvironment.value,
  );
  const dataStatus = computed<"ready" | "missing_session" | "missing_scope">(() => {
    if (!hasBundle.value) return "missing_session";
    if (!hasWorkspaceScope.value) return "missing_scope";
    return "ready";
  });

  const overviewHero = computed(() => bundle.value?.overviewHero ?? null);
  const overview = computed(() => bundle.value?.overview ?? null);

  const alerts = computed(() => bundle.value?.alerts ?? []);
  const labVersions = computed(() => bundle.value?.labVersions ?? []);
  const connectionsShell = computed(() => bundle.value?.connectionsShell ?? []);
  const connectionsOnboarding = computed(() => bundle.value?.connectionsOnboarding ?? []);
  const creatives = computed(() => bundle.value?.creatives ?? []);
  const audience = computed(() => bundle.value?.audience ?? []);
  const spend = computed(() => bundle.value?.spend ?? []);
  const crm = computed(() => bundle.value?.crm ?? []);

  const performanceCampaigns = computed(() => bundle.value?.performance.campaigns ?? []);
  const performanceAdGroups = computed(() => bundle.value?.performance.ad_groups ?? []);
  const performanceAds = computed(() => bundle.value?.performance.ads ?? []);

  function performanceRows(view: "campaigns" | "ad_groups" | "ads") {
    switch (view) {
      case "ad_groups":
        return performanceAdGroups.value;
      case "ads":
        return performanceAds.value;
      default:
        return performanceCampaigns.value;
    }
  }

  return {
    bundle,
    currentProfile,
    hasBundle,
    hasWorkspaceScope,
    dataStatus,
    overviewHero,
    overview,
    alerts,
    labVersions,
    connectionsShell,
    connectionsOnboarding,
    creatives,
    audience,
    spend,
    crm,
    performanceCampaigns,
    performanceAdGroups,
    performanceAds,
    performanceRows,
  };
}
