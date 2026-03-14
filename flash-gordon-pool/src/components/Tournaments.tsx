"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const recentResults = [
  { name: "Add Your Tournament Name", location: "City, State", date: "2025", format: "9-Ball", result: "1st Place", tier: "gold" },
  { name: "Add Your Tournament Name", location: "City, State", date: "2025", format: "8-Ball", result: "2nd Place", tier: "silver" },
  { name: "Add Your Tournament Name", location: "City, State", date: "2024", format: "One Pocket", result: "Top 8", tier: "blue" },
  { name: "Add Your Tournament Name", location: "City, State", date: "2024", format: "10-Ball", result: "1st Place", tier: "gold" },
  { name: "Add Your Tournament Name", location: "City, State", date: "2024", format: "Straight Pool", result: "Top 4", tier: "blue" },
];

const highlights = [
  {
    icon: "★",
    title: "700 Fargo Rating",
    desc: "Achieved at age 17–18. One of the highest amateur ratings recorded at that age. The baseline Flash Gordon is returning to — and surpassing.",
  },
  {
    icon: "▲",
    title: "The Return — March 2026",
    desc: "After 25 years away from competitive pool, Scott Gordon re-entered the arena. Fargo rating active and climbing. The comeback officially begins.",
  },
  {
    icon: "◆",
    title: "Target: 730 Fargo by 2029",
    desc: "The number needed for national pro tour entry. Structured training plan active. Every session tracked. Every drill scored. The graph is trending up.",
  },
];

const tierStyles: Record<string, string> = {
  gold: "bg-[#F5C400]/15 text-[#F5C400] border border-[#F5C400]/40",
  silver: "bg-[#C0C0C0]/15 text-[#C0C0C0] border border-[#C0C0C0]/40",
  blue: "bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/40",
};

export default function Tournaments() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState<"recent" | "highlights">("recent");

  return (
    <section id="tournaments" className="relative py-24 lg:py-32 bg-[#080f18] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-label">The Record</span>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl mt-2 mb-4">
            Tournament <span className="text-[#F5C400] text-shadow-gold">Results</span>
          </h2>
          <p className="font-exo text-[#9ab0c8] max-w-xl mx-auto">
            Every tournament is a data point. Every result is progress. The comeback is being built in public.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-2 mb-10"
        >
          {(["recent", "highlights"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-orbitron text-xs tracking-widest uppercase px-6 py-3 rounded border transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#00BFFF] text-black border-[#00BFFF] glow-electric"
                  : "border-[#00BFFF]/30 text-[#C0C0C0] hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              }`}
            >
              {tab === "recent" ? "Recent Results" : "Career Highlights"}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "recent" ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="overflow-x-auto rounded-lg border border-[#00BFFF]/20">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0d1b2a] border-b border-[#00BFFF]/20">
                      {["Tournament", "Location", "Date", "Format", "Result"].map((h) => (
                        <th
                          key={h}
                          className="font-orbitron text-xs text-[#00BFFF] tracking-widest uppercase px-4 py-4 text-left"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentResults.map((r, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                        className={`border-b border-[#00BFFF]/10 transition-colors hover:bg-[#00BFFF]/5 ${
                          r.tier === "gold" ? "bg-[#F5C400]/3" : ""
                        }`}
                      >
                        <td className="font-exo font-semibold text-white px-4 py-4">{r.name}</td>
                        <td className="font-exo text-[#9ab0c8] px-4 py-4">{r.location}</td>
                        <td className="font-exo text-[#9ab0c8] px-4 py-4">{r.date}</td>
                        <td className="font-exo text-[#9ab0c8] px-4 py-4">{r.format}</td>
                        <td className="px-4 py-4">
                          <span className={`font-orbitron text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded ${tierStyles[r.tier]}`}>
                            {r.result}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="font-exo text-xs text-[#9ab0c8]/60 text-center mt-4">
                * Replace placeholder data with actual tournament results
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-3 gap-6"
            >
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative bg-[#0d1b2a] border border-[#00BFFF]/20 rounded-lg p-6 hover:border-[#00BFFF]/50 transition-colors group"
                >
                  <div className="text-3xl text-[#F5C400] mb-4">{h.icon}</div>
                  <h3 className="font-orbitron font-bold text-white text-lg mb-3">{h.title}</h3>
                  <p className="font-exo text-[#9ab0c8] text-sm leading-relaxed">{h.desc}</p>
                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#F5C400]/40 group-hover:border-[#F5C400] transition-colors" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
