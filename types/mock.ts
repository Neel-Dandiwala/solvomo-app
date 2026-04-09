import type { AlertItem, BrandProfile, ConnectionStatus, Environment, LabVersionRow, Workspace } from "~/types/app-shell";

export type SolvomoUserId = "neel" | "riya";

export type OnboardingStepKey = "survey" | "brand" | "connections";

export interface UserProfile {
  id: SolvomoUserId;
  name: string;
  email: string;
  title: string;
}

export interface MockConnection {
  id: string;
  name: string;
  description: string;
  status: ConnectionStatus;
}

export interface OverviewHero {
  periodSpend: string;
  attributedRevenue: string;
  roi: string;
  cac: string;
  workingBullets: [string, string, string];
  fixBullets: [string, string, string];
}

export type OverviewWidgetSource = "summary" | "ad_data" | "crm_data" | "spend_data" | "alerts" | "connections";
export type OverviewWidgetVisualization =
  | "kpi"
  | "bar"
  | "line"
  | "area"
  | "donut"
  | "table"
  | "stacked_bar"
  | "insights"
  | "connections"
  | "alerts"
  | "horizontal_bar"
  | "funnel"
  | "signal_list"
  | "metric_delta";
export type OverviewWidgetMetric =
  | "spend"
  | "revenue"
  | "roi"
  | "cac"
  | "qualified_leads"
  | "deals"
  | "pipeline_revenue"
  | "closed_revenue"
  | "impressions"
  | "clicks"
  | "ctr"
  | "conversions"
  | "amount";

export type OverviewWidgetDimension =
  | "date"
  | "platform"
  | "lead_source"
  | "channel"
  | "campaign_cluster"
  | "vendor";

export interface OverviewKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: "positive" | "negative" | "neutral";
  source: OverviewWidgetSource;
  helper: string;
}

export type OverviewInsightKind = "opportunity" | "risk" | "neutral";

export interface OverviewInsight {
  id: string;
  title: string;
  summary: string;
  tone: "brand" | "product" | "depth";
  linkLabel?: string;
  linkTo?: string;
  /** Short label for signal strip; defaults to `title` when absent */
  headline?: string;
  kind?: OverviewInsightKind;
  /** One-line cause/effect; shown in callouts or expanded detail */
  because?: string;
  relatedMetric?: OverviewWidgetMetric;
}

export interface OverviewTrendPoint {
  date: string;
  spend: number;
  revenue: number;
  qualifiedLeads: number;
  deals: number;
  pipelineRevenue: number;
  closedRevenue: number;
  /** Site-wide conversions (e.g. lead forms); used for conversion trend */
  conversions?: number;
  /** $k-style proxy for CAC sparkline when present */
  cac?: number;
}

export interface OverviewPlatformSummary {
  platform: string;
  spend: number;
  revenue: number;
  roi: number;
  ctr: number;
  conversions: number;
  qualifiedLeads: number;
  deals: number;
  efficiencyLabel: string;
}

export interface OverviewLeadSourceSummary {
  source: string;
  leads: number;
  qualifiedLeads: number;
  deals: number;
  revenue: number;
}

export interface OverviewSpendRecord {
  id: string;
  date: string;
  channel: string;
  vendor: string;
  category: string;
  amount: number;
}

export interface OverviewCampaignCluster {
  cluster: string;
  spend: number;
  revenue: number;
  roi: number;
}

export interface OverviewFunnelStage {
  stage: string;
  value: number;
  /** Conversion rate from previous stage, 0–100 */
  rateFromPrev?: number;
}

export type OverviewPrioritySignalSeverity = "critical" | "warning" | "info";

export interface OverviewPrioritySignal {
  id: string;
  headline: string;
  severity: OverviewPrioritySignalSeverity;
  kind?: OverviewInsightKind;
  /** e.g. "+18% spend" or "ROAS 3.2x" */
  delta?: string;
}

