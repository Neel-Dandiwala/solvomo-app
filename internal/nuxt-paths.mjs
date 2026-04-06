/**
 * Resolves `#internal/nuxt/paths` for Node when it loads `.nuxt/dist/server/server.mjs`.
 *
 * Do not re-export `@nuxt/nitro-server/.../paths.mjs`: that pulls `nitropack/runtime`,
 * whose entry re-exports modules that import `#nitro-internal-virtual/*` — those
 * specifiers only exist inside a Nitro bundle, not in plain Node.
 *
 * This mirrors Nuxt’s generated paths helpers using the same defaults as
 * @nuxt/schema (baseURL `/`, buildAssetsDir `/_nuxt/`). If you change `app.baseURL`
 * or `app.buildAssetsDir` in nuxt.config, update this object to match.
 */
import { joinRelativeURL } from "ufo";

const app = {
  baseURL: "/",
  cdnURL: "",
  buildAssetsDir: "/_nuxt/",
};

function getAppConfig() {
  return app;
}

export function baseURL() {
  return getAppConfig().baseURL;
}

export function buildAssetsDir() {
  return getAppConfig().buildAssetsDir;
}

export function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}

export function publicAssetsURL(...path) {
  const cfg = getAppConfig();
  const publicBase = cfg.cdnURL || cfg.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}
