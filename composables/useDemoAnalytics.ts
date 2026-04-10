const reportingMeta = {
  label: "Demo analytics",
  lastSynced: "8 minutes ago",
  comparisonLabel: "vs previous 28 days",
  activeCampaigns: 6,
  attributionModel: "Hybrid multi-touch",
  confidenceLabel: "High confidence",
};

const performanceCampaigns = [
  {
    id: "cmp-meta-prospecting",
    name: "Meta Prospecting - Founder Narrative",
    channel: "Meta Ads",
    region: "North America",
    objective: "Demand generation",
    deviceMix: "Mobile-heavy",
    status: "Scaling",
    spend: 28400,
    impressions: 2800000,
    clicks: 39200,
    leads: 402,
    sqls: 102,
    purchases: 24,
    pipeline: 198000,
    revenue: 132000,
  },
  {
    id: "cmp-meta-retargeting",
    name: "Meta Retargeting - Site Visitors 30D",
    channel: "Meta Ads",
    region: "Global",
    objective: "Retargeting",
    deviceMix: "Balanced",
    status: "Efficient",
    spend: 14200,
    impressions: 680000,
    clicks: 14100,
    leads: 356,
    sqls: 96,
    purchases: 29,
    pipeline: 128000,
    revenue: 104000,
  },
  {
    id: "cmp-google-brand",
    name: "Google Brand Search - High Intent",
    channel: "Google Ads",
    region: "Global",
    objective: "Brand capture",
    deviceMix: "Desktop-heavy",
    status: "Top performer",
    spend: 11600,
    impressions: 410000,
    clicks: 18500,
    leads: 289,
    sqls: 88,
    purchases: 31,
    pipeline: 112000,
    revenue: 92000,
  },
  {
    id: "cmp-google-nonbrand",
    name: "Google Non-Brand Search - Workflow Terms",
    channel: "Google Ads",
    region: "North America",
    objective: "Demand capture",
    deviceMix: "Desktop-heavy",
    status: "Stable",
    spend: 12400,
    impressions: 1120000,
    clicks: 11300,
    leads: 142,
    sqls: 39,
    purchases: 15,
    pipeline: 86000,
    revenue: 54000,
  },
  {
    id: "cmp-linkedin-abm",
    name: "LinkedIn ABM - RevOps Target Accounts",
    channel: "LinkedIn",
    region: "North America + UK",
    objective: "Pipeline creation",
    deviceMix: "Desktop-first",
    status: "Under target",
    spend: 10100,
    impressions: 520000,
    clicks: 5400,
    leads: 62,
    sqls: 37,
    purchases: 9,
    pipeline: 114000,
    revenue: 28000,
  },
  {
    id: "cmp-youtube-retargeting",
    name: "YouTube Retargeting - Customer Proof",
    channel: "YouTube",
    region: "Global",
    objective: "Influence + nurture",
    deviceMix: "CTV + mobile",
    status: "Fatiguing",
    spend: 8300,
    impressions: 1310000,
    clicks: 3200,
    leads: 33,
    sqls: 24,
    purchases: 9,
    pipeline: 52000,
    revenue: 20000,
  },
] as const;

const performanceTrend = [
  { label: "Wk 1", spend: 8900, revenue: 39000, leads: 116, sqls: 32, pipeline: 61000 },
  { label: "Wk 2", spend: 9800, revenue: 45000, leads: 126, sqls: 36, pipeline: 69000 },
  { label: "Wk 3", spend: 10100, revenue: 49000, leads: 142, sqls: 40, pipeline: 75000 },
  { label: "Wk 4", spend: 10400, revenue: 50000, leads: 149, sqls: 43, pipeline: 79000 },
  { label: "Wk 5", spend: 10600, revenue: 54000, leads: 156, sqls: 46, pipeline: 84000 },
  { label: "Wk 6", spend: 11400, revenue: 58000, leads: 178, sqls: 55, pipeline: 95000 },
  { label: "Wk 7", spend: 11700, revenue: 63000, leads: 191, sqls: 62, pipeline: 107000 },
  { label: "Wk 8", spend: 12100, revenue: 72000, leads: 226, sqls: 72, pipeline: 120000 },
] as const;

