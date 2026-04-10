/**
 * Ensures `.nuxt/dev` exists before `nuxt dev` so Nitro's prepareDir
 * does not fail with ENOENT when the parent `.nuxt` folder is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
fs.mkdirSync(path.join(root, ".nuxt", "dev"), { recursive: true });
