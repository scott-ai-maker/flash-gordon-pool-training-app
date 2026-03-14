"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.85 ? "#00BFFF" : Math.random() > 0.7 ? "#F5C400" : "#ffffff",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.alpha += 0.005 * s.alphaDir;
        if (s.alpha >= 1 || s.alpha <= 0) s.alphaDir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
        s.y += s.speed;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080f18]"
    >
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial glow backdrop */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,rgba(0,191,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_50%,rgba(201,168,76,0.06)_0%,transparent_70%)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 grid-bg opacity-60" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-10 bg-gradient-to-t from-[#080f18] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Text content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="section-label">Professional Pool Player</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-orbitron font-black leading-none mt-4 mb-6"
            >
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white text-shadow-electric">
                FLASH
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#F5C400] text-shadow-gold">
                GORDON
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#00BFFF] text-shadow-electric">
                POOL
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="font-exo text-lg sm:text-xl text-[#C0C0C0] max-w-lg mb-8 leading-relaxed"
            >
              <span className="text-[#F5C400] font-semibold">The comeback nobody saw coming.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#about"
                className="font-orbitron text-sm font-bold tracking-widest uppercase px-8 py-4 rounded bg-[#00BFFF] text-black hover:bg-white transition-all duration-300 glow-electric"
              >
                Enter the Arena
              </a>
              <a
                href="#coaching"
                className="font-orbitron text-sm font-bold tracking-widest uppercase px-8 py-4 rounded border border-[#00BFFF]/60 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:border-[#00BFFF] transition-all duration-300"
              >
                Book a Session
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-8 mt-12 pt-8 border-t border-[#00BFFF]/10"
            >
              {[
                { num: "700", label: "Fargo Rated at 17" },
                { num: "25 Yrs", label: "Away From The Game" },
                { num: "2029", label: "Pro Tour Target" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-orbitron font-bold text-2xl text-[#00BFFF]">{stat.num}</p>
                  <p className="font-exo text-xs text-[#C0C0C0] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero character image */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,191,255,0.25)_0%,transparent_70%)] scale-150 blur-xl" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.15)_0%,transparent_70%)] scale-125 blur-2xl" />

              {/* Sci-fi frame */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden border-2 border-[#00BFFF]/40 glow-electric">
                <Image
                  src="/images/hero-character.png"
                  alt="Flash Gordon Pool"
                  fill
                  className="object-cover object-top"
                  priority
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#F5C400]" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#F5C400]" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#F5C400]" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#F5C400]" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-orbitron text-[10px] tracking-widest text-[#00BFFF]/60 uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-[#00BFFF] to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
