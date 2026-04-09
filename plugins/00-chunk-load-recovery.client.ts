/**
 * Recover when a Vite/Nuxt JS chunk fails to load (404 after deploy, stale CDN HTML, etc.).
 * Safari surfaces this as "Importing a module script failed." during app init or route navigation.
 */
export default defineNuxtPlugin({
  name: "chunk-load-recovery",
  enforce: "pre",
  setup(nuxtApp) {
    if (import.meta.dev) return;

    const key = "sv:nuxt-chunk-recovery";

    function looksLikeChunkFailure(message: string): boolean {
      return /import(?:ing)? a module script failed|failed to fetch dynamically imported module|loading chunk \d+ failed|error loading dynamically imported module/i.test(
        message,
      );
    }

    function recover(fullPath?: string) {
      try {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key);
          return;
        }
        sessionStorage.setItem(key, "1");
      } catch {
        /* private mode / blocked storage */
      }
      if (fullPath) window.location.assign(fullPath);
      else window.location.reload();
    }

    nuxtApp.hook("app:mounted", () => {
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      if (!looksLikeChunkFailure(message)) return;
      event.preventDefault();
      recover();
    });

    const router = useRouter();
    router.onError((error, to) => {
      const message = error instanceof Error ? error.message : String(error);
      if (!looksLikeChunkFailure(message)) return;
      recover(to.fullPath);
    });
  },
});