const creativeAssetsLegacy = [
  {
    id: "cr-founder-pov",
    name: "Founder POV - 15s Selfie",
    format: "UGC",
    platform: "Meta Ads",
    campaignId: "cmp-meta-prospecting",
    spend: 13600,
    impressions: 1120000,
    ctr: 1.74,
    hookRate: 38,
    holdRate: 24,
    conversions: 214,
    revenue: 71000,
    daysLive: 11,
    fatigueScore: 24,
    primaryTag: "High CTR",
    secondaryTag: "Strong CVR",
    status: "Scaling",
  },
  {
    id: "cr-founder-narrative",
    name: "Founder Story - Why Solvomo Wins",
    format: "Video",
    platform: "Meta Ads",
    campaignId: "cmp-meta-prospecting",
    spend: 12400,
    impressions: 1180000,
    ctr: 1.68,
    hookRate: 36,
    holdRate: 23,
    conversions: 186,
    revenue: 62000,
    daysLive: 14,
    fatigueScore: 31,
    primaryTag: "High CTR",
    secondaryTag: "Efficient spend",
    status: "Scaling",
  },
  {
    id: "cr-pain-carousel",
    name: "Pain Point Carousel - RevOps Bottlenecks",
    format: "Carousel",
    platform: "Meta Ads",
    campaignId: "cmp-meta-retargeting",
    spend: 9800,
    impressions: 820000,
    ctr: 1.52,
    hookRate: 28,
    holdRate: 18,
    conversions: 149,
    revenue: 48000,
    daysLive: 17,
    fatigueScore: 42,
    primaryTag: "Strong CVR",
    secondaryTag: "Retargeting winner",
    status: "Efficient",
  },
  {
    id: "cr-customer-proof",
    name: "Customer Proof - Team Testimonial",
    format: "Video",
    platform: "YouTube",
    campaignId: "cmp-youtube-retargeting",
    spend: 6100,
    impressions: 940000,
    ctr: 0.32,
    hookRate: 41,
    holdRate: 29,
    conversions: 38,
    revenue: 21000,
    daysLive: 22,
    fatigueScore: 51,
    primaryTag: "Strong CVR",
    secondaryTag: "Fatigue Risk",
    status: "Monitoring",
  },
  {
    id: "cr-roi-static",
    name: "ROI Proof Static - CFO Angle",
    format: "Image",
    platform: "LinkedIn",
    campaignId: "cmp-linkedin-abm",
    spend: 8300,
    impressions: 410000,
    ctr: 0.89,
    hookRate: 19,
    holdRate: 12,
    conversions: 39,
    revenue: 19000,
    daysLive: 29,
    fatigueScore: 74,
    primaryTag: "Fatigue Risk",
    secondaryTag: "High spend",
    status: "Needs refresh",
  },
  {
    id: "cr-quote-collage",
    name: "Customer Quote Collage - Retargeting",
    format: "Carousel",
    platform: "Meta Ads",
    campaignId: "cmp-meta-retargeting",
    spend: 2900,
    impressions: 220000,
    ctr: 1.95,
    hookRate: 31,
    holdRate: 20,
    conversions: 52,
    revenue: 18000,
    daysLive: 9,
    fatigueScore: 18,
    primaryTag: "High CTR",
    secondaryTag: "Strong CVR",
    status: "Efficient",
  },
  {
    id: "cr-demo-walkthrough",
    name: "Product Walkthrough - 30s Demo Cut",
    format: "Video",
    platform: "LinkedIn",
    campaignId: "cmp-linkedin-abm",
    spend: 3700,
    impressions: 110000,
    ctr: 1.08,
    hookRate: 26,
    holdRate: 17,
    conversions: 14,
    revenue: 6000,
    daysLive: 20,
    fatigueScore: 57,
    primaryTag: "Pipeline assist",
    secondaryTag: "Low volume",
    status: "Under review",
  },
  {
    id: "cr-compare-static",
    name: "Comparison Table Static - Competitor Search",
    format: "Image",
    platform: "Google Ads",
    campaignId: "cmp-google-nonbrand",
    spend: 4200,
    impressions: 550000,
    ctr: 0.74,
    hookRate: 15,
    holdRate: 10,
    conversions: 21,
    revenue: 8000,
    daysLive: 26,
    fatigueScore: 68,
    primaryTag: "Fatigue Risk",
    secondaryTag: "Low CTR",
    status: "Needs refresh",
  },
];

