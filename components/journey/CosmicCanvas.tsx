'use client';
import { useEffect, useRef } from 'react';

// Interactive background FX for the galaxy, drawn on a single <canvas> so the
// whole particle system runs in one rAF loop with zero React re-renders.
//
//  • Click anywhere on empty sky → a shockwave detonates at that point.
//  • Meteors drift down at a deliberately sparse cadence (never a meteor shower —
//    the goal is "alive", not "distracting").
//  • An expanding shockwave that sweeps over a meteor shatters it into debris.
//
// Star nodes and HUD controls stay clickable: the canvas is pointer-events-none
// and clicks are read from a window listener that ignores interactive targets.

const PRIMARY = { r: 0, g: 119, b: 255 };
const PURPLE = { r: 139, g: 92, b: 246 };
const AMBER = { r: 255, g: 176, b: 92 };

type RGB = { r: number; g: number; b: number };
const rgba = (c: RGB, a: number) => `rgba(${c.r},${c.g},${c.b},${a})`;

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  len: number; // trail length
  dead: boolean;
};

type Shock = {
  x: number;
  y: number;
  radius: number;
  max: number;
  life: number; // 1 → 0
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 1 → 0
  decay: number;
  color: RGB;
};

type Props = {
  reducedMotion: boolean;
  /** Only spawn meteors / accept clicks while the galaxy is front-and-centre. */
  active: boolean;
};

export default function CosmicCanvas({ reducedMotion, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Live refs so the rAF loop and listeners always see fresh values without
  // tearing down the animation on every prop flip.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const meteors: Meteor[] = [];
    const shocks: Shock[] = [];
    const particles: Particle[] = [];

    const spawnMeteor = () => {
      // Enter from the top, sometimes from the top-right, falling diagonally.
      const fromSide = Math.random() < 0.5;
      const speed = 2.6 + Math.random() * 2.4;
      const angle = (Math.PI / 180) * (108 + Math.random() * 24); // down + slightly left
      meteors.push({
        x: fromSide ? width + 40 : Math.random() * width,
        y: fromSide ? Math.random() * height * 0.4 : -40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.4 + Math.random() * 1.8,
        len: 60 + Math.random() * 60,
        dead: false,
      });
    };

    const burstDebris = (x: number, y: number, count: number, palette: RGB[], power: number) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = power * (0.3 + Math.random() * 0.7);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          size: 1 + Math.random() * 2,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          color: palette[(Math.random() * palette.length) | 0],
        });
      }
    };

    const detonate = (x: number, y: number) => {
      shocks.push({ x, y, radius: 0, max: 150 + Math.random() * 50, life: 1 });
      burstDebris(x, y, 26, [PRIMARY, PURPLE, { r: 255, g: 255, b: 255 }], 6);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!activeRef.current) return;
      const target = event.target as HTMLElement | null;
      // Leave star nodes, links and buttons to do their own thing.
      if (target?.closest('button, a, input, textarea, select, [role="dialog"]')) return;
      detonate(event.clientX, event.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown);

    // ── Sparse meteor scheduler ───────────────────────────────────────────────
    // Self-scheduling timeout (not setInterval) so the gap stays randomly long.
    let meteorTimer: ReturnType<typeof setTimeout>;
    const scheduleMeteor = () => {
      meteorTimer = setTimeout(
        () => {
          if (activeRef.current && meteors.length < 3 && !document.hidden) spawnMeteor();
          scheduleMeteor();
        },
        3200 + Math.random() * 4200,
      );
    };
    scheduleMeteor();

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // ── Meteors ──────────────────────────────────────────────────────────────
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x < -80 || m.y > height + 80 || m.x > width + 120) m.dead = true;

        const nx = m.x - m.vx * (m.len / 6);
        const ny = m.y - m.vy * (m.len / 6);
        const grad = ctx.createLinearGradient(m.x, m.y, nx, ny);
        grad.addColorStop(0, rgba(AMBER, 0.9));
        grad.addColorStop(0.4, rgba(AMBER, 0.25));
        grad.addColorStop(1, 'rgba(255,176,92,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,235,210,0.95)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Shockwaves + collision with meteors ───────────────────────────────────
      for (const s of shocks) {
        s.life -= 0.022;
        s.radius = s.max * (1 - s.life ** 2); // ease-out growth
        const alpha = Math.max(0, s.life);

        // Ring
        ctx.strokeStyle = rgba(PRIMARY, alpha * 0.8);
        ctx.lineWidth = 2.5 * alpha + 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner glow ring
        ctx.strokeStyle = rgba(PURPLE, alpha * 0.4);
        ctx.lineWidth = 6 * alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 0.78, 0, Math.PI * 2);
        ctx.stroke();
        // Core flash (early life only)
        if (s.life > 0.7) {
          const f = (s.life - 0.7) / 0.3;
          const fg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 40 * f + 6);
          fg.addColorStop(0, rgba({ r: 255, g: 255, b: 255 }, f));
          fg.addColorStop(1, 'rgba(0,119,255,0)');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 40 * f + 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // The expanding ring shatters any meteor it sweeps over.
        for (const m of meteors) {
          if (m.dead) continue;
          const d = Math.hypot(m.x - s.x, m.y - s.y);
          if (d < s.radius && d > s.radius - 26) {
            m.dead = true;
            burstDebris(m.x, m.y, 14, [AMBER, { r: 255, g: 255, b: 255 }], 4);
          }
        }
      }

      // ── Free particles ─────────────────────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.04; // light gravity
        p.life -= p.decay;
        if (p.life <= 0) continue;
        ctx.fillStyle = rgba(p.color, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      // Compact the pools.
      for (let i = meteors.length - 1; i >= 0; i--) if (meteors[i].dead) meteors.splice(i, 1);
      for (let i = shocks.length - 1; i >= 0; i--) if (shocks[i].life <= 0) shocks.splice(i, 1);
      for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(meteorTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[6]"
    />
  );
}
