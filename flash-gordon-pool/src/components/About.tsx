"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const stats = [
  { num: "700", label: "Fargo Rating at 17" },
  { num: "25 Yrs", label: "Away From The Game" },
  { num: "2029", label: "Pro Tour Target" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-[#0d1b2a] overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Top border */}
      <hr className="hr-electric absolute top-0 left-0 right-0 m-0" />
      {/* Bottom border */}
      <hr className="hr-gold absolute bottom-0 left-0 right-0 m-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Portrait frame */}
            <div className="relative w-72 sm:w-80 lg:w-96">
              {/* Glow */}
              <div className="absolute inset-0 rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(0,191,255,0.2)_0%,transparent_70%)] blur-xl scale-110" />

              <div className="relative rounded-lg overflow-hidden border border-[#00BFFF]/30 aspect-[3/4] glow-electric">
                <Image
                  src="/images/about-portrait.png"
                  alt="Scott Gordon — Flash Gordon Pool"
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                />
                {/* Scan line overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00BFFF]/5 to-transparent pointer-events-none" />
              </div>

              {/* Sci-fi corners */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#F5C400]" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#F5C400]" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#F5C400]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#F5C400]" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-[#080f18]/80 border border-[#00BFFF]/20 rounded p-3 text-center"
                >
                  <p className="font-orbitron font-bold text-xl text-[#00BFFF]">{s.num}</p>
                  <p className="font-exo text-[10px] text-[#C0C0C0] uppercase tracking-wider mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-label">Origin Story</span>
            <h2 className="font-orbitron font-black text-4xl sm:text-5xl leading-tight mt-2 mb-6">
              The Man Behind{" "}
              <span className="text-[#F5C400] text-shadow-gold">The Comeback</span>
            </h2>

            <p className="font-exo text-lg font-semibold text-[#C0C0C0] mb-4 italic">
              At 17 he was rated 700 Fargo (BU rating comparison). Then life happened. 25 years, a family raised, and a burning question left unanswered. Now at 54, Flash Gordon is back at the table — and the answer is yes.
            </p>

            <div className="space-y-4 font-exo text-[#9ab0c8] leading-relaxed">
              <p>
                Scott Gordon picked up a cue at 14 and by 17 had earned a 700 Fargo rating (BU rating comparison) — elite by any measure. He played with the instincts of someone twice his age: fast, decisive, impossible to rattle. Then he made a choice most competitors never do. He put the cue down and raised his family.
              </p>
              <p>
                Twenty-five years away from the game. Zero regrets. But the talent doesn&apos;t retire just because the player does. In 2026, Scott Gordon returned to the table — and Flash Gordon was born. The goal: reach the national pro tour by 2029. The approach: the same one that made him elite the first time. Fast. Decisive. Unstoppable.
              </p>
              <p>
                His inspirations are Efren Reyes — quiet genius, Buddy &quot;The Rifleman&quot; Hall — old-school grit, and Fedor Gorst — technically flawless modern elite. Flash Gordon plays 9-Ball, 10-Ball, 8-Ball, One Pocket, and Banks. He is tracked on FargoRate and rising.
              </p>
            </div>

            {/* Signature block */}
            <div className="mt-8 pt-6 border-t border-[#00BFFF]/10 flex items-center gap-4">
              <div>
                <p className="font-orbitron text-xl font-bold text-white">Scott Gordon</p>
                <p className="font-exo text-sm text-[#F5C400] tracking-wider">aka Flash Gordon — The Comeback</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00BFFF]/30 to-transparent" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
