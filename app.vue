<script>
export default defineNuxtComponent({
  name: "AppRoot",
});
</script>

<template>
  <div class="min-h-svh w-full">
    <NuxtLoadingIndicator color="#5B7BE1" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
