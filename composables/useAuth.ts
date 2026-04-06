import type { OnboardingStepKey, SolvomoUserId } from "~/types/mock";
import { getMockBundle, MOCK_USERS, resolveUserIdFromEmail } from "~/data/mock-solvomo";

const STORAGE_KEY = "sv-auth-session";

export interface AuthSession {
  userId: SolvomoUserId;
  email: string;
  /** Optional override when signing up with a custom name. */
  name?: string;
  onboardingSteps: OnboardingStepKey[];
}

function defaultStepsForUser(userId: SolvomoUserId): OnboardingStepKey[] {
  return [...getMockBundle(userId).onboardingDefaults];
}

export function hydrateWorkspaceFromMock(userId: SolvomoUserId) {
  const bundle = getMockBundle(userId);
  const {
    workspaces,
    brands,
    environments,
    currentWorkspaceId,
    currentBrandId,
    currentEnvironmentId,
  } = useWorkspaceContext();

  workspaces.value = [...bundle.workspaces];
  brands.value = [...bundle.brands];
  environments.value = [...bundle.environments];

  currentWorkspaceId.value = bundle.workspaces[0]?.id ?? "";
  currentBrandId.value = bundle.brands[0]?.id ?? "";
  const prod =
    bundle.environments.find(
      (e) => e.brandProfileId === currentBrandId.value && e.kind === "production",
    ) ?? bundle.environments[0];
  currentEnvironmentId.value = prod?.id ?? "";
}

export function useAuth() {
  const session = useState<AuthSession | null>("sv-auth-session", () => null);
  const restored = useState<boolean>("sv-auth-restored", () => false);
  const onboardingDraft = useOnboardingDraft();
  const workspace = useWorkspaceContext();

  const isAuthenticated = computed(() => session.value !== null);

  const activeUserId = computed(() => session.value?.userId ?? null);

  const displayName = computed(
    () => session.value?.name ?? (session.value ? MOCK_USERS[session.value.userId].profile.name : ""),
  );

  const displayEmail = computed(() => session.value?.email ?? "");

  const onboardingStepsDone = computed(() => session.value?.onboardingSteps ?? []);

  const isOnboardingComplete = computed(() => {
    if (!session.value) return false;
    const need: OnboardingStepKey[] = ["survey", "brand", "connections"];
    return need.every((s) => session.value!.onboardingSteps.includes(s));
  });

  function ensureHydrated() {
    if (!session.value) return;

    const hasWorkspaceState =
      workspace.workspaces.value.length > 0 &&
      workspace.brands.value.length > 0 &&
      workspace.environments.value.length > 0;

    if (!hasWorkspaceState) {
      hydrateWorkspaceFromMock(session.value.userId);
      return;
    }

    if (!workspace.currentWorkspaceId.value) {
      workspace.currentWorkspaceId.value = workspace.workspaces.value[0]?.id ?? "";
    }

    if (!workspace.currentBrandId.value) {
      const firstBrand =
        workspace.brands.value.find((brand) => brand.workspaceId === workspace.currentWorkspaceId.value) ??
        workspace.brands.value[0];
      workspace.currentBrandId.value = firstBrand?.id ?? "";
    }

    if (!workspace.currentEnvironmentId.value) {
      const productionForBrand =
        workspace.environments.value.find(
          (env) => env.brandProfileId === workspace.currentBrandId.value && env.kind === "production",
        ) ??
        workspace.environments.value.find((env) => env.brandProfileId === workspace.currentBrandId.value) ??
        workspace.environments.value[0];
      workspace.currentEnvironmentId.value = productionForBrand?.id ?? "";
    }
  }

  function persist() {
    if (!import.meta.client || !session.value) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session.value));
  }

  function restoreSession() {
    if (!import.meta.client) return;
    if (restored.value) {
      ensureHydrated();
      return;
    }
    restored.value = true;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      ensureHydrated();
      return;
    }
    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed.userId || !MOCK_USERS[parsed.userId]) return;
      if (!Array.isArray(parsed.onboardingSteps)) parsed.onboardingSteps = [];
      session.value = parsed;
      ensureHydrated();
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function loginWithUserId(userId: SolvomoUserId, email: string, nameOverride?: string) {
    let prevSteps: OnboardingStepKey[] = [];
    if (import.meta.client) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const p = JSON.parse(raw) as AuthSession;
          if (p.userId === userId && Array.isArray(p.onboardingSteps)) prevSteps = p.onboardingSteps;
        } catch {
          /* ignore */
        }
      }
    }
    const base = defaultStepsForUser(userId);
    const merged = new Set<OnboardingStepKey>([...base, ...prevSteps]);
    session.value = {
      userId,
      email,
      name: nameOverride,
      onboardingSteps: [...merged],
    };
    hydrateWorkspaceFromMock(userId);
    onboardingDraft.resetDraft();
    persist();
  }

  function login(email: string, _password: string): { ok: true } | { ok: false; message: string } {
    const id = resolveUserIdFromEmail(email);
    if (!id) {
      return {
        ok: false,
        message: "Use a demo account: neel@solvomo.co or riya@solvomo.co",
      };
    }
    loginWithUserId(id, email.trim().toLowerCase());
    return { ok: true };
  }

  function signup(payload: { email: string; password: string; name: string }): void {
    const email = payload.email.trim().toLowerCase();
    const id: SolvomoUserId = "riya";
    session.value = {
      userId: id,
      email: email || MOCK_USERS.riya.profile.email,
      name: payload.name.trim() || undefined,
      onboardingSteps: [],
    };
    hydrateWorkspaceFromMock(id);
    onboardingDraft.resetDraft();
    persist();
  }

  function logout() {
    session.value = null;
    onboardingDraft.resetDraft();
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY);
  }

  function completeOnboardingStep(step: OnboardingStepKey) {
    if (!session.value) return;
    if (!session.value.onboardingSteps.includes(step)) {
      session.value.onboardingSteps.push(step);
      persist();
    }
  }

  function nextOnboardingPath(): string {
    if (!session.value) return "/login";
    const done = session.value.onboardingSteps;
    if (!done.includes("survey")) return "/onboarding/survey";
    if (!done.includes("brand")) return "/onboarding/brand-setup";
    if (!done.includes("connections")) return "/onboarding/connections";
    return "/app";
  }

  return {
    session,
    isAuthenticated,
    activeUserId,
    displayName,
    displayEmail,
    onboardingStepsDone,
    isOnboardingComplete,
    ensureHydrated,
    restoreSession,
    login,
    signup,
    logout,
    completeOnboardingStep,
    nextOnboardingPath,
    persist,
  };
}
