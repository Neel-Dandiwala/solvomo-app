import type {
  BrandProfile,
  Environment,
  EnvironmentKind,
  SidebarNavItem,
  Workspace,
} from "~/types/app-shell";

const SIDEBAR_NAV: SidebarNavItem[] = [
  { label: "Overview", to: "/app", icon: "overview" },
  { label: "Performance", to: "/app/performance", icon: "chart" },
  { label: "Creatives", to: "/app/creatives", icon: "image" },
  { label: "Evolve", to: "/app/evolve", icon: "evolve" },
  { label: "Audience", to: "/app/audience", icon: "users" },
  { label: "Spend", to: "/app/spend", icon: "wallet" },
  { label: "CRM / Outcomes", to: "/app/crm", icon: "link" },
  { label: "Lab", to: "/app/lab", icon: "flask" },
  { label: "Alerts", to: "/app/alerts", icon: "bell" },
  { label: "Connections", to: "/app/connections", icon: "plug" },
  { label: "Settings", to: "/app/settings", icon: "settings" },
];

export function useWorkspaceContext() {
  const workspaces = useState<Workspace[]>("sv-workspaces", () => []);
  const brands = useState<BrandProfile[]>("sv-brands", () => []);
  const environments = useState<Environment[]>("sv-environments", () => []);

  const currentWorkspaceId = useState<string>("sv-current-workspace", () => "");
  const currentBrandId = useState<string>("sv-current-brand", () => "");
  const currentEnvironmentId = useState<string>("sv-current-env", () => "");

  const sidebarCollapsed = useState<boolean>("sv-sidebar-collapsed", () => false);
  const mobileNavOpen = useState<boolean>("sv-mobile-nav-open", () => false);

  const currentWorkspace = computed(() =>
    workspaces.value.find((w) => w.id === currentWorkspaceId.value) ?? workspaces.value[0],
  );

  const currentBrand = computed(() =>
    brands.value.find((b) => b.id === currentBrandId.value) ?? brands.value[0],
  );

  const currentEnvironment = computed(() =>
    environments.value.find((e) => e.id === currentEnvironmentId.value) ??
      environments.value[0],
  );

  const isPlayground = computed(
    () => currentEnvironment.value?.kind === "playground",
  );

  const brandsForWorkspace = computed(() =>
    brands.value.filter((b) => b.workspaceId === currentWorkspaceId.value),
  );

  const environmentsForBrand = computed(() =>
    environments.value.filter((e) => e.brandProfileId === currentBrandId.value),
  );

  function setWorkspace(id: string) {
    currentWorkspaceId.value = id;
    const firstBrand = brands.value.find((b) => b.workspaceId === id);
    if (firstBrand) currentBrandId.value = firstBrand.id;
    const firstEnv = environments.value.find((e) => e.brandProfileId === currentBrandId.value);
    if (firstEnv) currentEnvironmentId.value = firstEnv.id;
  }

  function setBrand(id: string) {
    currentBrandId.value = id;
    const firstEnv = environments.value.find((e) => e.brandProfileId === id);
    if (firstEnv) currentEnvironmentId.value = firstEnv.id;
  }

  function setEnvironment(id: string) {
    currentEnvironmentId.value = id;
  }

  function setEnvironmentKind(kind: EnvironmentKind) {
    const list = environmentsForBrand.value;
    const match = list.find((e) => e.kind === kind);
    if (match) currentEnvironmentId.value = match.id;
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function toggleMobileNav() {
    mobileNavOpen.value = !mobileNavOpen.value;
  }

  function closeMobileNav() {
    mobileNavOpen.value = false;
  }

  return {
    sidebarNav: SIDEBAR_NAV,
    workspaces,
    brands,
    environments,
    currentWorkspaceId,
    currentBrandId,
    currentEnvironmentId,
    currentWorkspace,
    currentBrand,
    currentEnvironment,
    isPlayground,
    brandsForWorkspace,
    environmentsForBrand,
    sidebarCollapsed,
    mobileNavOpen,
    setWorkspace,
    setBrand,
    setEnvironment,
    setEnvironmentKind,
    toggleSidebar,
    toggleMobileNav,
    closeMobileNav,
  };
}
