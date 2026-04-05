import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";

/* ─────────────────────────────────────────────────────────────────────────
   VILLA HILLS FIRE DEPARTMENT — HOMEPAGE
   St. Clair County, Illinois · Since 1955 · Dedicated & Proud
───────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO — Full viewport. The trucks say everything.
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col justify-center"
        style={{
          minHeight: "100svh",
          marginTop: "calc(-2.5rem - 3.5rem)", /* pull under status + nav */
        }}
      >
        {/* Background carousel */}
        <HeroCarousel />

        {/* Overlay — heavy at bottom so stats strip reads clean */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Content */}
        <div
          className="relative z-10 wrap hero-content"
          style={{ paddingTop: "calc(2.5rem + 3.5rem + clamp(2rem, 6vw, 4rem))" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 fade-up">
            <span
              className="text-sm tracking-[0.2em] uppercase font-bold"
              style={{
                color: "#8B0000",
                fontSize: "0.95rem",
                background: "rgba(255,255,255,0.92)",
                borderRadius: "9999px",
                padding: "0.25rem 0.85rem",
              }}
            >
              St. Clair County, Illinois &nbsp;·&nbsp; Est. 1955
            </span>
          </div>

          {/* Main heading */}
          <div className="mb-6 fade-up-1">
            <div
              className="font-display text-gray-400 uppercase tracking-widest mb-1"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                fontWeight: 500,
                letterSpacing: "0.4em",
              }}
            >
              Protecting
            </div>
            <h1
              className="font-display text-white uppercase leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4.5rem, 13vw, 11rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 0.88,
              }}
            >
              Villa
              <br />
              <span style={{ color: "#8B0000" }}>Hills</span>
            </h1>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8 fade-up-2">
            <span className="block h-px flex-1 max-w-[3rem]" style={{ background: "rgba(139,0,0,0.6)" }} />
            <p
              className="text-gray-200 text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}
            >
              Dedicated &amp; Proud
            </p>
          </div>

          {/* Sub-copy */}
          <p
            className="text-gray-300 max-w-md mb-12 fade-up-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            Serving our community with courage and commitment.
            When every second counts, Villa Hills answers the call.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 fade-up-4">
            <Link href="/members" className="btn-fire w-full sm:w-auto justify-center">
              View Active Members
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="/fundraising" className="btn-outline w-full sm:w-auto justify-center">
              Support Our Department
            </Link>
          </div>
        </div>

        {/* Stats strip — bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            background: "rgba(10,10,10,0.92)",
            borderTop: "1px solid rgba(139,0,0,0.25)",
          }}
        >
          <div className="wrap py-4 sm:py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { value: "1955",        label: "Established",       sub: "" },
              { value: "70th",        label: "Anniversary",       sub: "" },
              { value: "24/7",        label: "Emergency Response", sub: "" },
              { value: "Villa Hills", label: "District",           sub: "" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-2 sm:px-4 py-1">
                <div
                  className="font-display text-white leading-none mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.2rem, 4vw, 2.2rem)",
                    fontWeight: 700,
                    color: "#8B0000",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-white font-semibold tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.55rem, 1.8vw, 0.75rem)" }}
                >
                  {stat.label}
                </div>
                <div className="text-white text-[0.6rem] tracking-wider uppercase mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#111111",
        }}
      >
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* TEXT BLOCK */}
            <div>
              <p className="section-label mb-6">Who We Are</p>
              <h2 className="heading-lg mb-8">
                Dedicated<br />
                <span style={{ color: "#8B0000" }}>&amp; Proud</span>
              </h2>
              <div
                className="space-y-4 mb-10"
                style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.75 }}
              >
                <p>
                  Villa Hills Fire Department has protected the residents of Villa Hills and the
                  unincorporated areas of St. Clair County since 1955. Seventy years of service built
                  on one foundation — the commitment to show up, every time, without hesitation.
                </p>
                <p>
                  Our firefighters are your neighbors. Trained professionals who live in this community,
                  raise families here, and have chosen to stand between danger and the people they love.
                </p>
                <p>
                  From structure fires to vehicle accidents, hazmat response to community education —
                  Villa Hills Fire Department is ready.
                </p>
              </div>


              <Link href="/about" className="btn-fire">
                Learn More About Us
              </Link>
            </div>

            {/* IMAGE BLOCK */}
            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src="/images/mural.jpg"
                  alt="Villa Hills Fire Department mural — Dedicated and Proud"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ border: "1px solid rgba(139,0,0,0.3)" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          70TH ANNIVERSARY CALLOUT — FULL BLEED
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#0d0d0d",
          borderTop: "1px solid rgba(139,0,0,0.2)",
          borderBottom: "1px solid rgba(139,0,0,0.2)",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 wrap">
          <div className="flex flex-col md:flex-row items-center gap-0">

            {/* 70 Years artwork */}
            <div
              className="relative shrink-0 mx-auto md:mx-0"
              style={{
                height: "min(70vw, 420px)",
                width: "min(70vw, 420px)",
                marginLeft: "clamp(-1rem, -3vw, -80px)",
              }}
            >
              <Image
                src="/images/70th-anniversary.png"
                alt="Villa Hills Fire Department 70th Anniversary"
                fill
                sizes="(max-width: 768px) 70vw, 420px"
                className="object-contain"
              />
            </div>

            {/* Text */}
            <div className="text-center md:text-left pb-6 md:pb-0" style={{ marginLeft: "clamp(0rem, 2vw, 2rem)" }}>
              <p className="section-label mb-4 justify-center md:justify-start">Milestone</p>
              <h2
                className="font-display text-white uppercase mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 700,
                  lineHeight: 0.92,
                }}
              >
                70 Years of
                <br />
                <span style={{ color: "#8B0000" }}>Service</span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#d1d5db",
                  maxWidth: "40rem",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                In 2025, Villa Hills Fire Protection District marks 70 years of dedicated service—protecting the residents and properties within our district and strengthening the community we serve.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          APPARATUS & RESPONSE — Horizontal panels, not cards
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#0A0A0A",
        }}
      >
        <div className="wrap">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="section-label mb-4">Fleet</p>
              <h2 className="heading-lg">
                Apparatus &amp;<br />
                <span style={{ color: "#8B0000" }}>Response</span>
              </h2>
            </div>
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src="/images/fleet-night.jpg"
                  alt="Villa Hills Fire Department apparatus"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0A0A0A 0%, transparent 40%)" }} />
              </div>
            </div>
          </div>

          {/* Horizontal panels */}
          <div className="flex flex-col gap-2">
            {[
              {
                unit: "Engine 5711",
                type: "Rosenbauer Rear-Mount Pumper",
                desc: "Primary attack engine. Rosenbauer rear-mount, 1,250 GPM pump, 1,000-gallon Pro Poly tank, Cummins L9 450HP. The department's first Rosenbauer.",
                status: "In Service",
              },
              {
                unit: "Engine 5712",
                type: "Attack Engine",
                desc: "Second-out engine providing additional suppression capability, mutual aid response, and multi-company fireground operations throughout the district.",
                status: "In Service",
              },
              {
                unit: "Tanker 5717",
                type: "Rosenbauer Pumper / Tanker",
                desc: "2020 Kenworth T440 built by Rosenbauer. 3,000-gallon Pro Poly tank, Waterous 750 GPM pump. Primary water supply for areas without hydrant access.",
                status: "In Service",
              },
            ].map((unit) => (
              <div key={unit.unit} className="panel group">
                {/* Unit designation */}
                <div className="shrink-0 w-32 sm:w-40">
                  <div
                    className="font-display text-white uppercase leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      fontWeight: 700,
                    }}
                  >
                    {unit.unit}
                  </div>
                  <div
                    className="text-xs tracking-wider uppercase mt-1"
                    style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
                  >
                    {unit.type}
                  </div>
                </div>

                {/* Separator */}
                <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* Description */}
                <p
                  className="flex-1 text-sm leading-relaxed text-gray-300"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {unit.desc}
                </p>

                {/* Status */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-green-600" />
                  <span className="text-xs tracking-wider uppercase text-gray-400 hidden sm:inline">
                    {unit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SUPPORT / FUNDRAISING — Strong callout, full bleed
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#8B0000",
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
        }}
      >
        {/* Subtle noise overlay for texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="wrap relative z-10">
          <div className="max-w-3xl">
            <p
              className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Support the Mission
            </p>
            <h2
              className="font-display text-white uppercase mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontWeight: 700,
                lineHeight: 0.9,
              }}
            >
              Keep Villa Hills
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Fighting Strong</span>
            </h2>
            <p
              className="text-lg mb-10 max-w-xl"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
              }}
            >
              Our department runs on community support. Every dollar goes directly to
              equipment, training, and the operational needs that keep your neighbors
              safe — every shift, every call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.paypal.com/ncp/payment/YFDSAQ6GNCCS4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#8B0000] font-bold tracking-wider uppercase text-sm transition-opacity hover:opacity-90 w-full sm:w-auto"
                style={{ fontFamily: "var(--font-display)", fontSize: "1rem", minHeight: "52px" }}
              >
                Donate Now
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold tracking-wider uppercase text-sm border border-white/30 hover:border-white/70 transition-colors w-full sm:w-auto"
                style={{ fontFamily: "var(--font-display)", fontSize: "1rem", minHeight: "52px" }}
              >
                Learn How It Helps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMMUNITY ENGAGEMENT — Human, not corporate
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#111111",
        }}
      >
        <div className="wrap">
          <div className="mb-14">
            <p className="section-label mb-4">Community</p>
            <h2 className="heading-lg max-w-lg">
              Beyond
              <br />
              <span style={{ color: "#8B0000" }}>the Station</span>
            </h2>
          </div>

          {/* Asymmetric community grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(139,0,0,0.15)" }}>
            {[
              {
                icon: "🔥",
                title: "Fire Safety & Prevention",
                desc: "Villa Hills Fire Protection District focuses on proactive fire prevention through public outreach, including free smoke detector installations, home safety guidance, and fire risk education to help protect our residents before emergencies occur.",
                tag: "Outreach",
              },
              {
                icon: "📡",
                title: "Community Updates",
                desc: "Stay connected with real-time department updates, safety information, and incident awareness through our official communication channels. We use social media to keep our community informed, prepared, and aware.",
                tag: "Information",
              },
              {
                icon: "🤝",
                title: "Public Relations Requests",
                desc: "Requests for station visits or public appearances may be submitted for consideration. Due to limited volunteer staffing and emergency response priorities, availability cannot be guaranteed, but we will make every effort to accommodate when possible.",
                tag: "Public Requests",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="community-card group p-8"
              >
                {/* Tag */}
                <div
                  className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold mb-6"
                  style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
                >
                  {item.tag}
                </div>
                {/* Icon */}
                <div className="text-3xl mb-4 opacity-70">{item.icon}</div>
                {/* Title */}
                <h3
                  className="font-display text-white uppercase mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h3>
                {/* Desc */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "#d1d5db" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          EMERGENCY NOTICE PLACEHOLDER (automation-ready)
          → Future: pull from API, email, or CMS
      ══════════════════════════════════════════════════════════════ */}
      {/*
        To activate: Remove the comment wrapper and replace with live data
        <AnnouncementBanner message="..." type="info|warning|emergency" />
      */}

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(139,0,0,0.2)",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
        }}
      >
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3
              className="font-display text-white uppercase text-2xl mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Ready to join?
            </h3>
            <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Villa Hills Fire Department is always looking for dedicated members.
            </p>
          </div>
          <div className="flex w-full sm:w-auto">
            <Link href="/apply" className="btn-fire w-full sm:w-auto">Apply Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
