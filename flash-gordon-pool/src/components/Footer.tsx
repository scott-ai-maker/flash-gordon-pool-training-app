"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#080f18] border-t border-[#00BFFF]/15 pt-16 pb-8 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#00BFFF]/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(0,191,255,0.04)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-orbitron font-black text-2xl mb-3">
              <span className="text-white">FLASH</span>
              <span className="text-[#F5C400]">GORDON</span>
              <span className="text-[#00BFFF]">POOL</span>
            </div>
            <p className="font-exo text-sm text-[#9ab0c8] leading-relaxed max-w-xs">
              Professional billiards player. Sci-fi space warrior. Coach. Legend in the making.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h5 className="font-orbitron text-xs text-[#C0C0C0] tracking-widest uppercase mb-4">Navigate</h5>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "#about" },
                { label: "Tournament Results", href: "#tournaments" },
                { label: "Coaching", href: "#coaching" },
                { label: "Gallery", href: "#gallery" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-exo text-sm text-[#9ab0c8] hover:text-[#00BFFF] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-orbitron text-xs text-[#C0C0C0] tracking-widest uppercase mb-4">Services</h5>
            <ul className="space-y-2.5">
              {[
                { label: "1-on-1 Coaching", href: "#coaching" },
                { label: "Training Camps", href: "#coaching" },
                { label: "Online Coaching", href: "#coaching" },
                { label: "Appearances", href: "#contact" },
                { label: "Media / Press", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-exo text-sm text-[#9ab0c8] hover:text-[#00BFFF] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / CTA */}
          <div>
            <h5 className="font-orbitron text-xs text-[#C0C0C0] tracking-widest uppercase mb-4">Connect</h5>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: "YT", href: "https://www.youtube.com/@FlashGordonPool" },
                { label: "IG", href: "https://www.instagram.com/flashgordonpool" },
                { label: "TT", href: "https://www.tiktok.com/@flashgordonpool" },
                { label: "FB", href: "https://www.facebook.com/FlashGordonPool" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-orbitron text-xs font-bold w-10 h-10 flex items-center justify-center border border-[#00BFFF]/25 text-[#9ab0c8] hover:border-[#00BFFF] hover:text-[#00BFFF] rounded transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href="#coaching"
              className="inline-block font-orbitron text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded border border-[#F5C400]/60 text-[#F5C400] hover:bg-[#F5C400] hover:text-black transition-all duration-300"
            >
              Book Now
            </a>
          </div>

        </div>

        {/* Divider */}
        <hr className="hr-electric mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-exo text-xs text-[#9ab0c8]/60">
            &copy; {year} Flash Gordon Pool — Scott Gordon. All rights reserved.
          </p>
          <p className="font-orbitron text-xs text-[#00BFFF]/40 tracking-wider">
            BUILT FOR CHAMPIONS
          </p>
        </div>
      </div>
    </footer>
  );
}
