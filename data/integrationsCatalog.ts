/**
 * Integrations directory (demo): categories, copy, and optional `shellKey`
 * to align with `connectionsShell` / `useAppData` when present.
 */
export type IntegrationCategoryId = "ads" | "analytics" | "crm" | "accounting";

export type IntegrationUiStatus = "connected" | "connecting" | "not_connected" | "coming_soon";

export interface IntegrationCatalogEntry {
  id: string;
  /** Key on workspace connection records (meta, google, …) when applicable. */
  shellKey?: string;
  name: string;
  description: string;
  category: IntegrationCategoryId;
  /** When true, UI shows Coming Soon regardless of shell (unless you remove it). */
  comingSoon?: boolean;
}

export const integrationCategories: Array<{ id: IntegrationCategoryId; label: string; hint: string }> = [
  { id: "ads", label: "Ads", hint: "Paid media & ad platforms" },
  { id: "analytics", label: "Analytics", hint: "Behavior & measurement" },
  { id: "crm", label: "CRM", hint: "Pipeline & customer records" },
  { id: "accounting", label: "Accounting / Spend", hint: "Finance & card spend" },
];

export const integrationsCatalog: IntegrationCatalogEntry[] = [
  // Ads
  { id: "int-meta", shellKey: "meta", name: "Meta Ads", description: "Campaigns, ad sets, creatives, delivery.", category: "ads" },
  { id: "int-google", shellKey: "google", name: "Google Ads", description: "Search, Performance Max, Demand Gen.", category: "ads" },
  { id: "int-tiktok", name: "TikTok Ads", description: "Short-form video and catalog ads.", category: "ads", comingSoon: true },
  { id: "int-linkedin", name: "LinkedIn Ads", description: "B2B targeting and lead forms.", category: "ads", comingSoon: true },
  { id: "int-pinterest", name: "Pinterest Ads", description: "Visual discovery and shopping.", category: "ads", comingSoon: true },
  { id: "int-snapchat", name: "Snapchat Ads", description: "Full-funnel AR and video.", category: "ads", comingSoon: true },
  { id: "int-x", name: "X Ads", description: "Social and performance campaigns.", category: "ads", comingSoon: true },
  { id: "int-reddit", name: "Reddit Ads", description: "Community and interest targeting.", category: "ads", comingSoon: true },
  { id: "int-amazon", name: "Amazon Ads", description: "Sponsored products and DSP.", category: "ads", comingSoon: true },
  // Analytics
  { id: "int-ga4", name: "Google Analytics 4", description: "Web & app events, audiences, BigQuery export.", category: "analytics" },
  { id: "int-mixpanel", name: "Mixpanel", description: "Product analytics and cohorts.", category: "analytics", comingSoon: true },
  { id: "int-amplitude", name: "Amplitude", description: "Behavioral taxonomy and experimentation.", category: "analytics", comingSoon: true },
  { id: "int-segment", name: "Segment", description: "Customer data pipeline and destinations.", category: "analytics", comingSoon: true },
  { id: "int-looker", name: "Looker Studio", description: "Dashboards on BigQuery and connectors.", category: "analytics", comingSoon: true },
  // CRM
  { id: "int-hubspot", name: "HubSpot", description: "Marketing, sales, and service CRM.", category: "crm", comingSoon: true },
  { id: "int-salesforce", name: "Salesforce", description: "Enterprise CRM and Revenue Cloud.", category: "crm", comingSoon: true },
  { id: "int-pipedrive", name: "Pipedrive", description: "Pipeline-first CRM.", category: "crm", comingSoon: true },
  { id: "int-zoho", name: "Zoho CRM", description: "Sales automation and journeys.", category: "crm", comingSoon: true },
  { id: "int-close", name: "Close", description: "High-velocity sales CRM.", category: "crm", comingSoon: true },
  { id: "int-copper", name: "Copper", description: "Gmail-native CRM.", category: "crm", comingSoon: true },
  { id: "int-shopify-crm", shellKey: "shopify", name: "Shopify", description: "Customers, orders, and lifecycle.", category: "crm" },
  // Accounting / spend
  { id: "int-qbo", name: "QuickBooks", description: "GL, invoices, and expenses.", category: "accounting", comingSoon: true },
  { id: "int-xero", name: "Xero", description: "Accounting and bank feeds.", category: "accounting", comingSoon: true },
  { id: "int-stripe", name: "Stripe", description: "Payments, billing, and revenue.", category: "accounting", comingSoon: true },
  { id: "int-netsuite", name: "NetSuite", description: "ERP and consolidated reporting.", category: "accounting", comingSoon: true },
  { id: "int-ramp", name: "Ramp", description: "Corporate cards and spend controls.", category: "accounting", comingSoon: true },
  { id: "int-brex", name: "Brex", description: "Cards, expenses, and budgets.", category: "accounting", comingSoon: true },
  { id: "int-expensify", name: "Expensify", description: "Receipts and reimbursements.", category: "accounting", comingSoon: true },
];
