import type {
  OverviewWidgetDimension,
  OverviewWidgetMetric,
  OverviewWidgetSource,
  OverviewWidgetVisualization,
  SolvomoMockBundle,
  SolvomoUserId,
} from "~/types/mock";

/**
 * Central mock source for the Solvomo internal demo.
 * Login: neel@solvomo.co (completed) · riya@solvomo.co (onboarding path)
 * Password: any non-empty string.
 */
export const DEMO_PASSWORD_HINT = "Any password works in this preview.";

export const MOCK_USERS: Record<SolvomoUserId, SolvomoMockBundle> = {
  neel: {
    profile: {
      id: "neel",
      name: "Neel Dandiwala",
      email: "neel@solvomo.co",
      title: "Head of Growth",
    },
    workspaces: [{ id: "ws-neel", name: "Solvomo — Core" }],
    brands: [
      {
        id: "bp-neel-1",
        name: "Solvomo Product",
        workspaceId: "ws-neel",
        currency: "USD",
        attributionPreference: "Multi-touch, last non-direct",
      },
      {
        id: "bp-neel-2",
        name: "Solvomo Labs (sandbox brand)",
        workspaceId: "ws-neel",
        currency: "USD",
        attributionPreference: "First touch",
      },
    ],
    environments: [
      { id: "env-neel-p1", name: "Production", brandProfileId: "bp-neel-1", kind: "production" },
      { id: "env-neel-g1", name: "Playground", brandProfileId: "bp-neel-1", kind: "playground" },
      { id: "env-neel-p2", name: "Production", brandProfileId: "bp-neel-2", kind: "production" },
      { id: "env-neel-g2", name: "Playground", brandProfileId: "bp-neel-2", kind: "playground" },
    ],
    onboardingDefaults: ["survey", "brand", "connections"],
    overviewHero: {
      periodSpend: "$85.0k",
      attributedRevenue: "$430k",
      roi: "2.6x (blended)",
      cac: "$165",
      workingBullets: [
        "UGC founder story holding efficiency on Meta prospecting.",
        "Brand search capturing high-intent demand with stable CAC.",
        "Retargeting pool delivering strongest modeled ROI this month.",
      ],
      fixBullets: [
        "EU broad cell: watch frequency before increasing spend.",
        "Google offline conversions delayed — CRM stages may lag.",
        "One static creative fatiguing; swap in Lab-tested variant.",
      ],
    },
    overview: {
      kpis: [
        { id: "spend", label: "Total spend", value: "$85.0k", change: "+8.4% vs prior", tone: "neutral", source: "spend_data", helper: "Paid media + tracked external spend" },
        { id: "revenue", label: "Attributed revenue", value: "$430k", change: "+14.2% vs prior", tone: "positive", source: "crm_data", helper: "Multi-touch attributed closed revenue" },
        { id: "roi", label: "ROI / ROAS", value: "2.6x", change: "+0.3x vs prior", tone: "positive", source: "summary", helper: "Revenue divided by tracked spend" },
        { id: "cac", label: "CAC", value: "$165", change: "-7.1% vs prior", tone: "positive", source: "summary", helper: "Blended acquisition cost" },
        { id: "qualified_leads", label: "Qualified leads", value: "386", change: "+11.6% vs prior", tone: "positive", source: "crm_data", helper: "CRM-qualified this period" },
        { id: "pipeline", label: "Pipeline revenue", value: "$690k", change: "+9.8% vs prior", tone: "positive", source: "crm_data", helper: "Open qualified pipeline" },
      ],
      insights: [
        {
          id: "ins-1",
          title: "Meta is carrying incremental revenue this week",
          summary: "Meta prospecting is contributing the highest attributed revenue while holding blended CAC below target.",
          tone: "product",
          linkLabel: "Open Performance",
          linkTo: "/app/performance",
        },
        {
          id: "ins-2",
          title: "Google spend increased faster than conversion quality",
          summary: "Search spend rose 18% but closed revenue did not keep pace. Review brand + competitor terms before scaling further.",
          tone: "depth",
          linkLabel: "Open Spend",
          linkTo: "/app/spend",
        },
        {
          id: "ins-3",
          title: "Creator-led creative cluster is outperforming product explainer cuts",
          summary: "Founder and customer-story creative is leading ROI across the active Meta prospecting cells.",
          tone: "brand",
          linkLabel: "Open Creatives",
          linkTo: "/app/creatives",
        },
        {
          id: "ins-4",
          title: "CRM outcomes are closing the loop cleanly",
          summary: "Qualified leads and closed revenue are syncing reliably across the active brand profile, giving confidence to budget decisions.",
          tone: "product",
          linkLabel: "Open CRM / Outcomes",
          linkTo: "/app/crm",
        },
      ],
      trendPoints: [
        { date: "Mar 04", spend: 10.8, revenue: 49, qualifiedLeads: 43, deals: 7, pipelineRevenue: 88, closedRevenue: 42 },
        { date: "Mar 05", spend: 11.3, revenue: 53, qualifiedLeads: 46, deals: 8, pipelineRevenue: 93, closedRevenue: 47 },
        { date: "Mar 06", spend: 12.1, revenue: 58, qualifiedLeads: 51, deals: 9, pipelineRevenue: 98, closedRevenue: 53 },
        { date: "Mar 07", spend: 11.9, revenue: 61, qualifiedLeads: 55, deals: 10, pipelineRevenue: 102, closedRevenue: 60 },
        { date: "Mar 08", spend: 12.8, revenue: 64, qualifiedLeads: 57, deals: 10, pipelineRevenue: 105, closedRevenue: 62 },
        { date: "Mar 09", spend: 13.4, revenue: 69, qualifiedLeads: 63, deals: 11, pipelineRevenue: 108, closedRevenue: 68 },
        { date: "Mar 10", spend: 12.7, revenue: 76, qualifiedLeads: 71, deals: 12, pipelineRevenue: 116, closedRevenue: 76 },
      ],
      platformSummaries: [
        { platform: "Meta Ads", spend: 42.8, revenue: 168, roi: 3.9, ctr: 1.42, conversions: 182, qualifiedLeads: 171, deals: 41, efficiencyLabel: "Top performing" },
        { platform: "Google Ads", spend: 24.0, revenue: 118, roi: 2.2, ctr: 0.91, conversions: 96, qualifiedLeads: 103, deals: 31, efficiencyLabel: "Under watch" },
        { platform: "LinkedIn", spend: 8.7, revenue: 46, roi: 1.8, ctr: 0.62, conversions: 28, qualifiedLeads: 52, deals: 9, efficiencyLabel: "Influencing pipeline" },
        { platform: "Other tracked spend", spend: 9.5, revenue: 98, roi: 2.6, ctr: 0.0, conversions: 0, qualifiedLeads: 60, deals: 18, efficiencyLabel: "Closing support" },
      ],
      leadSourceSummaries: [
        { source: "Meta prospecting", leads: 214, qualifiedLeads: 171, deals: 41, revenue: 168 },
        { source: "Google brand + search", leads: 118, qualifiedLeads: 103, deals: 31, revenue: 118 },
        { source: "LinkedIn paid social", leads: 64, qualifiedLeads: 52, deals: 9, revenue: 46 },
        { source: "Lifecycle / CRM influenced", leads: 73, qualifiedLeads: 60, deals: 18, revenue: 98 },
      ],
      spendRecords: [
        { id: "sr-1", date: "Mar 05", channel: "Paid social", vendor: "Meta Ads", category: "Media", amount: 18.2 },
        { id: "sr-2", date: "Mar 05", channel: "Paid search", vendor: "Google Ads", category: "Media", amount: 11.6 },
        { id: "sr-3", date: "Mar 06", channel: "Paid social", vendor: "LinkedIn", category: "Media", amount: 4.1 },
        { id: "sr-4", date: "Mar 07", channel: "Creative production", vendor: "Creator network", category: "External spend", amount: 6.8 },
        { id: "sr-5", date: "Mar 08", channel: "Offline events", vendor: "Field marketing", category: "External spend", amount: 3.9 },
        { id: "sr-6", date: "Mar 09", channel: "Paid social", vendor: "Meta Ads", category: "Media", amount: 20.4 },
      ],
      campaignClusters: [
        { cluster: "Prospecting", spend: 42.8, revenue: 168, roi: 3.9 },
        { cluster: "Retargeting", spend: 18.2, revenue: 91, roi: 5.0 },
        { cluster: "Brand search", spend: 13.4, revenue: 74, roi: 5.5 },
        { cluster: "Scale tests", spend: 10.6, revenue: 31, roi: 2.9 },
      ],
      funnel: [
        { stage: "Impressions", value: 4600 },
        { stage: "Clicks", value: 1210 },
        { stage: "Leads", value: 469 },
        { stage: "Qualified", value: 386 },
        { stage: "Deals", value: 99 },
      ],
      connectionsSummary: {
        connected: 2,
        syncing: 1,
        attention: 0,
      },
      widgets: [
        { id: "w-kpi-spend", title: "Total spend", description: "Tracked spend across connected media and uploaded spend sources.", source: "spend_data", visualization: "kpi", datasetKey: "kpis", metric: "spend", size: "xs" },
        { id: "w-kpi-revenue", title: "Attributed revenue", description: "Closed revenue attributed to this brand profile.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "revenue", size: "xs" },
        { id: "w-kpi-roi", title: "ROI / ROAS", description: "Blended efficiency across connected spend and outcomes.", source: "summary", visualization: "kpi", datasetKey: "kpis", metric: "roi", size: "xs" },
        { id: "w-kpi-cac", title: "CAC", description: "Blended acquisition cost for the selected period.", source: "summary", visualization: "kpi", datasetKey: "kpis", metric: "cac", size: "xs" },
        { id: "w-kpi-qualified", title: "Qualified leads", description: "CRM-qualified leads influenced by connected media.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "qualified_leads", size: "xs" },
        { id: "w-kpi-pipeline", title: "Pipeline revenue", description: "Open qualified pipeline tied back to sources.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "pipeline_revenue", size: "xs" },
        { id: "w-trend-spend-revenue", title: "Spend vs Revenue over time", description: "Daily spend against attributed revenue for the last seven days.", source: "summary", visualization: "area", datasetKey: "trendPoints", metric: "revenue", dimension: "date", size: "lg" },
        { id: "w-platform-revenue", title: "Revenue by platform", description: "Attributed revenue contribution across paid channels.", source: "ad_data", visualization: "bar", datasetKey: "platformSummaries", metric: "revenue", dimension: "platform", size: "md" },
        { id: "w-lead-source", title: "Lead source attribution", description: "Qualified lead and deal mix by lead source.", source: "crm_data", visualization: "donut", datasetKey: "leadSourceSummaries", metric: "qualified_leads", dimension: "lead_source", size: "md" },
        { id: "w-spend-allocation", title: "Spend allocation", description: "Where money is going across media and external spend categories.", source: "spend_data", visualization: "stacked_bar", datasetKey: "spendRecords", metric: "amount", dimension: "channel", size: "md" },
        { id: "w-funnel", title: "Funnel snapshot", description: "From impressions to qualified deals for the current reporting window.", source: "crm_data", visualization: "bar", datasetKey: "funnel", metric: "qualified_leads", dimension: "date", size: "md" },
        { id: "w-insights", title: "What is happening right now", description: "Signals that explain what is working and where to look next.", source: "summary", visualization: "insights", datasetKey: "insights", size: "full" },
        { id: "w-alerts", title: "Recent alerts", description: "Highest-priority alerts surfaced from connected sources.", source: "alerts", visualization: "alerts", datasetKey: "alerts", size: "md" },
        { id: "w-connections", title: "Connection posture", description: "Overview of connected, syncing, and missing sources.", source: "connections", visualization: "connections", datasetKey: "connectionsSummary", size: "sm" },
        { id: "w-roi-cluster", title: "ROI by campaign cluster", description: "Efficiency comparison across active campaign groups.", source: "ad_data", visualization: "bar", datasetKey: "campaignClusters", metric: "roi", dimension: "campaign_cluster", size: "md" },
        { id: "w-spend-table", title: "Spend records", description: "Recent tracked spend rows across vendors and categories.", source: "spend_data", visualization: "table", datasetKey: "spendRecords", metric: "amount", dimension: "vendor", size: "full" },
      ],
      dashboards: [
        {
          id: "db-neel-default",
          name: "Executive command center",
          description: "Default operating dashboard for Solvomo leadership and budget review.",
          widgetIds: [
            "w-kpi-spend",
            "w-kpi-revenue",
            "w-kpi-roi",
            "w-kpi-cac",
            "w-kpi-qualified",
            "w-kpi-pipeline",
            "w-trend-spend-revenue",
            "w-platform-revenue",
            "w-lead-source",
            "w-spend-allocation",
            "w-funnel",
            "w-insights",
            "w-alerts",
            "w-connections",
          ],
          isDefault: true,
        },
        {
          id: "db-neel-operator",
          name: "Operator cockpit",
          description: "More tactical view for daily channel and cluster management.",
          widgetIds: [
            "w-kpi-spend",
            "w-kpi-roi",
            "w-trend-spend-revenue",
            "w-roi-cluster",
            "w-platform-revenue",
            "w-alerts",
            "w-spend-table",
          ],
        },
      ],
    },
    connectionsShell: [
      { id: "meta", name: "Meta Ads", description: "Campaigns, sets, creatives, delivery.", status: "connected" },
      { id: "google", name: "Google Ads", description: "Search, PMax, YouTube.", status: "connecting" },
      { id: "shopify", name: "Shopify / CRM", description: "Orders, pipeline, revenue events.", status: "connected" },
      { id: "csv", name: "CSV upload", description: "Manual structured feeds.", status: "not_connected" },
    ],
    connectionsOnboarding: [
      { id: "meta", name: "Meta Ads", description: "Campaigns, spend, delivery metrics.", status: "connected" },
      { id: "google", name: "Google Ads", description: "Search and PMax performance.", status: "connecting" },
      { id: "shopify", name: "Shopify / CRM", description: "Revenue and lifecycle.", status: "connected" },
      { id: "csv", name: "CSV upload", description: "Offline ledger or creative metadata.", status: "not_connected" },
    ],
    alerts: [
      {
        id: "n-al-1",
        title: "Spend up, modeled ROI softened",
        summary:
          "Paid social spend is up week-over-week while modeled ROI drifted down. Review the two prospecting cells in Meta before increasing budget.",
        severity: "warning",
        status: "open",
        createdAt: "Today · 08:40",
      },
      {
        id: "n-al-2",
        title: "Creative outperforming cohort",
        summary:
          "The UGC testimonial cut is leading engagement within this brand profile. Validate scale in Lab with a capped test cell.",
        severity: "info",
        status: "open",
        createdAt: "Yesterday · 15:12",
      },
      {
        id: "n-al-3",
        title: "Google Ads — conversion lag",
        summary:
          "Offline conversion imports are delayed ~6h. CRM stages may look stale until the sync clears.",
        severity: "critical",
        status: "acknowledged",
        createdAt: "Mon · 10:05",
      },
    ],
    labVersions: [
      {
        id: "nv1",
        name: "Efficiency pass — March",
        budget: "Hold flat",
        platform: "Meta Ads",
        expectedRoi: "1.9–2.4x (band)",
        confidence: "Medium",
        status: "ready",
      },
      {
        id: "nv2",
        name: "Creative rotation v4",
        budget: "+12% test",
        platform: "Meta + Google",
        expectedRoi: "2.0–2.6x (band)",
        confidence: "Medium-high",
        status: "draft",
      },
      {
        id: "nv3",
        name: "Live baseline",
        budget: "As deployed",
        platform: "Multi",
        expectedRoi: "Reported in prod",
        confidence: "High",
        status: "deployed",
      },
    ],
    performance: {
      campaigns: [
        {
          id: "nc1",
          name: "Prospecting — category terms",
          platform: "Meta Ads",
          spend: "$42.8k",
          revenue: "$118k",
          roi: "2.8x",
          status: "Active",
        },
        {
          id: "nc2",
          name: "Retargeting — site + cart",
          platform: "Meta Ads",
          spend: "$18.2k",
          revenue: "$61k",
          roi: "3.4x",
          status: "Active",
        },
        {
          id: "nc3",
          name: "Search — brand + competitor",
          platform: "Google Ads",
          spend: "$24.0k",
          revenue: "$52k",
          roi: "2.2x",
          status: "Active",
        },
      ],
      ad_groups: [
        {
          id: "ng1",
          name: "US — broad + interest stacks",
          platform: "Meta Ads",
          spend: "$21.4k",
          revenue: "$58k",
          roi: "2.7x",
          status: "Active",
        },
        {
          id: "ng2",
          name: "EU — lookalike seed",
          platform: "Meta Ads",
          spend: "$12.1k",
          revenue: "$31k",
          roi: "2.6x",
          status: "Learning",
        },
      ],
      ads: [
        {
          id: "nd1",
          name: "UGC — founder story 15s",
          platform: "Meta Ads",
          spend: "$9.8k",
          revenue: "$34k",
          roi: "3.5x",
          status: "Active",
        },
        {
          id: "nd2",
          name: "Static — value prop v5",
          platform: "Meta Ads",
          spend: "$6.2k",
          revenue: "$14k",
          roi: "2.3x",
          status: "Active",
        },
      ],
    },
    creatives: [
      {
        id: "ncr1",
        name: "UGC — founder story 15s",
        platform: "Meta Ads",
        hook: "Trust + momentum",
        ctr: "1.42%",
        conversion: "3.8%",
        roi: "3.5x",
      },
      {
        id: "ncr2",
        name: "Product UI walkthrough",
        platform: "Google Ads",
        hook: "Clarity of outcome",
        ctr: "0.91%",
        conversion: "2.9%",
        roi: "2.1x",
      },
      {
        id: "ncr3",
        name: "Offer card — trial extension",
        platform: "Meta Ads",
        hook: "Risk reversal",
        ctr: "1.05%",
        conversion: "—",
        roi: "—",
      },
    ],
    audience: [
      {
        id: "na1",
        audience: "High-intent site visitors (7d)",
        platform: "Meta Ads",
        spend: "$14.2k",
        roi: "3.1x",
        performance: "Scaling",
      },
      {
        id: "na2",
        audience: "Lifecycle — post-demo",
        platform: "Google Ads",
        spend: "$8.4k",
        roi: "2.4x",
        performance: "Stable",
      },
    ],
    spend: [
      { id: "ns1", channel: "Paid social", spend: "$61.0k", revenue: "$179k", cac: "$142", roi: "2.9x" },
      { id: "ns2", channel: "Paid search", spend: "$24.0k", revenue: "$52k", cac: "$198", roi: "2.2x" },
    ],
    crm: [
      {
        id: "no1",
        lead_source: "Paid social — prospecting",
        deals: "84",
        revenue: "$312k",
        attribution: "Multi-touch (brand profile)",
      },
      {
        id: "no2",
        lead_source: "Paid search — brand",
        deals: "31",
        revenue: "$118k",
        attribution: "Multi-touch (brand profile)",
      },
    ],
  },

  riya: {
    profile: {
      id: "riya",
      name: "Riya Aggarwal",
      email: "riya@solvomo.co",
      title: "Growth Lead",
    },
    workspaces: [{ id: "ws-riya", name: "Brightline Commerce" }],
    brands: [
      {
        id: "bp-riya-1",
        name: "Brightline DTC",
        workspaceId: "ws-riya",
        currency: "USD",
        attributionPreference: "Last non-direct click",
      },
    ],
    environments: [
      { id: "env-riya-p", name: "Production", brandProfileId: "bp-riya-1", kind: "production" },
      { id: "env-riya-g", name: "Playground", brandProfileId: "bp-riya-1", kind: "playground" },
    ],
    onboardingDefaults: [],
    overviewHero: {
      periodSpend: "—",
      attributedRevenue: "—",
      roi: "—",
      cac: "—",
      workingBullets: [
        "Connect Meta and CRM to surface durable winners.",
        "Finish Shopify mapping so outcomes close the loop.",
        "Use Lab to stage your first controlled test.",
      ],
      fixBullets: [
        "No blocking issues yet — finish connections to enable alerts.",
        "Brand profile attribution is set — validate when data flows.",
        "Playground is available for safe experiments.",
      ],
    },
    overview: {
      kpis: [
        { id: "spend", label: "Total spend", value: "—", change: "Awaiting sources", tone: "neutral", source: "spend_data", helper: "Connect spend sources to populate" },
        { id: "revenue", label: "Attributed revenue", value: "—", change: "Awaiting CRM sync", tone: "neutral", source: "crm_data", helper: "Closed revenue appears after CRM mapping" },
        { id: "roi", label: "ROI / ROAS", value: "—", change: "Insufficient data", tone: "neutral", source: "summary", helper: "Needs spend + revenue" },
        { id: "cac", label: "CAC", value: "—", change: "Insufficient data", tone: "neutral", source: "summary", helper: "Needs connected outcomes" },
        { id: "qualified_leads", label: "Qualified leads", value: "12", change: "Pilot stage", tone: "neutral", source: "crm_data", helper: "Limited CRM mapping so far" },
        { id: "pipeline", label: "Pipeline revenue", value: "$18k", change: "Early signal", tone: "positive", source: "crm_data", helper: "Open opportunities influenced by setup work" },
      ],
      insights: [
        {
          id: "ri-ins-1",
          title: "Finish Meta and CRM to unlock the full dashboard",
          summary: "The overview will become richer once ad delivery and CRM outcomes are both connected for this brand profile.",
          tone: "product",
          linkLabel: "Open Connections",
          linkTo: "/app/connections",
        },
        {
          id: "ri-ins-2",
          title: "Spend tracking is still incomplete",
          summary: "Custom spend uploads can close the gap between paid media costs and operational spend that affects CAC.",
          tone: "depth",
          linkLabel: "Open Spend",
          linkTo: "/app/spend",
        },
      ],
      trendPoints: [
        { date: "Mar 04", spend: 0.0, revenue: 0.0, qualifiedLeads: 1, deals: 0, pipelineRevenue: 2, closedRevenue: 0 },
        { date: "Mar 05", spend: 0.4, revenue: 0.0, qualifiedLeads: 1, deals: 0, pipelineRevenue: 2, closedRevenue: 0 },
        { date: "Mar 06", spend: 0.6, revenue: 0.0, qualifiedLeads: 2, deals: 0, pipelineRevenue: 3, closedRevenue: 0 },
        { date: "Mar 07", spend: 0.7, revenue: 0.0, qualifiedLeads: 2, deals: 1, pipelineRevenue: 4, closedRevenue: 0 },
        { date: "Mar 08", spend: 0.8, revenue: 0.0, qualifiedLeads: 2, deals: 1, pipelineRevenue: 3, closedRevenue: 0 },
        { date: "Mar 09", spend: 1.0, revenue: 0.0, qualifiedLeads: 2, deals: 1, pipelineRevenue: 2, closedRevenue: 0 },
        { date: "Mar 10", spend: 1.1, revenue: 0.0, qualifiedLeads: 2, deals: 1, pipelineRevenue: 2, closedRevenue: 0 },
      ],
      platformSummaries: [
        { platform: "Meta Ads", spend: 1.1, revenue: 0.0, roi: 0.0, ctr: 0.64, conversions: 0, qualifiedLeads: 3, deals: 1, efficiencyLabel: "Needs scale" },
        { platform: "Google Ads", spend: 0.0, revenue: 0.0, roi: 0.0, ctr: 0.0, conversions: 0, qualifiedLeads: 0, deals: 0, efficiencyLabel: "Not connected" },
      ],
      leadSourceSummaries: [
        { source: "Paid social", leads: 5, qualifiedLeads: 3, deals: 1, revenue: 0 },
        { source: "CRM influenced", leads: 7, qualifiedLeads: 9, deals: 1, revenue: 18 },
      ],
      spendRecords: [
        { id: "ri-sr-1", date: "Mar 09", channel: "Paid social", vendor: "Meta Ads", category: "Media", amount: 1.1 },
      ],
      campaignClusters: [
        { cluster: "Pilot prospecting", spend: 1.1, revenue: 0, roi: 0 },
      ],
      funnel: [
        { stage: "Impressions", value: 240 },
        { stage: "Clicks", value: 34 },
        { stage: "Leads", value: 12 },
        { stage: "Qualified", value: 9 },
        { stage: "Deals", value: 1 },
      ],
      connectionsSummary: {
        connected: 0,
        syncing: 1,
        attention: 0,
      },
      widgets: [
        { id: "ri-kpi-spend", title: "Total spend", description: "Spend will populate as sources connect.", source: "spend_data", visualization: "kpi", datasetKey: "kpis", metric: "spend", size: "xs" },
        { id: "ri-kpi-revenue", title: "Attributed revenue", description: "Revenue appears after CRM mapping is complete.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "revenue", size: "xs" },
        { id: "ri-kpi-qualified", title: "Qualified leads", description: "Current pipeline-qualified lead count.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "qualified_leads", size: "xs" },
        { id: "ri-kpi-pipeline", title: "Pipeline revenue", description: "Current open pipeline signal.", source: "crm_data", visualization: "kpi", datasetKey: "kpis", metric: "pipeline_revenue", size: "xs" },
        { id: "ri-trend", title: "Setup trend", description: "Early-stage spend and lead signals during onboarding.", source: "summary", visualization: "line", datasetKey: "trendPoints", metric: "qualified_leads", dimension: "date", size: "lg" },
        { id: "ri-insights", title: "Setup summary", description: "What to finish next to unlock the full overview.", source: "summary", visualization: "insights", datasetKey: "insights", size: "full" },
        { id: "ri-connections", title: "Connection posture", description: "Connected sources and syncing status.", source: "connections", visualization: "connections", datasetKey: "connectionsSummary", size: "sm" },
      ],
      dashboards: [
        {
          id: "db-riya-default",
          name: "Getting started",
          description: "Early dashboard focused on setup progress and emerging signals.",
          widgetIds: [
            "ri-kpi-spend",
            "ri-kpi-revenue",
            "ri-kpi-qualified",
            "ri-kpi-pipeline",
            "ri-trend",
            "ri-insights",
            "ri-connections",
          ],
          isDefault: true,
        },
      ],
    },
    connectionsShell: [
      { id: "meta", name: "Meta Ads", description: "Campaigns, sets, creatives, delivery.", status: "not_connected" },
      { id: "google", name: "Google Ads", description: "Search, PMax, YouTube.", status: "not_connected" },
      { id: "shopify", name: "Shopify / CRM", description: "Orders and lifecycle.", status: "connecting" },
      { id: "csv", name: "CSV upload", description: "Structured manual imports.", status: "not_connected" },
    ],
    connectionsOnboarding: [
      { id: "meta", name: "Meta Ads", description: "Campaigns, spend, delivery metrics.", status: "not_connected" },
      { id: "google", name: "Google Ads", description: "Search and PMax.", status: "not_connected" },
      { id: "shopify", name: "Shopify / CRM", description: "Revenue alignment.", status: "connecting" },
      { id: "csv", name: "CSV upload", description: "Optional offline feed.", status: "not_connected" },
    ],
    alerts: [
      {
        id: "r-al-1",
        title: "Finish Shopify / CRM mapping",
        summary:
          "Lifecycle stages are not fully mapped to Solvomo outcomes yet. Complete mapping to unlock CRM / Outcomes and cleaner alerts.",
        severity: "info",
        status: "open",
        createdAt: "Today · 11:20",
      },
    ],
    labVersions: [
      {
        id: "rv1",
        name: "First draft — awareness",
        budget: "TBD",
        platform: "—",
        expectedRoi: "—",
        confidence: "Low (no history)",
        status: "draft",
      },
    ],
    performance: {
      campaigns: [
        {
          id: "rc1",
          name: "Spring prospecting",
          platform: "Meta Ads",
          spend: "—",
          revenue: "—",
          roi: "—",
          status: "Paused",
        },
      ],
      ad_groups: [
        {
          id: "rg1",
          name: "US — testing",
          platform: "Meta Ads",
          spend: "—",
          revenue: "—",
          roi: "—",
          status: "Paused",
        },
      ],
      ads: [
        {
          id: "rd1",
          name: "Static — hero v1",
          platform: "Meta Ads",
          spend: "—",
          revenue: "—",
          roi: "—",
          status: "Review",
        },
      ],
    },
    creatives: [
      {
        id: "rcr1",
        name: "Static — hero v1",
        platform: "Meta Ads",
        hook: "Brand + offer",
        ctr: "—",
        conversion: "—",
        roi: "—",
      },
    ],
    audience: [
      {
        id: "ra1",
        audience: "Site visitors (pixel pending)",
        platform: "Meta Ads",
        spend: "—",
        roi: "—",
        performance: "Not live",
      },
    ],
    spend: [
      { id: "rs1", channel: "Paid social", spend: "—", revenue: "—", cac: "—", roi: "—" },
    ],
    crm: [
      {
        id: "ro1",
        lead_source: "Paid social",
        deals: "—",
        revenue: "—",
        attribution: "Awaiting CRM sync",
      },
    ],
  },
};

export function resolveUserIdFromEmail(email: string): SolvomoUserId | null {
  const e = email.trim().toLowerCase();
  if (e === MOCK_USERS.neel.profile.email.toLowerCase()) return "neel";
  if (e === MOCK_USERS.riya.profile.email.toLowerCase()) return "riya";
  return null;
}

export function getMockBundle(userId: SolvomoUserId): SolvomoMockBundle {
  return MOCK_USERS[userId];
}

export const OVERVIEW_WIDGET_SOURCE_OPTIONS: Array<{
  id: OverviewWidgetSource;
  label: string;
  description: string;
  metrics: OverviewWidgetMetric[];
  dimensions: OverviewWidgetDimension[];
  visualizations: OverviewWidgetVisualization[];
}> = [
  {
    id: "ad_data",
    label: "Ad data",
    description: "Connected ad-platform performance, revenue, and efficiency metrics.",
    metrics: ["spend", "revenue", "roi", "impressions", "clicks", "ctr", "conversions"],
    dimensions: ["date", "platform", "campaign_cluster"],
    visualizations: ["bar", "line", "area", "stacked_bar", "table", "kpi"],
  },
  {
    id: "crm_data",
    label: "CRM / outcomes",
    description: "Lead, deal, pipeline, and closed revenue data from CRM integrations.",
    metrics: ["qualified_leads", "deals", "pipeline_revenue", "closed_revenue", "revenue"],
    dimensions: ["date", "lead_source", "platform"],
    visualizations: ["bar", "line", "area", "donut", "table", "kpi"],
  },
  {
    id: "spend_data",
    label: "Spend data",
    description: "Custom spend uploads and tracked external spend beyond ad platforms.",
    metrics: ["amount", "spend"],
    dimensions: ["date", "channel", "vendor"],
    visualizations: ["bar", "line", "stacked_bar", "table", "kpi", "donut"],
  },
];

export const OVERVIEW_VISUALIZATION_LABELS: Record<OverviewWidgetVisualization, string> = {
  kpi: "KPI stat card",
  bar: "Bar chart",
  line: "Line chart",
  area: "Area chart",
  donut: "Donut chart",
  table: "Table",
  stacked_bar: "Stacked bar",
  insights: "Insight strip",
  connections: "Connections summary",
  alerts: "Alerts preview",
};
