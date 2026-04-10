/**
 * CRM & pipeline demo data — self-contained, internally consistent figures for /app/crm.
 */

export const crmReportingStrip = {
  lastSynced: "6 minutes ago",
  comparisonLabel: "vs prior 90 days",
  attribution: "Hybrid multi-touch · CRM + revenue",
} as const;

export const crmExecutive = {
  totalLeads: 1842,
  qualifiedLeads: 412,
  pipelineValue: 4_200_000,
  closedWon: 2_080_000,
  avgDealSize: 48_200,
  salesVelocityDays: 28,
  leadToOppPct: 22.4,
} as const;

/** Sparkline-shaped series for KPI cards (8 points). */
export const crmKpiTrends = {
  leads: [118, 124, 132, 141, 156, 168, 179, 184],
  qualified: [38, 41, 44, 46, 48, 49, 50, 41],
  pipeline: [3.2, 3.4, 3.5, 3.7, 3.85, 3.95, 4.05, 4.2].map((x) => x * 1e6),
  closed: [1.45, 1.52, 1.61, 1.7, 1.82, 1.9, 1.98, 2.08].map((x) => x * 1e6),
  avgDeal: [44.2, 45.1, 45.8, 46.5, 47.0, 47.6, 48.0, 48.2].map((x) => x * 1000),
} as const;

export const crmPipelineByStage = [
  { stage: "Discovery", amount: 890_000, deals: 34, tone: "neutral" as const },
  { stage: "Qualification", amount: 720_000, deals: 28, tone: "neutral" as const },
  { stage: "Proposal", amount: 1_100_000, deals: 22, tone: "info" as const },
  { stage: "Negotiation", amount: 890_000, deals: 16, tone: "neutral" as const },
  { stage: "Legal & Procurement", amount: 600_000, deals: 9, tone: "warning" as const },
] as const;

export const crmLeadSources = [
  { source: "Inbound demo", leads: 512, pct: 27.8 },
  { source: "Paid social", leads: 418, pct: 22.7 },
  { source: "Partner referral", leads: 296, pct: 16.1 },
  { source: "Outbound ABM", leads: 284, pct: 15.4 },
  { source: "Event / field", leads: 198, pct: 10.7 },
  { source: "Other", leads: 134, pct: 7.3 },
] as const;

/** Weekly funnel metrics — two series feed Conversion Trend (lead→opp vs SQL→opp). */
export const crmConversionTrend = [
  { label: "Wk 1", leadToOppPct: 18.2, sqlToOppPct: 44.1 },
  { label: "Wk 2", leadToOppPct: 18.9, sqlToOppPct: 44.8 },
  { label: "Wk 3", leadToOppPct: 19.8, sqlToOppPct: 45.9 },
  { label: "Wk 4", leadToOppPct: 20.4, sqlToOppPct: 46.5 },
  { label: "Wk 5", leadToOppPct: 21.1, sqlToOppPct: 47.2 },
  { label: "Wk 6", leadToOppPct: 21.8, sqlToOppPct: 48.0 },
  { label: "Wk 7", leadToOppPct: 22.4, sqlToOppPct: 49.1 },
  { label: "Wk 8", leadToOppPct: 22.1, sqlToOppPct: 49.2 },
] as const;

/** Snapshot for funnel card footer — aligns with latest week in crmConversionTrend. */
export const crmConversionTrendLatest = {
  leadToOppPct: 22.1,
  sqlToOppPct: 49.2,
  mqlVolume: 228,
  sqlVolume: 94,
} as const;

/**
 * Deal status mix — `value` is opp count (bar width); pct is share of book.
 * Tones map to AnalyticsSegmentBar so Open/Won/Nurture read distinctly (not one flat bar).
 */
export const crmDealStatusMix = [
  { label: "Open", value: 234, pct: 58, tone: "depth" as const },
  { label: "Won", value: 109, pct: 27, tone: "product" as const },
  { label: "Lost", value: 41, pct: 10, tone: "neutral" as const },
  { label: "Nurture", value: 20, pct: 5, tone: "brand" as const },
] as const;

export const crmTopOpportunities = [
  {
    id: "opp-1",
    name: "Northwind — RevOps rollout",
    stage: "Negotiation",
    amount: 420_000,
    owner: "A. Chen",
    close: "2026-04-28",
    health: "good" as const,
  },
  {
    id: "opp-2",
    name: "Acme Corp — Enterprise tier",
    stage: "Proposal",
    amount: 310_000,
    owner: "M. Ortiz",
    close: "2026-05-12",
    health: "good" as const,
  },
  {
    id: "opp-3",
    name: "Globex — Pilot expansion",
    stage: "Qualification",
    amount: 186_000,
    owner: "A. Chen",
    close: "2026-05-30",
    health: "watch" as const,
  },
  {
    id: "opp-4",
    name: "Soylent Co — Renewal + upsell",
    stage: "Discovery",
    amount: 98_000,
    owner: "J. Park",
    close: "2026-06-15",
    health: "risk" as const,
  },
] as const;

export const crmRecentAlerts = [
  {
    id: "ca-1",
    title: "SLA breach on follow-up",
    detail: "12 MQLs from paid social exceeded 48h SLA.",
    severity: "warning" as const,
    time: "2h ago",
  },
  {
    id: "ca-2",
    title: "Pipeline coverage",
    detail: "Q2 coverage vs target is 0.94× — outbound sequence pacing up.",
    severity: "info" as const,
    time: "5h ago",
  },
  {
    id: "ca-3",
    title: "Won deal sync",
    detail: "Salesforce ↔ Shopify match rate held at 94% for closed-won.",
    severity: "success" as const,
    time: "Yesterday",
  },
] as const;