/** One demo row per cell in each 3×2 ad grid sheet (see `CreativeVariantThumb` slice geometry). */
function makeAdGridCreativeAssets() {
  const campaignIds = [
    "cmp-meta-prospecting",
    "cmp-meta-retargeting",
    "cmp-google-brand",
    "cmp-google-nonbrand",
    "cmp-linkedin-abm",
    "cmp-youtube-retargeting",
  ];
  const formats = ["UGC", "Video", "Carousel", "Image"];
  const platforms = ["Meta Ads", "YouTube", "LinkedIn", "Google Ads"];
  const statuses = ["Scaling", "Efficient", "Monitoring", "Under review", "Needs refresh", "Efficient"];

  const rows: Array<{
    id: string;
    name: string;
    format: string;
    platform: string;
    campaignId: string;
    spend: number;
    impressions: number;
    ctr: number;
    hookRate: number;
    holdRate: number;
    conversions: number;
    revenue: number;
    daysLive: number;
    fatigueScore: number;
    primaryTag: string;
    secondaryTag: string;
    status: string;
    gridSheet: 1 | 2 | 3;
    gridVariant: number;
  }> = [];

  for (let sheet = 1; sheet <= 3; sheet += 1) {
    for (let v = 0; v < 6; v += 1) {
      const seed = sheet * 97 + v * 41;
      const spend = 900 + (seed % 11_800);
      const impressions = 185_000 + (seed % 980_000);
      const ctr = Math.round((0.35 + (seed % 190) / 100) * 100) / 100;
      const conversions = 14 + (seed % 220);
      const revenue = Math.round(spend * (1.75 + (seed % 55) / 22));

      rows.push({
        id: `cr-adgrid${sheet}-c${v}`,
        name: `Ad grid ${sheet} · Creative ${v + 1}`,
        format: formats[v % formats.length]!,
        platform: platforms[(sheet + v) % platforms.length]!,
        campaignId: campaignIds[seed % campaignIds.length]!,
        spend,
        impressions,
        ctr,
        hookRate: 16 + (seed % 34),
        holdRate: 11 + (seed % 27),
        conversions,
        revenue,
        daysLive: 4 + (seed % 32),
        fatigueScore: 14 + (seed % 72),
        primaryTag: "Grid inventory",
        secondaryTag: `Panel ${v + 1}`,
        status: statuses[seed % statuses.length]!,
        gridSheet: sheet as 1 | 2 | 3,
        gridVariant: v,
      });
    }
  }

  return rows;
}

const creativeAssets = [...creativeAssetsLegacy, ...makeAdGridCreativeAssets()];

/** Direct imports for pages that must not rely on composable return shape (e.g. Creatives table / allocation). */
export { performanceCampaigns, creativeAssets };

