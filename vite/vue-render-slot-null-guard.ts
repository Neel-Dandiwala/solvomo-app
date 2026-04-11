import type { Plugin } from "vite";

/**
 * Vue 3.5 `renderSlot` evaluates `currentRenderingInstance.ce` before `||` can
 * short-circuit when `currentRenderingInstance` is null (WebKit: "null is not an
 * object (evaluating 'currentRenderingInstance.ce')"). Align with the intended
 * condition in vuejs/core `renderSlot.ts` by guarding the instance first.
 */
export function vueRenderSlotNullGuard(): Plugin {
  return {
    name: "vue-render-slot-null-guard",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("@vue/runtime-core") || !id.includes("runtime-core")) return;
      const needle =
        "if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {";
      if (!code.includes(needle)) return;
      return {
        code: code.replace(
          needle,
          "if (currentRenderingInstance && (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce)) {",
        ),
      };
    },
  };
}
