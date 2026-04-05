import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "Home",           href: "/" },
  { label: "About",          href: "/about" },
  { label: "Apparatus",      href: "/apparatus" },
  { label: "Active Members", href: "/members" },
  { label: "Join the Team",  href: "/join" },
  { label: "Fundraising",    href: "/fundraising" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0A0A0A", borderTop: "3px solid #8B0000" }}>

      {/* Main content */}
      <div className="wrap py-16 grid grid-cols-1 md:grid-cols-3 gap-12"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0" style={{ width: "80px", height: "80px" }}>
              <Image
                src="/images/badge.png"
                alt="Villa Hills Fire Department Badge"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
            <div>
              <div
                className="text-white uppercase leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", letterSpacing: "0.08em" }}
              >
                Villa Hills
              </div>
              <div
                className="uppercase mt-1"
                style={{ color: "#8B0000", fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.2em" }}
              >
                Fire Department
              </div>
              <div
                className="uppercase mt-1"
                style={{ color: "#374151", fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.2em" }}
              >
                Dedicated &amp; Proud · Est. 1955
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-body)", color: "#4b5563" }}>
            100% volunteer. ISO Class 4. Protecting Villa Hills and the unincorporated areas
            of St. Clair County since 1955.
          </p>
          <div className="w-8 h-px" style={{ background: "#8B0000" }} />
        </div>

        {/* NAV */}
        <div>
          <h4 className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold mb-6"
            style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}>
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}
                className="footer-link text-xs"
                style={{ fontFamily: "var(--font-body)" }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold mb-6"
            style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}>
            Find Us
          </h4>
          <div className="flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>

            <div>
              <div className="text-[0.55rem] tracking-widest uppercase mb-0.5" style={{ color: "#4b5563" }}>Station Address</div>
              <div className="text-white font-semibold text-xs" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
                100 Conniston Drive
              </div>
              <div className="text-gray-600 text-xs">Belleville, Illinois</div>
            </div>

            <div>
              <div className="text-[0.55rem] tracking-widest uppercase mb-0.5" style={{ color: "#4b5563" }}>Non-Emergency</div>
              <a href="tel:6185385369"
                className="text-white font-bold transition-colors hover:text-red-500"
                style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "0.05em" }}>
                618-538-5369
              </a>
            </div>

            <div>
              <div className="text-[0.55rem] tracking-widest uppercase mb-0.5" style={{ color: "#4b5563" }}>Emergency</div>
              <a href="tel:911"
                className="text-white font-bold transition-colors hover:text-red-500"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "0.05em" }}>
                9-1-1
              </a>
            </div>

            <div>
              <div className="text-[0.55rem] tracking-widest uppercase mb-0.5" style={{ color: "#4b5563" }}>Training Nights</div>
              <div className="text-gray-500 text-xs">Every Monday · 6:00 PM – 10:00 PM</div>
            </div>

          </div>
        </div>

      </div>

      {/* Sub-footer */}
      <div className="wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[0.6rem] tracking-widest uppercase" style={{ color: "#2d2d2d", fontFamily: "var(--font-body)" }}>
          © {year} Villa Hills Fire Protection District · Villa Hills, Illinois
        </p>
        <p className="text-[0.6rem] tracking-widest uppercase" style={{ color: "#2d2d2d", fontFamily: "var(--font-body)" }}>
          Dedicated &amp; Proud · Since 1955
        </p>
      </div>

    </footer>
  );
}
