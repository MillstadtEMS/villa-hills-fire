import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Join the Team",
  description: "Become a volunteer firefighter with Villa Hills Fire Protection District. We are always accepting ambitious, community-minded volunteers.",
};

const REQUIREMENTS = [
  { title: "Minimum Age", desc: "Must be at least 18 years of age at the time of application." },
  { title: "Illinois Resident", desc: "Must reside within or near the Villa Hills Fire Protection District." },
  { title: "Physical Fitness", desc: "Must be able to perform the physical demands of firefighting operations." },
  { title: "Background Check", desc: "All applicants are subject to a thorough background review." },
  { title: "Training Commitment", desc: "Must be available to attend Monday night training sessions on a regular basis." },
  { title: "Dedication", desc: "A genuine commitment to serving and protecting your community." },
];

const BENEFITS = [
  { icon: "🧯", title: "Hands-On Training", desc: "Structured in-house training led by experienced members covering firefighting operations, equipment, and emergency response fundamentals." },
  { icon: "🤝", title: "Brotherhood & Sisterhood", desc: "Join a tight-knit team with deep roots in St. Clair County since 1955." },
  { icon: "🚒", title: "Modern Apparatus", desc: "Operate and train on modern, well-maintained fire apparatus." },
  { icon: "📜", title: "Certifications", desc: "Earn certifications that build your professional résumé and expand your skills." },
  { icon: "🏘️", title: "Community Impact", desc: "Make a real difference in the lives of your neighbors every single shift." },
  { icon: "🎖️", title: "Veterans Welcome", desc: "We proudly welcome veterans and value the discipline and leadership military service instills." },
];

export default function JoinPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "60vh", background: "#0A0A0A" }}
      >
        <Image
          src="/images/apparatus-bay.jpg"
          alt="Villa Hills Fire Department apparatus bay"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 40%", opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0A 10%, transparent 70%)" }} />

        <div className="wrap relative z-10 pb-20 pt-40">
          <p
            className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-6"
            style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
          >
            Villa Hills Fire Protection District
          </p>
          <h1
            className="font-display text-white uppercase mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 9vw, 8rem)",
              fontWeight: 700,
              lineHeight: 0.88,
            }}
          >
            Join<br />
            <span style={{ color: "#8B0000" }}>the Team</span>
          </h1>
          <p
            className="text-gray-300 max-w-xl mb-10"
            style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.75 }}
          >
            We are always accepting ambitious, community-minded volunteers who are ready
            to answer the call. If you have the drive to serve and protect, Villa Hills
            has a place for you.
          </p>
          <Link href="/apply" className="btn-fire" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
            Apply Now
            <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* WHY JOIN */}
      <section style={{ background: "#111111", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)" }}>
        <div className="wrap">
          <div className="mb-14 max-w-2xl">
            <p className="section-label mb-4">Why Volunteer</p>
            <h2 className="heading-lg mb-6">
              More Than a<br />
              <span style={{ color: "#8B0000" }}>Title</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.75 }}>
              Becoming a Villa Hills volunteer firefighter means joining a legacy of service that
              has protected this district for 70 years. You'll gain skills, earn certifications,
              and build relationships that last a lifetime — all while making a direct impact
              on the community you call home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(139,0,0,0.15)" }}>
            {BENEFITS.map((b) => (
              <div key={b.title} className="community-card p-8" style={{ background: "#111111" }}>
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3
                  className="font-display text-white uppercase mb-3"
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700 }}
                >
                  {b.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section style={{ background: "#0A0A0A", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)" }}>
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-label mb-4">What We Look For</p>
              <h2 className="heading-lg mb-6">
                Basic<br />
                <span style={{ color: "#8B0000" }}>Requirements</span>
              </h2>
              <p style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                No prior firefighting experience is required to apply. We will train you.
                What we do require is the commitment, character, and drive to show up —
                for your team and your community.
              </p>
              <Link href="/apply" className="btn-fire">
                Start Your Application
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {REQUIREMENTS.map((r) => (
                <div key={r.title} className="panel">
                  <div className="shrink-0 w-36">
                    <div
                      className="font-display text-white uppercase text-sm font-bold"
                      style={{ fontFamily: "var(--font-display)", color: "#8B0000" }}
                    >
                      {r.title}
                    </div>
                  </div>
                  <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <p className="flex-1 text-sm text-gray-300" style={{ fontFamily: "var(--font-body)" }}>
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#8B0000", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)" }}
      >
        <div className="wrap relative z-10 text-center">
          <h2
            className="font-display text-white uppercase mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, lineHeight: 0.9 }}
          >
            Ready to Answer<br />the Call?
          </h2>
          <p
            className="mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}
          >
            Complete our online application and a member of our department will be in touch
            to walk you through the next steps.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold tracking-wider uppercase text-sm transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-display)", color: "#8B0000" }}
            >
              Apply Online
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white font-bold tracking-wider uppercase text-sm hover:border-white/80 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
