"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Results", href: "#tournaments" },
  { label: "Coaching", href: "#coaching" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080f18]/95 backdrop-blur-md border-b border-[#00BFFF]/20 shadow-[0_4px_30px_rgba(0,191,255,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Flash Gordon Pool"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-exo text-sm font-semibold tracking-wider text-[#C0C0C0] hover:text-[#00BFFF] transition-colors duration-200 uppercase relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00BFFF] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <a
              href="#coaching"
              className="font-orbitron text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded border border-[#F5C400] text-[#F5C400] hover:bg-[#F5C400] hover:text-black transition-all duration-300 glow-gold"
            >
              Book Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#00BFFF] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#00BFFF] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#00BFFF] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#080f18]/98 backdrop-blur-lg border-b border-[#00BFFF]/20 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="font-exo text-base font-semibold tracking-wider text-[#C0C0C0] hover:text-[#00BFFF] transition-colors duration-200 uppercase py-2 border-b border-[#00BFFF]/10"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#coaching"
                onClick={handleNavClick}
                className="font-orbitron text-sm font-bold tracking-widest uppercase px-5 py-3 rounded border border-[#F5C400] text-[#F5C400] hover:bg-[#F5C400] hover:text-black transition-all duration-300 text-center mt-2"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
