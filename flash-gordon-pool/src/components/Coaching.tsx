"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const plans = [
  {
    icon: "▲",
    title: "Private 1-on-1 Sessions",
    price: "Contact for Pricing",
    features: [
      "Full mechanical breakdown & stroke analysis",
      "Position play and pattern development",
      "Mental game and shot selection coaching",
      "Customized drills and training plan",
      "Video review available",
    ],
    featured: false,
    cta: "Book Session",
  },
  {
    icon: "◆",
    title: "Intensive Training Camp",
    price: "Contact for Pricing",
    features: [
      "Multi-day deep-dive training",
      "Full game audit from scratch",
      "Advanced shot-making & safety play",
      "Tournament preparation strategy",
      "Ongoing support and follow-up",
      "Small group or private options",
    ],
    featured: true,
    cta: "Book Camp",
  },
  {
    icon: "●",
    title: "Online Video Coaching",
    price: "Contact for Pricing",
    features: [
      "Asynchronous video submission review",
      "Detailed written & video feedback",
      "Drill assignments and homework",
      "Flexible scheduling — any timezone",
      "Monthly package options",
    ],
    featured: false,
    cta: "Get Started",
  },
];

export default function Coaching() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="coaching" className="relative py-24 lg:py-32 bg-[#0d1b2a] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <hr className="hr-electric absolute top-0 left-0 right-0 m-0" />
      <hr className="hr-gold absolute bottom-0 left-0 right-0 m-0" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,191,255,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-label">Train With Flash</span>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl mt-2 mb-4">
            Coaching <span className="text-[#F5C400] text-shadow-gold">Services</span>
          </h2>
          <p className="font-exo text-[#9ab0c8] max-w-xl mx-auto">
            Elevate your game with the strategic mind and precision mechanics of a seasoned pro.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className={`relative flex flex-col rounded-lg overflow-hidden border transition-all duration-300 group ${
                plan.featured
                  ? "border-[#F5C400] glow-gold bg-[#080f18]"
                  : "border-[#00BFFF]/20 hover:border-[#00BFFF]/50 bg-[#080f18]/60"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 right-0 text-center py-1.5 bg-[#F5C400] font-orbitron text-black text-xs font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className={`p-6 lg:p-8 flex flex-col flex-1 ${plan.featured ? "pt-10" : ""}`}>
                {/* Icon */}
                <div className={`text-3xl mb-4 ${plan.featured ? "text-[#F5C400]" : "text-[#00BFFF]"}`}>
                  {plan.icon}
                </div>

                <h3 className="font-orbitron font-bold text-xl text-white mb-2">{plan.title}</h3>
                <p className={`font-exo text-sm font-semibold mb-6 ${plan.featured ? "text-[#F5C400]" : "text-[#00BFFF]"}`}>
                  {plan.price}
                </p>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-exo text-sm text-[#9ab0c8]">
                      <span className={`mt-0.5 text-xs ${plan.featured ? "text-[#F5C400]" : "text-[#00BFFF]"}`}>✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block font-orbitron text-xs font-bold tracking-widest uppercase text-center py-4 rounded border transition-all duration-300 ${
                    plan.featured
                      ? "bg-[#F5C400] text-black border-[#F5C400] hover:bg-white hover:border-white glow-gold"
                      : "border-[#00BFFF]/40 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:border-[#00BFFF]"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>

              {/* Corner accents */}
              <div className={`absolute -bottom-0 -right-0 w-8 h-8 border-b-2 border-r-2 ${plan.featured ? "border-[#F5C400]/60" : "border-[#00BFFF]/30"} transition-all group-hover:border-opacity-100`} />
            </motion.div>
          ))}
        </div>

        {/* CTA bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="font-exo text-[#9ab0c8] mb-4">Not sure which option is right for you?</p>
          <a
            href="#contact"
            className="inline-block font-orbitron text-sm font-bold tracking-widest uppercase px-8 py-4 rounded border border-[#00BFFF]/50 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:border-[#00BFFF] transition-all duration-300"
          >
            Schedule a Free Consultation
          </a>
        </motion.div>

      </div>
    </section>
  );
}
