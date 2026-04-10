export type EnvironmentKind = "production" | "playground";

export interface Workspace {
  id: string;
  name: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  workspaceId: string;
  currency: string;
  attributionPreference: string;
}

export interface Environment {
  id: string;
  name: string;
  brandProfileId: string;
  kind: EnvironmentKind;
}

export type ConnectionStatus =
  | "not_connected"
  | "connecting"
  | "connected"
  | "needs_attention";

export interface SidebarNavItem {
  label: string;
  to: string;
  icon?:
    | "overview"
    | "chart"
    | "image"
    | "evolve"
    | "users"
    | "wallet"
    | "link"
    | "flask"
    | "bell"
    | "plug"
    | "settings";
}

/** Operational alert severity (distinct visual treatment per level). */
export type AlertSeverity = "critical" | "high" | "medium" | "low";

/** Lifecycle state for triage and resolution. */
export type AlertStatus = "open" | "investigating" | "resolved" | "muted";

export interface AlertItem {
  id: string;
  title: string;
  summary: string;
  severity: AlertSeverity;
  status: AlertStatus;
  /** Affected system, connector, or surface (e.g. “Meta Ads · Prospecting”). */
  source?: string;
  createdAt: string;
}

export interface LabVersionRow {
  id: string;
  name: string;
  budget: string;
  platform: string;
  expectedRoi: string;
  confidence: string;
  status: "draft" | "ready" | "deployed";
}

export interface DataTableColumn {
  key: string;
  label: string;
  class?: string;
  headerClass?: string;
}