export interface OverviewAttributionMixRow {
  label: string;
  value: number;
}

export interface OverviewCampaignEfficiencyRow {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roi: number;
}

export interface OverviewCreatorRow {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roi: number;
}

export interface OverviewRevenueAttributionSplit {
  direct: number;
  assisted: number;
}

export interface OverviewNewVsReturning {
  newRevenue: number;
  returningRevenue: number;
}

export interface OverviewLeadSourceQualityRow {
  source: string;
  volume: number;
  pipelineQuality: number;
  revenue: number;
}

export interface OverviewBudgetRecommendation {
  id: string;
  action: string;
  impact: string;
}

export interface OverviewConnectionsSummary {
  connected: number;
  syncing: number;
  attention: number;
  lastSyncLabel?: string;
  delayedSources?: string[];
}

export interface OverviewCreativeLeaderboardRow {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roas: number;
}

export interface OverviewPerformanceChange {
  id: string;
  label: string;
  delta: string;
  period: string;
  tone?: "positive" | "negative" | "neutral";
}

export interface OverviewWidgetConfig {
  id: string;
  title: string;
  description: string;
  source: OverviewWidgetSource;
  visualization: OverviewWidgetVisualization;
  datasetKey: string;
  metric?: OverviewWidgetMetric;
  dimension?: OverviewWidgetDimension;
  size: "xs" | "sm" | "md" | "lg" | "full";
}

export interface OverviewDashboardConfig {
  id: string;
  name: string;
  description: string;
  widgetIds: string[];
  isDefault?: boolean;
}

export interface OverviewData {
  kpis: OverviewKpi[];
  insights: OverviewInsight[];
  /** 2–3 short lines for the executive row; no placeholder copy */
  executiveBullets: string[];
  trendPoints: OverviewTrendPoint[];
  platformSummaries: OverviewPlatformSummary[];
  leadSourceSummaries: OverviewLeadSourceSummary[];
  spendRecords: OverviewSpendRecord[];
  campaignClusters: OverviewCampaignCluster[];
  funnel: OverviewFunnelStage[];
  connectionsSummary: OverviewConnectionsSummary;
  creativeLeaderboard: OverviewCreativeLeaderboardRow[];
  performanceChanges: OverviewPerformanceChange[];
  /** Top priority risks/opportunities beside hero */
  prioritySignals: OverviewPrioritySignal[];
  /** Matched vs modeled vs unattributed (volume index) */
  attributionMix: OverviewAttributionMixRow[];
  /** Named campaigns */
  campaignEfficiency: OverviewCampaignEfficiencyRow[];
  creatorSummaries: OverviewCreatorRow[];
  revenueAttributionSplit: OverviewRevenueAttributionSplit;
  newVsReturning: OverviewNewVsReturning;
  leadSourceQuality: OverviewLeadSourceQualityRow[];
  budgetRecommendations: OverviewBudgetRecommendation[];
  widgets: OverviewWidgetConfig[];
  dashboards: OverviewDashboardConfig[];
}

export interface SolvomoMockBundle {
  profile: UserProfile;
  workspaces: Workspace[];
  brands: BrandProfile[];
  environments: Environment[];
  /** Baseline completed steps when session is created (Neel: all; Riya: none). */
  onboardingDefaults: OnboardingStepKey[];
  /** Command center hero metrics (static demo strings). */
  overviewHero: OverviewHero;
  overview: OverviewData;
  connectionsShell: MockConnection[];
  connectionsOnboarding: MockConnection[];
  alerts: AlertItem[];
  labVersions: LabVersionRow[];
  performance: {
    campaigns: Record<string, unknown>[];
    ad_groups: Record<string, unknown>[];
    ads: Record<string, unknown>[];
  };
  creatives: Record<string, unknown>[];
  audience: Record<string, unknown>[];
  spend: Record<string, unknown>[];
  crm: Record<string, unknown>[];
}
