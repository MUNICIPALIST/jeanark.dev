// Interactive node graph for the hero: drifting nodes, links between close
// ones, and the cursor pulls its own links in while nudging nodes aside.

const canvas = document.querySelector<HTMLCanvasElement>("[data-graph]");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LINK = 130; // max distance (px) for a link between nodes
  const REACH = 170; // cursor influence radius

  type Node = { x: number; y: number; vx: number; vy: number };
  let nodes: Node[] = [];
  let w = 0;
  let h = 0;
  let color = "#d97757";
  const mouse = { x: -9999, y: -9999 };
  let running = false;
  let visible = true;

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || color;
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(Math.max((w * h) / 17000, 22), 85) * (w < 640 ? 0.6 : 1));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };

  // Fade the graph out over the bottom 40% so it blends into the next section.
  const fade = (y: number) => (y < h * 0.6 ? 1 : Math.max(0, 1 - (y - h * 0.6) / (h * 0.4)));

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < REACH && d > 0) {
        const push = ((REACH - d) / REACH) * 0.6;
        n.x += (dx / d) * push;
        n.y += (dy / d) * push;
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.35 * fade((a.y + b.y) / 2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < REACH) {
        ctx.globalAlpha = (1 - md / REACH) * 0.8 * fade(a.y);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.7 * fade(a.y);
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const loop = () => {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  };
  const sync = () => {
    const should = visible && !document.hidden && !reduce;
    if (should && !running) {
      running = true;
      requestAnimationFrame(loop);
    } else if (!should) {
      running = false;
    }
  };

  resize();
  readColor();
  draw();

  addEventListener("resize", () => {
    resize();
    if (!running) draw();
  });
  addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);
  // Re-read the accent color when the theme toggles.
  new MutationObserver(() => {
    readColor();
    if (!running) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  sync();
}
