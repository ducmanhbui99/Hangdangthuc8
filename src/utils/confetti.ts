interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  alpha: number;
}

const COLORS = ['#F59E0B', '#10B981', '#FBBF24', '#38BDF8', '#F43F5E', '#FFFFFF'];

export function triggerConfettiBurst(mode: 'mini' | 'victory'): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const count = mode === 'victory' ? 85 : 32;
  const originX = canvas.width * 0.5;
  const originY = mode === 'victory' ? canvas.height * 0.42 : canvas.height * 0.68;

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (mode === 'victory' ? 2.2 : 1.3);
    const speed = (mode === 'victory' ? 9 : 6) + Math.random() * 8;
    return {
      x: originX + (Math.random() - 0.5) * 80,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 2,
      size: 6 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      alpha: 1,
    };
  });

  let frameId = 0;
  let lastTime = performance.now();

  function step(now: number) {
    const dt = Math.min((now - lastTime) / 16.667, 2.5);
    lastTime = now;

    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.36 * dt;
      p.vx *= 0.99;
      p.rotation += p.vr * dt;
      p.alpha -= (mode === 'victory' ? 0.011 : 0.018) * dt;

      if (p.alpha > 0.02 && p.y < canvas.height + 24) {
        alive++;
        ctx!.save();
        ctx!.globalAlpha = Math.max(0, p.alpha);
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
        ctx!.restore();
      }
    }

    if (alive > 0) {
      frameId = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(frameId);
      canvas.remove();
    }
  }

  frameId = requestAnimationFrame(step);
}
