import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fundraising",
  description: "Support Villa Hills Fire Department — your donations fund equipment, training, and the resources that protect St. Clair County, Illinois.",
};

export default function FundraisingPage() {
  return (
    <>
      {/* PAGE HEADER — Red, full bleed, commanding */}
      <section
        className="relative flex items-end"
        style={{
          minHeight: "50vh",
          background: "#8B0000",
          overflow: "hidden",
        }}
      >
        {/* Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="wrap relative z-10 pb-16 pt-24">
          <p
            className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-6"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
          >
            Support the Mission
          </p>
          <h1
            className="font-display text-white uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 700,
              lineHeight: 0.9,
            }}
          >
            Fundraising
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>&amp; Support</span>
          </h1>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#111111",
        }}
      >
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-6">Why It Matters</p>
              <h2 className="heading-lg mb-8">
                Your Support
                <br />
                <span style={{ color: "#8B0000" }}>Saves Lives</span>
              </h2>
              <div
                className="space-y-4 text-sm leading-relaxed mb-10"
                style={{ fontFamily: "var(--font-body)", color: "#d1d5db" }}
              >
                <p>
                  Villa Hills Fire Department is funded by our community. Donations directly
                  support the equipment, training, and operational resources that allow us to
                  respond effectively — every time the tones drop.
                </p>
                <p>
                  From purchasing new apparatus to maintaining gear that firefighters depend on
                  with their lives, community financial support is the backbone of everything we do.
                </p>
                <p>
                  When you donate to Villa Hills Fire Department, you are investing in the safety
                  of every family in St. Clair County.
                </p>
              </div>
              {/* Placeholder donation CTA — replace href with actual donation link */}
              <a
                href="#donate"
                className="btn-fire"
                aria-label="Donate to Villa Hills Fire Department"
              >
                Donate Now
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Fleet photo + stats */}
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image
                  src="/images/fleet-night.jpg"
                  alt="Villa Hills Fire Department fleet — Engine 5712 &amp; Tanker 5717"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid rgba(139,0,0,0.3)" }} />
              </div>
              <div className="grid grid-cols-3 gap-px w-full" style={{ background: "rgba(139,0,0,0.2)" }}>
                {[
                  { num: "70",    label: "Years of Service" },
                  { num: "24/7",  label: "Response Ready" },
                  { num: "100%",  label: "Community Funded" },
                ].map((s) => (
                  <div key={s.label} className="text-center py-6 px-2" style={{ background: "#111111" }}>
                    <div
                      className="font-display text-white font-bold"
                      style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "#8B0000" }}
                    >
                      {s.num}
                    </div>
                    <div className="text-gray-400 text-[0.6rem] tracking-widest uppercase mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHERE IT GOES */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#0A0A0A",
          borderTop: "1px solid rgba(139,0,0,0.15)",
        }}
      >
        <div className="wrap">
          <p className="section-label mb-4">Allocation</p>
          <h2 className="heading-lg mb-12">
            Where Your<br />
            <span style={{ color: "#8B0000" }}>Money Goes</span>
          </h2>

          <div className="flex flex-col gap-2">
            {[
              {
                category: "Apparatus & Equipment",
                pct: 40,
                desc: "Trucks, hoses, tools, SCBA gear, and the high-cost equipment our firefighters need to do their job safely.",
              },
              {
                category: "Training & Certification",
                pct: 25,
                desc: "Continuous professional development — keeping every member current with the latest fire, rescue, and EMS techniques.",
              },
              {
                category: "Station Operations",
                pct: 20,
                desc: "Utilities, maintenance, and the day-to-day operational costs of keeping the station ready and functional.",
              },
              {
                category: "Community Programs",
                pct: 15,
                desc: "Fire prevention education, school visits, public safety events, and community engagement initiatives.",
              },
            ].map((item) => (
              <div key={item.category} className="panel">
                <div className="w-16 text-right shrink-0">
                  <span
                    className="font-display font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "#8B0000", fontSize: "1.4rem" }}
                  >
                    {item.pct}%
                  </span>
                </div>
                <div className="flex-1">
                  <div
                    className="font-display text-white font-bold uppercase mb-1"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}
                  >
                    {item.category}
                  </div>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
                    {item.desc}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-24 hidden sm:block">
                  <div className="h-1 bg-white/5 w-full">
                    <div className="h-1" style={{ background: "#8B0000", width: `${item.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATE SECTION — anchor target */}
      <section
        id="donate"
        style={{
          background: "#111111",
          borderTop: "1px solid rgba(139,0,0,0.2)",
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
        }}
      >
        <div className="wrap max-w-2xl">
          <p className="section-label mb-6">Make a Difference</p>
          <h2 className="heading-lg mb-6">
            Support
            <br />
            <span style={{ color: "#8B0000" }}>Villa Hills</span>
          </h2>
          <p
            className="text-sm leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-body)", color: "#d1d5db" }}
          >
            Ready to donate? Contact the department directly or use the options below.
            Every contribution — of any size — makes a direct impact on our ability to serve.
          </p>

          {/* Donation options placeholder */}
          <div
            className="p-8 mb-8"
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(139,0,0,0.3)",
            }}
          >
            <div
              className="text-[0.6rem] tracking-[0.3em] uppercase mb-4"
              style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
            >
              Donation Methods
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-300" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex items-start gap-3">
                <span style={{ color: "#8B0000" }}>→</span>
                <span>Mail a check to: Villa Hills Fire Department, Villa Hills, IL</span>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: "#8B0000" }}>→</span>
                <span>Online donation portal — link coming soon</span>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: "#8B0000" }}>→</span>
                <span>Contact the department directly to arrange a donation</span>
              </div>
            </div>
          </div>

          <Link href="/about" className="btn-outline">
            Contact the Department
          </Link>
        </div>
      </section>
    </>
  );
}
