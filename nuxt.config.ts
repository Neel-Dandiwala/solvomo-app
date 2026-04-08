import { vueRouterDevtoolsNullGuard } from "./vite/vue-router-devtools-null-guard";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  // Auth/marketing UI only: avoid SSR↔client tree mismatches (RouterView/Suspense/Safari).
  ssr: false,
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  vite: {
    plugins: [vueRouterDevtoolsNullGuard()],
    resolve: {
      alias: {
        // Client bundle: import.meta.server is false, but Vite still resolves
        // import("#app-manifest") in the unused branch. Stub satisfies analysis.
        // https://github.com/nuxt/nuxt/issues/30461
        "#app-manifest": "unenv/mock/empty",
      },
    },
  },
  app: {
    head: {
      title: "Solvomo — Sign in",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          name: "description",
          content: "Decision intelligence for growth operators.",
        },
        { name: "theme-color", content: "#FFFFFF" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logo_transparent.png",
        },
      ],
    },
  },
});
