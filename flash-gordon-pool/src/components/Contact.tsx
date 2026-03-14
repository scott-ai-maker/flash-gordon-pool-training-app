"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const socialLinks = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@FlashGordonPool",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/flashgordonpool",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.2 3.3-1.7 4.8-5 5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.3-.2-4.8-1.7-5-5C2 16.6 2 16.2 2 13s0-3.6.1-4.9c.2-3.3 1.7-4.8 5-5C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7 .1 2.7.3.3 2.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.2 4.3 2.6 6.7 7 6.9 1.3.1 1.7.1 5 .1s3.7 0 5-.1c4.3-.2 6.7-2.6 6.9-7 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.2-4.3-2.6-6.7-7-6.9C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@flashgordonpool",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.6 3.3A4.5 4.5 0 0 1 15.2 0h-3.4v16.4a2.6 2.6 0 0 1-2.6 2.2 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 2.6-2.6c.3 0 .5 0 .8.1V10a6 6 0 0 0-.8-.1 6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6V8.2a7.9 7.9 0 0 0 4.4 1.3V6.1a4.5 4.5 0 0 1-2.6-.8l.6-2z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/FlashGordonPool",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your backend / email service
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-[#0d1b2a] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <hr className="hr-electric absolute top-0 left-0 right-0 m-0" />

      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom-right,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-label">Make Contact</span>
          <h2 className="font-orbitron font-black text-4xl sm:text-5xl mt-2 mb-4">
            Get In <span className="text-[#F5C400] text-shadow-gold">Touch</span>
          </h2>
          <p className="font-exo text-[#9ab0c8] max-w-xl mx-auto">
            Booking inquiries, media requests, sponsor conversations, or just want to follow the comeback? Flash is ready.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: "✉", label: "Email", value: "flash@flashgordonpool.com", href: "mailto:flash@flashgordonpool.com" },
              { icon: "☎", label: "Phone / Text", value: "Add your number here", href: "tel:+10000000000" },
              { icon: "◉", label: "Based In", value: "Add your location here", href: null },
            ].map((info) => (
              <div
                key={info.label}
                className="flex items-start gap-4 p-4 bg-[#080f18]/60 border border-[#00BFFF]/15 rounded-lg hover:border-[#00BFFF]/40 transition-colors"
              >
                <span className="text-[#00BFFF] text-xl mt-0.5 w-8 flex-shrink-0">{info.icon}</span>
                <div>
                  <p className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase mb-1">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="font-exo text-white hover:text-[#00BFFF] transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <span className="font-exo text-white">{info.value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="pt-4">
              <p className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase mb-4">Follow Flash</p>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#080f18]/60 border border-[#00BFFF]/15 rounded-lg hover:border-[#00BFFF]/50 hover:bg-[#00BFFF]/5 text-[#9ab0c8] hover:text-[#00BFFF] transition-all duration-300 font-exo text-sm"
                  >
                    {s.icon}
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#00BFFF]/30 rounded-lg bg-[#080f18]/60"
              >
                <div className="text-5xl text-[#00BFFF] mb-4">✓</div>
                <h3 className="font-orbitron font-bold text-2xl text-white mb-2">Transmission Received</h3>
                <p className="font-exo text-[#9ab0c8]">Flash will be in touch shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: "firstName", label: "First Name", placeholder: "Your first name" },
                    { id: "lastName", label: "Last Name", placeholder: "Your last name" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase block mb-2">
                        {f.label}
                      </label>
                      <input
                        type="text"
                        id={f.id}
                        name={f.id}
                        placeholder={f.placeholder}
                        required
                        value={formData[f.id as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full bg-[#080f18]/80 border border-[#00BFFF]/20 rounded px-4 py-3 font-exo text-white placeholder-[#9ab0c8]/50 focus:outline-none focus:border-[#00BFFF]/60 focus:bg-[#080f18] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#080f18]/80 border border-[#00BFFF]/20 rounded px-4 py-3 font-exo text-white placeholder-[#9ab0c8]/50 focus:outline-none focus:border-[#00BFFF]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase block mb-2">
                    What can Flash do for you?
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#080f18]/80 border border-[#00BFFF]/20 rounded px-4 py-3 font-exo text-white focus:outline-none focus:border-[#00BFFF]/60 transition-colors"
                  >
                    <option value="" className="bg-[#080f18]">Select an option...</option>
                    <option value="coaching" className="bg-[#080f18]">Coaching / Lesson Inquiry</option>
                    <option value="sponsor" className="bg-[#080f18]">Sponsor / Partnership</option>
                    <option value="media" className="bg-[#080f18]">Media / Interview Request</option>
                    <option value="appearance" className="bg-[#080f18]">Tournament Appearance</option>
                    <option value="following" className="bg-[#080f18]">Just Following The Comeback</option>
                    <option value="other" className="bg-[#080f18]">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-orbitron text-xs text-[#C0C0C0] tracking-wider uppercase block mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell Flash what you need..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-[#080f18]/80 border border-[#00BFFF]/20 rounded px-4 py-3 font-exo text-white placeholder-[#9ab0c8]/50 focus:outline-none focus:border-[#00BFFF]/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-orbitron text-sm font-bold tracking-widest uppercase py-4 rounded bg-[#00BFFF] text-black hover:bg-white transition-all duration-300 glow-electric flex items-center justify-center gap-3"
                >
                  Send Transmission
                  <span className="text-base">▶</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
