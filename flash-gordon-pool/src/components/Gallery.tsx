"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
  category: "all" | "character" | "action" | "events";
  large?: boolean;
};

const items: GalleryItem[] = [
  { src: "/images/gallery-1.png", alt: "Flash Gordon Pool — Character Art", label: "Character Art", category: "character" },
  { src: "/images/gallery-2.png", alt: "Flash Gordon Pool — Action Shot", label: "Action Shot", category: "action" },
  { src: "/images/gallery-3.png", alt: "Flash Gordon Pool — Hero Pose", label: "Hero Pose", category: "character", large: true },
  { src: "/images/gallery-4.png", alt: "Flash Gordon Pool — Tournament", label: "Tournament", category: "events" },
  { src: "/images/gallery-5.png", alt: "Flash Gordon Pool — Event", label: "Event", category: "events" },
  { src: "/images/gallery-6.png", alt: "Flash Gordon Pool — The Shot", label: "The Shot", category: "action" },
  { src: "/images/gallery-7.png", alt: "Flash Gordon Pool — Warrior", label: "Warrior", category: "character", large: true },
  { src: "/images/gallery-8.png", alt: "Flash Gordon Pool — Precision", label: "Precision", category: "action" },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Character Art", value: "character" },
  { label: "Action Shots", value: "action" },
  { label: "Events", value: "events" },
] as const;

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState<"all" | "character" | "action" | "events">("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = activeFilter === "all" ? items : items.filter((i) => i.category === activeFilter);

  return (
    <section id="gallery" className="relative py-24 lg:py-32 bg-[#080f18] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-label">Visual Chronicle</span>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl mt-2 mb-4">
            The <span className="text-[#F5C400] text-shadow-gold">Gallery</span>
          </h2>
          <p className="font-exo text-[#9ab0c8] max-w-xl mx-auto">
            Flash Gordon at the table, in the arena, and on the road to 2029.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`font-orbitron text-xs tracking-wider uppercase px-4 py-2 rounded border transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-[#00BFFF] text-black border-[#00BFFF]"
                  : "border-[#00BFFF]/20 text-[#9ab0c8] hover:border-[#00BFFF]/50 hover:text-[#00BFFF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-lg border border-[#00BFFF]/10 cursor-pointer group ${
                  item.large ? "row-span-2" : ""
                }`}
                onClick={() => setLightbox(item)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                />

                {/* Placeholder */}
                <div className="absolute inset-0 bg-[#0d1b2a] flex flex-col items-center justify-center font-orbitron -z-10">
                  <div className="text-4xl text-[#00BFFF]/20 mb-2">⚡</div>
                  <p className="text-[#00BFFF]/40 text-[10px] tracking-widest text-center px-2">{item.label}</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080f18]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="font-orbitron text-xs text-[#00BFFF] tracking-wider uppercase">{item.label}</span>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 border border-[#00BFFF]/0 group-hover:border-[#00BFFF]/50 rounded-lg transition-all duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href="#contact"
            className="inline-block font-orbitron text-sm font-bold tracking-widest uppercase px-8 py-4 rounded border border-[#00BFFF]/50 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:border-[#00BFFF] transition-all duration-300"
          >
            Request Full Portfolio
          </a>
        </motion.div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] w-full aspect-video rounded-lg overflow-hidden border border-[#00BFFF]/30 glow-electric"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox.src} alt={lightbox.alt} fill className="object-contain" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-orbitron text-sm text-[#00BFFF]">{lightbox.label}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 font-orbitron text-[#C0C0C0] hover:text-white text-xl w-8 h-8 flex items-center justify-center border border-[#C0C0C0]/30 rounded hover:border-white transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