const audienceSegments = [
  {
    id: "aud-remarketing-30d",
    name: "Remarketing - Site Visitors 30D",
    type: "Remarketing",
    channel: "Meta Ads",
    geo: "Global",
    device: "Mixed",
    spend: 14200,
    leads: 356,
    sqls: 96,
    revenue: 104000,
    signal: "Top converting segment",
  },
  {
    id: "aud-sql-lookalike",
    name: "Lookalike - SQL Seed 5%",
    type: "Lookalike",
    channel: "Meta Ads",
    geo: "North America",
    device: "Mobile",
    spend: 13800,
    leads: 223,
    sqls: 69,
    revenue: 73000,
    signal: "Efficient scale",
  },
  {
    id: "aud-founder-interest",
    name: "Interest Stack - Founder-Led Ops",
    type: "Interests",
    channel: "LinkedIn",
    geo: "North America",
    device: "Mobile",
    spend: 11700,
    leads: 158,
    sqls: 44,
    revenue: 55000,
    signal: "Healthy mid-funnel",
  },
  {
    id: "aud-brand-search",
    name: "Search Intent - Brand + Competitor",
    type: "High intent",
    channel: "Google Ads",
    geo: "Global",
    device: "Desktop",
    spend: 11600,
    leads: 289,
    sqls: 88,
    revenue: 92000,
    signal: "High intent",
  },
  {
    id: "aud-nonbrand-broad",
    name: "Broad Non-Brand Workflow Terms",
    type: "Prospecting broad",
    channel: "Google Ads",
    geo: "North America",
    device: "Desktop",
    spend: 12400,
    leads: 142,
    sqls: 39,
    revenue: 54000,
    signal: "Stable",
  },
  {
    id: "aud-abm",
    name: "ABM Target Accounts",
    type: "Account list",
    channel: "LinkedIn",
    geo: "North America + UK",
    device: "Desktop",
    spend: 10100,
    leads: 62,
    sqls: 37,
    revenue: 28000,
    signal: "High spend low return",
  },
  {
    id: "aud-engagers-7d",
    name: "Video Engagers 7D",
    type: "Engagement",
    channel: "YouTube",
    geo: "Europe",
    device: "Mobile",
    spend: 6500,
    leads: 39,
    sqls: 9,
    revenue: 17000,
    signal: "Assist-heavy",
  },
  {
    id: "aud-youtube-visitors",
    name: "YouTube Viewers -> Site Visitors",
    type: "Remarketing",
    channel: "YouTube",
    geo: "Global",
    device: "CTV + mobile",
    spend: 4700,
    leads: 15,
    sqls: 4,
    revenue: 7000,
    signal: "Needs refresh",
  },
] as const;

const audienceDemographics = [
  { label: "25-34", spend: 29400, revenue: 160000 },
  { label: "35-44", spend: 25600, revenue: 138000 },
  { label: "45-54", spend: 14800, revenue: 78000 },
  { label: "18-24", spend: 5300, revenue: 18000 },
  { label: "55+", spend: 9900, revenue: 36000 },
] as const;

const audienceGeos = [
  { label: "North America", spend: 58000, revenue: 324000 },
  { label: "UK", spend: 11800, revenue: 56000 },
  { label: "Continental Europe", spend: 10500, revenue: 35000 },
  { label: "APAC", spend: 4700, revenue: 15000 },
] as const;

const audienceDevices = [
  { label: "Desktop", spend: 37500, revenue: 226000, cvr: 1.83 },
  { label: "Mobile", spend: 40600, revenue: 176000, cvr: 1.31 },
  { label: "Tablet", spend: 3600, revenue: 14000, cvr: 1.12 },
  { label: "CTV", spend: 3300, revenue: 14000, cvr: 0.92 },
] as const;

/** Direct imports for Audience page charts/tables (avoids composable return edge cases in SSR). */
export { audienceSegments, audienceDemographics, audienceGeos, audienceDevices };

const spendBudgetByWeek = [
  { label: "Wk 1", actual: 8900, budget: 9400, primaryDriver: "Meta prospecting", roas: 4.4 },
  { label: "Wk 2", actual: 9800, budget: 9800, primaryDriver: "Meta retargeting", roas: 4.6 },
  { label: "Wk 3", actual: 10100, budget: 10200, primaryDriver: "Google brand", roas: 4.9 },
  { label: "Wk 4", actual: 10400, budget: 10500, primaryDriver: "Meta prospecting", roas: 4.8 },
  { label: "Wk 5", actual: 10600, budget: 10800, primaryDriver: "Google non-brand", roas: 5.1 },
  { label: "Wk 6", actual: 11400, budget: 11000, primaryDriver: "Meta retargeting", roas: 5.1 },
  { label: "Wk 7", actual: 11700, budget: 11300, primaryDriver: "Meta prospecting", roas: 5.4 },
  { label: "Wk 8", actual: 12100, budget: 11500, primaryDriver: "Google brand", roas: 5.9 },
] as const;

