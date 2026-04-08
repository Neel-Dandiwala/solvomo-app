/**
 * Builds public/favicon.png: trims transparent padding, then fits the mark in a square canvas.
 * Run: node scripts/generate-favicon.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "assets/images/logo/logo_transparent.png");
const output = path.join(root, "public/favicon.png");

const size = 512;

await sharp(input)
  .trim({ threshold: 1 })
  .resize(size, size, {
    fit: "contain",
    position: "centre",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(output);

console.log("Wrote", output);
