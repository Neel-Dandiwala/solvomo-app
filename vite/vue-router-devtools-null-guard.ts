import type { Plugin } from "vite";

/**
 * Vue Router dev build assigns instance.__vrv_devtools without a null check;
 * ref.i can be null (Suspense / timing / Safari). Vite transforms the single site.
 */
export function vueRouterDevtoolsNullGuard(): Plugin {
  return {
    name: "vue-router-devtools-null-guard",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("vue-router") || !id.includes("vue-router.mjs")) {
        return;
      }
      if (!code.includes("instance.__vrv_devtools = info")) {
        return;
      }
      return {
        code: code.replaceAll(
          "instance.__vrv_devtools = info",
          "instance && (instance.__vrv_devtools = info)",
        ),
      };
    },
  };
}