const campaignPacing = [
  { id: "pace-1", campaign: "Meta Prospecting - Founder Narrative", channel: "Meta Ads", objective: "Demand generation", budget: 27000, actual: 28400, pace: 105, alert: "Overpacing" },
  { id: "pace-2", campaign: "Meta Retargeting - Site Visitors 30D", channel: "Meta Ads", objective: "Retargeting", budget: 13400, actual: 14200, pace: 106, alert: "Overpacing" },
  { id: "pace-3", campaign: "Google Brand Search - High Intent", channel: "Google Ads", objective: "Brand capture", budget: 12000, actual: 11600, pace: 97, alert: "On plan" },
  { id: "pace-4", campaign: "Google Non-Brand Search - Workflow Terms", channel: "Google Ads", objective: "Demand capture", budget: 12800, actual: 12400, pace: 97, alert: "On plan" },
  { id: "pace-5", campaign: "LinkedIn ABM - RevOps Target Accounts", channel: "LinkedIn", objective: "Pipeline creation", budget: 12400, actual: 10100, pace: 81, alert: "Underpacing" },
  { id: "pace-6", campaign: "YouTube Retargeting - Customer Proof", channel: "YouTube", objective: "Influence + nurture", budget: 8900, actual: 8300, pace: 93, alert: "Underpacing" },
] as const;

const signalQuality = [
  {
    id: "sig-match-rate",
    label: "CRM match rate",
    value: "94%",
    note: "Lead to opportunity stitching across Salesforce and Shopify.",
  },
  {
    id: "sig-attribution-confidence",
    label: "Attribution confidence",
    value: "0.82",
    note: "High confidence under hybrid multi-touch with 14-day click windows.",
  },
  {
    id: "sig-sync-lag",
    label: "Median sync lag",
    value: "1.2h",
    note: "Healthy for daily pacing and weekly board-level reporting.",
  },
  {
    id: "sig-offline-coverage",
    label: "Offline coverage",
    value: "88%",
    note: "Most sales-assisted revenue is mapped back to paid source clusters.",
  },
] as const;