export const crmStaleDeals = [
  {
    id: "st-1",
    name: "Lumina Health — POC",
    stage: "Proposal",
    idleDays: 23,
    owner: "M. Ortiz",
    amount: 142_000,
  },
  {
    id: "st-2",
    name: "StackRun — Security review",
    stage: "Negotiation",
    idleDays: 19,
    owner: "A. Chen",
    amount: 265_000,
  },
  {
    id: "st-3",
    name: "Finley — Champion left",
    stage: "Qualification",
    idleDays: 31,
    owner: "J. Park",
    amount: 88_000,
  },
] as const;

export const crmRepPerformance = [
  { id: "r1", name: "A. Chen", ownedPipeline: 1_420_000, wonQtd: 610_000, winRate: 34, deals: 14 },
  { id: "r2", name: "M. Ortiz", ownedPipeline: 980_000, wonQtd: 520_000, winRate: 29, deals: 11 },
  { id: "r3", name: "J. Park", ownedPipeline: 720_000, wonQtd: 380_000, winRate: 26, deals: 9 },
  { id: "r4", name: "S. Blake", ownedPipeline: 540_000, wonQtd: 290_000, winRate: 24, deals: 7 },
] as const;

export const crmOpportunityLedger = [
  {
    id: "led-1",
    opportunity: "Northwind — RevOps rollout",
    account: "Northwind Traders",
    stage: "Negotiation",
    owner: "A. Chen",
    amount: 420_000,
    nextStep: "Security questionnaire",
    lastTouch: "2026-04-08",
  },
  {
    id: "led-2",
    opportunity: "Acme — Enterprise tier",
    account: "Acme Corp",
    stage: "Proposal",
    owner: "M. Ortiz",
    amount: 310_000,
    nextStep: "Exec review call",
    lastTouch: "2026-04-07",
  },
  {
    id: "led-3",
    opportunity: "Globex — Pilot expansion",
    account: "Globex",
    stage: "Qualification",
    owner: "A. Chen",
    amount: 186_000,
    nextStep: "Technical scoping",
    lastTouch: "2026-04-06",
  },
  {
    id: "led-4",
    opportunity: "Soylent — Renewal",
    account: "Soylent Co",
    stage: "Discovery",
    owner: "J. Park",
    amount: 98_000,
    nextStep: "Champion re-engage",
    lastTouch: "2026-04-04",
  },
  {
    id: "led-5",
    opportunity: "Umbrella — Consolidation",
    account: "Umbrella Labs",
    stage: "Proposal",
    owner: "S. Blake",
    amount: 275_000,
    nextStep: "Pricing committee",
    lastTouch: "2026-04-09",
  },
  {
    id: "led-6",
    opportunity: "Initech — Add-on seats",
    account: "Initech",
    stage: "Negotiation",
    owner: "M. Ortiz",
    amount: 64_000,
    nextStep: "MSA redlines",
    lastTouch: "2026-04-08",
  },
  {
    id: "led-7",
    opportunity: "Contoso — Data residency",
    account: "Contoso Ltd",
    stage: "Legal & Procurement",
    owner: "A. Chen",
    amount: 512_000,
    nextStep: "DPA signature",
    lastTouch: "2026-04-09",
  },
  {
    id: "led-8",
    opportunity: "Fabrikam — Self-serve upgrade",
    account: "Fabrikam",
    stage: "Proposal",
    owner: "J. Park",
    amount: 44_000,
    nextStep: "Send revised quote",
    lastTouch: "2026-04-07",
  },
  {
    id: "led-9",
    opportunity: "Wide World Importers — EMEA",
    account: "Wide World Importers",
    stage: "Discovery",
    owner: "S. Blake",
    amount: 178_000,
    nextStep: "Discovery workshop",
    lastTouch: "2026-04-05",
  },
  {
    id: "led-10",
    opportunity: "Adventure Works — Renewal",
    account: "Adventure Works",
    stage: "Negotiation",
    owner: "M. Ortiz",
    amount: 92_000,
    nextStep: "Procurement counter",
    lastTouch: "2026-04-09",
  },
  {
    id: "led-11",
    opportunity: "Tailspin Toys — Pilot",
    account: "Tailspin Toys",
    stage: "Qualification",
    owner: "A. Chen",
    amount: 54_000,
    nextStep: "ROI model review",
    lastTouch: "2026-04-03",
  },
  {
    id: "led-12",
    opportunity: "Litware — Cross-sell analytics",
    account: "Litware Inc",
    stage: "Proposal",
    owner: "J. Park",
    amount: 221_000,
    nextStep: "Solution design sign-off",
    lastTouch: "2026-04-08",
  },
  {
    id: "led-13",
    opportunity: "Blue Yonder — Expansion",
    account: "Blue Yonder",
    stage: "Legal & Procurement",
    owner: "S. Blake",
    amount: 388_000,
    nextStep: "Security questionnaire v2",
    lastTouch: "2026-04-06",
  },
  {
    id: "led-14",
    opportunity: "Northridge Clinic — HIPAA package",
    account: "Northridge Clinic",
    stage: "Discovery",
    owner: "M. Ortiz",
    amount: 126_000,
    nextStep: "Stakeholder map",
    lastTouch: "2026-04-02",
  },
] as const;
