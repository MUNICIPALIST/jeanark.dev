// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Set SITE_URL in your host (Cloudflare Pages) to your real domain. The old
// NEXT_PUBLIC_SITE_URL is still read so existing dashboard settings keep working.
// Accepts either a full URL ("https://jeanark.dev") or a bare domain ("jeanark.dev").
const rawSiteUrl =
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
  "https://jeanark.dev";
const site = /^https?:\/\//i.test(rawSiteUrl)
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export default defineConfig({
  site,
  // Static output; ./out matches the existing Cloudflare Pages build settings.
  outDir: "./out",
  vite: {
    plugins: [tailwindcss()],
  },
});
