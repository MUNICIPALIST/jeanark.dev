// Captures a 1280x800 WebP preview of every project into public/projects/.
// Usage: npm run screenshots [-- <domain> ...]   (no args = all projects)
// Needs a local Chrome; override its path with CHROME_PATH.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { projects } from "../src/lib/content.ts";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9339;
const OUT = new URL("../public/projects/", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const domainOf = (url) => new URL(url).host.replace(/^www\./, "");

// Capture from another URL when the public domain is unreachable.
// re-gix.tech: domain DNS is parked at the registrar, the Worker itself is up.
const SOURCE = {
  "re-gix.tech": "https://re-gix-landing.spichka.workers.dev/",
};

// Close cookie banners / lead-capture modals before the screenshot.
const DISMISS = `(() => {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  const sel = '[aria-label*="close" i], [aria-label*="закр" i], [data-dismiss], .modal-close, .close';
  document.querySelectorAll(sel).forEach((el) => el.offsetParent && el.click());
})()`;

const only = process.argv.slice(2);
const targets = projects.filter((p) => !only.length || only.includes(domainOf(p.url)));

const profile = mkdtempSync(join(tmpdir(), "shots-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "about:blank",
]);

let ws;
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(250);
  try {
    const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    const page = tabs.find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
}
if (!ws) throw new Error(`Could not start Chrome at ${CHROME}`);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const listeners = new Set();
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id) pending.get(msg.id)?.(msg.result);
  else listeners.forEach((fn) => fn(msg));
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    pending.set(++id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const loaded = (timeout) =>
  new Promise((resolve) => {
    const done = () => (listeners.delete(fn), resolve());
    const fn = (m) => m.method === "Page.loadEventFired" && done();
    listeners.add(fn);
    setTimeout(done, timeout);
  });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});

for (const p of targets) {
  const file = `${domainOf(p.url)}.webp`;
  const load = loaded(20000);
  await send("Page.navigate", { url: SOURCE[domainOf(p.url)] ?? p.url });
  await load;
  await sleep(3000); // let fonts, images and entrance animations settle
  await send("Runtime.evaluate", { expression: DISMISS });
  await sleep(800);
  const { data } = await send("Page.captureScreenshot", { format: "webp", quality: 80 });
  writeFileSync(new URL(file, OUT), Buffer.from(data, "base64"));
  console.log(`✓ ${file}`);
}

ws.close();
chrome.kill();
rmSync(profile, { recursive: true, force: true });
