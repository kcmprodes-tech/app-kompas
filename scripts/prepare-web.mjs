import { cp, mkdir, rm } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const root = new URL("../", import.meta.url);
const entries = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "sw.js",
  "assets"
];

await rm(dist, { force: true, recursive: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await cp(new URL(entry, root), new URL(entry, dist), { recursive: true });
}

console.log("Prepared web assets in dist/");
