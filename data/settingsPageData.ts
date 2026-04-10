/** Realistic workspace shell data for Settings when directory sync is not wired. */

export interface SettingsMemberRow {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: "active" | "invited";
}

export interface SettingsApiKeyRow {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  created: string;
  lastUsed: string;
}

export const settingsWorkspaceMembers: SettingsMemberRow[] = [
  {
    id: "m1",
    name: "Neel Dandiwala",
    email: "neel@solvomo.com",
    role: "Owner",
    lastActive: "Active now",
    status: "active",
  },
  {
    id: "m2",
    name: "Riya Shah",
    email: "riya@solvomo.com",
    role: "Admin",
    lastActive: "3h ago",
    status: "active",
  },
  {
    id: "m3",
    name: "Jordan Lee",
    email: "jordan@partner-agency.io",
    role: "Analyst",
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: "m4",
    name: "Sam Okonkwo",
    email: "sam.okonkwo@company.com",
    role: "Viewer",
    lastActive: "Invite pending",
    status: "invited",
  },
];

export const settingsApiKeys: SettingsApiKeyRow[] = [
  {
    id: "k1",
    name: "Warehouse ETL (nightly)",
    prefix: "sk_live_····a3f2",
    scope: "Read · reporting",
    created: "Mar 4, 2026",
    lastUsed: "42 min ago",
  },
  {
    id: "k2",
    name: "Slack alert webhook",
    prefix: "sk_live_····91c0",
    scope: "Alerts · write",
    created: "Feb 18, 2026",
    lastUsed: "2h ago",
  },
  {
    id: "k3",
    name: "Local dev (rotated)",
    prefix: "sk_test_····7e1b",
    scope: "Sandbox",
    created: "Jan 9, 2026",
    lastUsed: "Never",
  },
];
