import { useEffect, useRef } from 'react';

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
};

const COLORS = ['#FFB7DD', '#A0E7E5', '#B5EAD7', '#39FF14', '#FFF3B0'];
const BASE_PARTICLE_COUNT = 360;

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnParticles = (count: number) => {
      // More efficient: slice instead of splice to avoid shifting all elements
      if (particlesRef.current.length > 1500) {
        particlesRef.current = particlesRef.current.slice(-1000);
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
      const centerY = canvas.height / (window.devicePixelRatio || 1) / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radialOffset = Math.random() * 60;
        const startX = centerX + Math.cos(angle) * radialOffset * 0.35;
        const startY = centerY + Math.sin(angle) * radialOffset * 0.35;
        const speed = Math.random() * 4 + 1.2;
        const wobble = (Math.random() - 0.5) * 1.8;
        particlesRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed + wobble,
          vy: Math.sin(angle) * speed - (Math.random() * 2 + 0.5),
          size: Math.random() * 4 + 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: Math.random() * 30 + 40
        });
      }
    };

    const step = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.vy += 0.12;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;

        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

        if (particle.life <= 0 || particle.y >= canvas.height) {
          particles.splice(index, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameRef.current = window.requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameRef.current = null;
      }
    };

    const ensureAnimation = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(step);
      }
    };

    const handleLaunch = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctxRef.current = ctx;
      resizeCanvas();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = [];
      const densityFactor = Math.max(window.innerWidth, window.innerHeight) / 600;
      spawnParticles(Math.round(BASE_PARTICLE_COUNT * densityFactor));
      ensureAnimation();
    };

    const handleResize = () => {
      resizeCanvas();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      } else if (document.visibilityState === 'visible' && particlesRef.current.length) {
        ensureAnimation();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('launch', handleLaunch);

    return () => {
      const ctx = ctxRef.current;

      window.removeEventListener('resize', handleResize);
      document.removeEventListener('launch', handleLaunch);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}
