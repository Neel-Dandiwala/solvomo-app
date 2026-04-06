import type { BrandProfile } from "~/types/app-shell";

const STORAGE_KEY = "sv-onboarding-draft";

export interface OnboardingDraftState {
  primaryGoal: string | null;
  budgetBand: string | null;
  platforms: string[];
  businessType: string | null;
  brandName: string;
  currency: string;
  attribution: string;
}

function defaultDraft(brand?: BrandProfile): OnboardingDraftState {
  return {
    primaryGoal: null,
    budgetBand: null,
    platforms: [],
    businessType: null,
    brandName: brand?.name ?? "",
    currency: brand?.currency ?? "USD",
    attribution: brand?.attributionPreference ?? "",
  };
}

export function useOnboardingDraft() {
  const { currentBrand } = useWorkspaceContext();
  const draft = useState<OnboardingDraftState>("sv-onboarding-draft", () => defaultDraft(currentBrand.value));
  const restored = useState<boolean>("sv-onboarding-draft-restored", () => false);
  const watchBound = useState<boolean>("sv-onboarding-draft-watch", () => false);

  function restoreDraft() {
    if (!import.meta.client || restored.value) return;
    restored.value = true;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        draft.value = { ...defaultDraft(currentBrand.value), ...(JSON.parse(raw) as Partial<OnboardingDraftState>) };
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    draft.value = defaultDraft(currentBrand.value);
  }

  function persistDraft() {
    if (!import.meta.client) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft.value));
  }

  function resetDraft() {
    draft.value = defaultDraft(currentBrand.value);
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY);
  }

  if (!watchBound.value) {
    watchBound.value = true;
    watch(
      draft,
      () => {
        persistDraft();
      },
      { deep: true },
    );
  }

  return {
    draft,
    restoreDraft,
    persistDraft,
    resetDraft,
  };
}
