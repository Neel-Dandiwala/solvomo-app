<script setup lang="ts">
definePageMeta({ layout: "app" });

useHead({ title: "Settings — Solvomo" });

const auth = useAuth();
const { currentWorkspace, currentBrand } = useWorkspaceContext();

const section = ref<"user" | "workspace" | "brand" | "members" | "api">("user");

const tabs = [
  { id: "user", label: "User settings" },
  { id: "workspace", label: "Workspace profile" },
  { id: "members", label: "Members" },
  { id: "api", label: "API keys" },
  { id: "brand", label: "Brand profile" },
] as const;
</script>

<template>
  <div>
    <PageHeader
      title="Settings"
      :description="`Workspace controls for ${currentWorkspace?.name}. Brand-level modeling lives under Brand — separate from workspace admin.`"
    />

    <div class="flex flex-col gap-6 lg:flex-row">
      <nav class="flex shrink-0 flex-wrap gap-2 lg:w-52 lg:flex-col">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="rounded-xl px-3 py-2 text-left text-sm font-semibold transition"
          :class="section === tab.id ? 'bg-black/[0.06] text-black' : 'text-black/50 hover:text-black'"
          @click="section = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <SurfaceCard variant="frame" class="min-w-0 flex-1" padding="lg">
        <template v-if="section === 'user'">
          <h2 class="text-lg font-semibold">
            User settings
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Personal profile, notification preferences, and account-level defaults for your Solvomo login.
          </p>
          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Full name</label>
              <input class="auth-input mt-2" type="text" :value="auth.displayName" readonly>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-black/45">Email</label>
              <input class="auth-input mt-2" type="email" :value="auth.displayEmail" readonly>
            </div>
          </div>
          <div class="mt-6">
            <p class="text-xs font-bold uppercase tracking-wide text-black/45">
              Preferences
            </p>
            <div class="mt-3 space-y-3 text-sm text-black/65">
              <label class="flex items-center justify-between gap-4 rounded-xl border border-black/8 px-4 py-3">
                <span>Operational alert emails</span>
                <input type="checkbox" checked class="h-4 w-4 rounded border-black/15">
              </label>
              <label class="flex items-center justify-between gap-4 rounded-xl border border-black/8 px-4 py-3">
                <span>Weekly summary digest</span>
                <input type="checkbox" checked class="h-4 w-4 rounded border-black/15">
              </label>
            </div>
          </div>
        </template>

        <template v-else-if="section === 'workspace'">
          <h2 class="text-lg font-semibold">
            Workspace profile
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Billing, legal entity, and workspace defaults. Does not change creative or spend models for individual brand profiles.
          </p>
          <p class="mt-6 text-sm text-black/60">
            Signed in as <span class="font-semibold text-black">{{ auth.displayName }}</span>
            <span class="text-black/45">· {{ auth.displayEmail }}</span>
          </p>
          <label class="mt-6 block text-xs font-bold uppercase tracking-wide text-black/45">Workspace display name</label>
          <input class="auth-input mt-2 max-w-md" type="text" :value="currentWorkspace?.name" readonly>
          <p class="mt-2 text-xs text-black/45">
            Rename and billing email ship with account service integration.
          </p>
        </template>

        <template v-else-if="section === 'members'">
          <h2 class="text-lg font-semibold">
            Members
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Invite collaborators to this workspace. Brand profile access can be restricted per member in a later release.
          </p>
          <EmptyState
            class="mt-6"
            title="No pending invites"
            description="When directory sync is enabled, seats and roles will be managed here."
          >
            <button type="button" class="button-secondary rounded-xl px-4 py-2 text-sm font-semibold">
              Invite member
            </button>
          </EmptyState>
        </template>

        <template v-else-if="section === 'api'">
          <h2 class="text-lg font-semibold">
            API keys
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Programmatic access is scoped to this workspace. Rotate keys regularly; never embed secrets in client-side code.
          </p>
          <EmptyState
            class="mt-6"
            title="No keys issued"
            description="Create a key when you connect internal ETL or custom importers."
          >
            <button type="button" class="button-primary rounded-xl px-4 py-2 text-sm font-semibold text-white">
              Create API key
            </button>
          </EmptyState>
        </template>

        <template v-else>
          <h2 class="text-lg font-semibold">
            Brand profile — {{ currentBrand?.name }}
          </h2>
          <p class="mt-2 text-sm text-black/50">
            Attribution, currency, and modeling assumptions for this profile only. Other brands in the workspace are unaffected.
          </p>
          <ul class="mt-6 space-y-3 text-sm text-black/65">
            <li>
              <span class="font-semibold text-black">Currency:</span>
              {{ currentBrand?.currency }}
            </li>
            <li>
              <span class="font-semibold text-black">Attribution:</span>
              {{ currentBrand?.attributionPreference }}
            </li>
          </ul>
          <NuxtLink
            to="/onboarding/brand-setup"
            class="button-secondary mt-8 inline-flex rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Open brand setup wizard
          </NuxtLink>
        </template>
      </SurfaceCard>
    </div>
  </div>
</template>
