/**
 * Spend page demo dataset — standalone module (no composable) so /app/spend always has rows to render.
 */

export const spendReportingMeta = {
  lastSynced: "8 minutes ago",
  comparisonLabel: "vs previous 28 days",
  attributionModel: "Hybrid multi-touch",
} as const;

export const spendDemoCampaigns = [
  {
    id: "cmp-meta-prospecting",
    channel: "Meta Ads",
    region: "North America",
    objective: "Demand generation",
    spend: 28400,
    revenue: 132000,
    purchases: 24,
  },
  {
    id: "cmp-meta-retargeting",
    channel: "Meta Ads",
    region: "Global",
    objective: "Retargeting",
    spend: 14200,
    revenue: 104000,
    purchases: 29,
  },
  {
    id: "cmp-google-brand",
    channel: "Google Ads",
    region: "Global",
    objective: "Brand capture",
    spend: 11600,
    revenue: 92000,
    purchases: 31,
  },
  {
    id: "cmp-google-nonbrand",
    channel: "Google Ads",
    region: "North America",
    objective: "Demand capture",
    spend: 12400,
    revenue: 54000,
    purchases: 15,
  },
  {
    id: "cmp-linkedin-abm",
    channel: "LinkedIn",
    region: "North America + UK",
    objective: "Pipeline creation",
    spend: 10100,
    revenue: 28000,
    purchases: 9,
  },
  {
    id: "cmp-youtube-retargeting",
    channel: "YouTube",
    region: "Global",
    objective: "Influence + nurture",
    spend: 8300,
    revenue: 20000,
    purchases: 9,
  },
] as const;

export const spendDemoWeeks = [
  { label: "Wk 1", actual: 8900, budget: 9400, primaryDriver: "Meta prospecting", roas: 4.4 },
  { label: "Wk 2", actual: 9800, budget: 9800, primaryDriver: "Meta retargeting", roas: 4.6 },
  { label: "Wk 3", actual: 10100, budget: 10200, primaryDriver: "Google brand", roas: 4.9 },
  { label: "Wk 4", actual: 10400, budget: 10500, primaryDriver: "Meta prospecting", roas: 4.8 },
  { label: "Wk 5", actual: 10600, budget: 10800, primaryDriver: "Google non-brand", roas: 5.1 },
  { label: "Wk 6", actual: 11400, budget: 11000, primaryDriver: "Meta retargeting", roas: 5.1 },
  { label: "Wk 7", actual: 11700, budget: 11300, primaryDriver: "Meta prospecting", roas: 5.4 },
  { label: "Wk 8", actual: 12100, budget: 11500, primaryDriver: "Google brand", roas: 5.9 },
] as const;

export const spendDemoPacing = [
  { id: "pace-1", campaign: "Meta Prospecting - Founder Narrative", channel: "Meta Ads", region: "North America", objective: "Demand generation", budget: 27000, actual: 28400, pace: 105, alert: "Overpacing" },
  { id: "pace-2", campaign: "Meta Retargeting - Site Visitors 30D", channel: "Meta Ads", region: "Global", objective: "Retargeting", budget: 13400, actual: 14200, pace: 106, alert: "Overpacing" },
  { id: "pace-3", campaign: "Google Brand Search - High Intent", channel: "Google Ads", region: "Global", objective: "Brand capture", budget: 12000, actual: 11600, pace: 97, alert: "On plan" },
  { id: "pace-4", campaign: "Google Non-Brand Search - Workflow Terms", channel: "Google Ads", region: "North America", objective: "Demand capture", budget: 12800, actual: 12400, pace: 97, alert: "On plan" },
  { id: "pace-5", campaign: "LinkedIn ABM - RevOps Target Accounts", channel: "LinkedIn", region: "North America + UK", objective: "Pipeline creation", budget: 12400, actual: 10100, pace: 81, alert: "Underpacing" },
  { id: "pace-6", campaign: "YouTube Retargeting - Customer Proof", channel: "YouTube", region: "Global", objective: "Influence + nurture", budget: 8900, actual: 8300, pace: 93, alert: "Underpacing" },
] as const;

export const spendDemoLedger = [
  { id: "tx-1", date: "2026-04-08", campaign: "Meta Prospecting - Founder Narrative", channel: "Meta Ads", region: "North America", amount: 4200, status: "Settled", goal: "Demand generation" },
  { id: "tx-2", date: "2026-04-08", campaign: "Meta Retargeting - Site Visitors 30D", channel: "Meta Ads", region: "Global", amount: 2100, status: "Settled", goal: "Retargeting" },
  { id: "tx-3", date: "2026-04-07", campaign: "Google Brand Search - High Intent", channel: "Google Ads", region: "Global", amount: 1800, status: "Settled", goal: "Brand capture" },
  { id: "tx-4", date: "2026-04-07", campaign: "Google Non-Brand Search - Workflow Terms", channel: "Google Ads", region: "North America", amount: 2400, status: "Pending", goal: "Demand capture" },
  { id: "tx-5", date: "2026-04-06", campaign: "LinkedIn ABM - RevOps Target Accounts", channel: "LinkedIn", region: "North America + UK", amount: 1650, status: "Settled", goal: "Pipeline creation" },
  { id: "tx-6", date: "2026-04-06", campaign: "YouTube Retargeting - Customer Proof", channel: "YouTube", region: "Global", amount: 980, status: "Settled", goal: "Influence + nurture" },
  { id: "tx-7", date: "2026-04-05", campaign: "Meta Prospecting - Founder Narrative", channel: "Meta Ads", region: "North America", amount: 3950, status: "Settled", goal: "Demand generation" },
  { id: "tx-8", date: "2026-04-05", campaign: "Meta Retargeting - Site Visitors 30D", channel: "Meta Ads", region: "Global", amount: 2050, status: "Settled", goal: "Retargeting" },
  { id: "tx-9", date: "2026-04-04", campaign: "Google Brand Search - High Intent", channel: "Google Ads", region: "Global", amount: 1720, status: "Adjusted", goal: "Brand capture" },
  { id: "tx-10", date: "2026-04-04", campaign: "Google Non-Brand Search - Workflow Terms", channel: "Google Ads", region: "North America", amount: 2280, status: "Settled", goal: "Demand capture" },
  { id: "tx-11", date: "2026-04-03", campaign: "LinkedIn ABM - RevOps Target Accounts", channel: "LinkedIn", region: "North America + UK", amount: 1580, status: "Pending", goal: "Pipeline creation" },
  { id: "tx-12", date: "2026-04-03", campaign: "YouTube Retargeting - Customer Proof", channel: "YouTube", region: "Global", amount: 910, status: "Settled", goal: "Influence + nurture" },
] as const;

export const spendDemoChannelFallback = [
  { label: "Meta Ads", spend: 42600, revenue: 236000 },
  { label: "Google Ads", spend: 24000, revenue: 146000 },
  { label: "LinkedIn", spend: 10100, revenue: 28000 },
  { label: "YouTube", spend: 8300, revenue: 20000 },
] as const;

export const spendDemoObjectiveFallback = [
  { label: "Demand generation", spend: 28400, revenue: 132000 },
  { label: "Retargeting", spend: 14200, revenue: 104000 },
  { label: "Brand capture", spend: 11600, revenue: 92000 },
  { label: "Demand capture", spend: 12400, revenue: 54000 },
  { label: "Pipeline creation", spend: 10100, revenue: 28000 },
  { label: "Influence + nurture", spend: 8300, revenue: 20000 },
] as const;
