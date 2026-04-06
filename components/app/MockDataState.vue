<script setup lang="ts">
defineProps<{
  status: "ready" | "missing_session" | "missing_scope";
}>();
</script>

<template>
  <EmptyState
    v-if="status !== 'ready'"
    :title="status === 'missing_session' ? 'No demo user loaded' : 'Workspace scope is still restoring'"
    :description="
      status === 'missing_session'
        ? 'Sign in as Neel or Riya to load the central Solvomo mock workspace and page data.'
        : 'The demo session is active, but workspace, brand, or environment context has not finished hydrating yet.'
    "
  />
</template>