function sumBy<T>(rows: readonly T[], pick: (row: T) => number) {
  return rows.reduce((total, row) => total + pick(row), 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`;
}

function formatMultiplier(value: number, digits = 1) {
  return `${value.toFixed(digits)}x`;
}

function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}k`;
  return formatNumber(value);
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}k`;
  return formatCurrency(value);
}

function channelVariant(channel: string): "info" | "success" | "warning" | "neutral" {
  switch (channel) {
    case "Meta Ads":
      return "info";
    case "Google Ads":
      return "success";
    case "LinkedIn":
      return "warning";
    default:
      return "neutral";
  }
}

function statusVariant(label: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (["Scaling", "Efficient", "Top performer", "On plan"].includes(label)) return "success";
  if (["Stable", "Monitoring", "Under review"].includes(label)) return "info";
  if (["Under target", "Fatiguing", "Underpacing"].includes(label)) return "warning";
  if (["Needs refresh", "Overpacing"].includes(label)) return "danger";
  return "neutral";
}

export function useDemoAnalytics() {
  const totals = computed(() => {
    const spend = sumBy(performanceCampaigns, (row) => row.spend);
    const impressions = sumBy(performanceCampaigns, (row) => row.impressions);
    const clicks = sumBy(performanceCampaigns, (row) => row.clicks);
    const leads = sumBy(performanceCampaigns, (row) => row.leads);
    const sqls = sumBy(performanceCampaigns, (row) => row.sqls);
    const purchases = sumBy(performanceCampaigns, (row) => row.purchases);
    const pipeline = sumBy(performanceCampaigns, (row) => row.pipeline);
    const revenue = sumBy(performanceCampaigns, (row) => row.revenue);

    return {
      spend,
      impressions,
      clicks,
      leads,
      sqls,
      purchases,
      pipeline,
      revenue,
      ctr: (clicks / impressions) * 100,
      cpc: spend / clicks,
      cvr: (leads / clicks) * 100,
      cpa: spend / leads,
      roas: revenue / spend,
      cac: spend / purchases,
      mer: revenue / spend,
    };
  });

  const performanceChannels = computed(() =>
    ["All", ...new Set(performanceCampaigns.map((row) => row.channel))],
  );

  const performanceRegions = computed(() =>
    ["All", ...new Set(performanceCampaigns.map((row) => row.region))],
  );

  const creativeFormats = computed(() =>
    ["All formats", ...new Set(creativeAssets.map((row) => row.format))],
  );

  const creativePlatforms = computed(() =>
    ["All platforms", ...new Set(creativeAssets.map((row) => row.platform))],
  );

  const audienceTypes = computed(() =>
    ["All segments", ...new Set(audienceSegments.map((row) => row.type))],
  );

  const audienceChannels = computed(() =>
    ["All", ...Array.from(new Set(audienceSegments.map((row) => row.channel))).sort((a, b) => a.localeCompare(b))],
  );

  const audienceRegions = computed(() =>
    ["All", ...Array.from(new Set(audienceSegments.map((row) => row.geo))).sort((a, b) => a.localeCompare(b))],
  );

  const audienceDevicesList = computed(() =>
    ["All devices", ...new Set(audienceSegments.map((row) => row.device))],
  );

  const spendChannels = computed(() =>
    ["All channels", ...new Set(campaignPacing.map((row) => row.channel))],
  );

  const spendObjectives = computed(() =>
    ["All objectives", ...new Set(campaignPacing.map((row) => row.objective))],
  );

  const outcomeSources = computed(() =>
    ["All sources", ...new Set(performanceCampaigns.map((row) => row.channel))],
  );

  const creativeFormatBreakdown = computed(() => {
    const grouped = new Map<string, { spend: number; revenue: number; conversions: number; avgCtrWeighted: number; impressions: number }>();

    creativeAssets.forEach((asset) => {
      const current = grouped.get(asset.format) ?? { spend: 0, revenue: 0, conversions: 0, avgCtrWeighted: 0, impressions: 0 };
      current.spend += asset.spend;
      current.revenue += asset.revenue;
      current.conversions += asset.conversions;
      current.avgCtrWeighted += asset.ctr * asset.impressions;
      current.impressions += asset.impressions;
      grouped.set(asset.format, current);
    });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      spend: value.spend,
      revenue: value.revenue,
      conversions: value.conversions,
      ctr: value.avgCtrWeighted / value.impressions,
      roas: value.revenue / value.spend,
    })).sort((left, right) => right.revenue - left.revenue);
  });

  const performanceChannelBreakdown = computed(() => {
    const grouped = new Map<string, { spend: number; revenue: number; leads: number; clicks: number }>();

    performanceCampaigns.forEach((campaign) => {
      const current = grouped.get(campaign.channel) ?? { spend: 0, revenue: 0, leads: 0, clicks: 0 };
      current.spend += campaign.spend;
      current.revenue += campaign.revenue;
      current.leads += campaign.leads;
      current.clicks += campaign.clicks;
      grouped.set(campaign.channel, current);
    });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      spend: value.spend,
      revenue: value.revenue,
      leads: value.leads,
      roas: value.revenue / value.spend,
      cpl: value.spend / value.leads,
    })).sort((left, right) => right.spend - left.spend);
  });

  const sourceOutcomes = computed(() =>
    performanceChannelBreakdown.value.map((row) => {
      const campaigns = performanceCampaigns.filter((campaign) => campaign.channel === row.label);
      return {
        source: row.label,
        leads: sumBy(campaigns, (campaign) => campaign.leads),
        sqls: sumBy(campaigns, (campaign) => campaign.sqls),
        purchases: sumBy(campaigns, (campaign) => campaign.purchases),
        pipeline: sumBy(campaigns, (campaign) => campaign.pipeline),
        revenue: sumBy(campaigns, (campaign) => campaign.revenue),
      };
    }),
  );

  const spendObjectiveBreakdown = computed(() => {
    const grouped = new Map<string, { spend: number; revenue: number }>();

    performanceCampaigns.forEach((campaign) => {
      const current = grouped.get(campaign.objective) ?? { spend: 0, revenue: 0 };
      current.spend += campaign.spend;
      current.revenue += campaign.revenue;
      grouped.set(campaign.objective, current);
    });

    return Array.from(grouped.entries()).map(([label, value]) => ({
      label,
      spend: value.spend,
      revenue: value.revenue,
      roas: value.revenue / value.spend,
    })).sort((left, right) => right.spend - left.spend);
  });

  const audienceComparisonCards = computed(() => [
    {
      title: "Top converting segment",
      value: "Remarketing - Site Visitors 30D",
      note: "2.51% CVR and the lowest CPA in the mix at $39.89.",
    },
    {
      title: "High spend low return",
      value: "ABM Target Accounts",
      note: "Strong pipeline influence, but direct ROAS is still below blended average.",
    },
    {
      title: "Desktop quality edge",
      value: "6.0x ROAS",
      note: "Desktop sessions carry the strongest post-click conversion quality.",
    },
    {
      title: "Overlap to watch",
      value: "18% between lookalikes and remarketing",
      note: "Frequency will climb quickly if Meta prospecting keeps scaling without exclusions.",
    },
  ]);

  const creativeInsights = computed(() => [
    {
      title: "Top creative cluster",
      value: "Founder-led UGC",
      note: "UGC and founder narrative assets are driving 53% of tracked creative revenue.",
    },
    {
      title: "Fatigue risk",
      value: "ROI Proof Static",
      note: "74 fatigue score after 29 days live and CTR below the account average.",
    },
    {
      title: "Format signal",
      value: "Carousel retargeting is quietly strong",
      note: "Carousel assets are delivering 5.2x ROAS with healthy post-click CVR.",
    },
  ]);

  const spendRecommendations = computed(() => [
    {
      title: "Trim LinkedIn ABM by 12%",
      body: "Current pace is 81% of plan with softer direct return. Keep spend focused on the highest-fit account list until win rate improves.",
    },
    {
      title: "Protect brand search capacity",
      body: "Google brand is the highest-ROAS campaign in the mix and should keep priority in any budget rebalance.",
    },
    {
      title: "Refresh YouTube proof assets",
      body: "Customer proof video still assists the funnel, but CTR and fatigue suggest creative rotation before additional budget.",
    },
  ]);

  return {
    reportingMeta,
    performanceCampaigns,
    performanceTrend,
    creativeAssets,
    audienceSegments,
    audienceDemographics,
    audienceGeos,
    audienceDevices,
    spendBudgetByWeek,
    campaignPacing,
    signalQuality,
    totals,
    performanceChannels,
    performanceRegions,
    creativeFormats,
    creativePlatforms,
    audienceTypes,
    audienceChannels,
    audienceRegions,
    audienceDevicesList,
    spendChannels,
    spendObjectives,
    outcomeSources,
    creativeFormatBreakdown,
    performanceChannelBreakdown,
    sourceOutcomes,
    spendObjectiveBreakdown,
    audienceComparisonCards,
    creativeInsights,
    spendRecommendations,
    formatNumber,
    formatPercent,
    formatMultiplier,
    formatCurrency,
    formatCompactNumber,
    formatCompactCurrency,
    channelVariant,
    statusVariant,
  };
}
