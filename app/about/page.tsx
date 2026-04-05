import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Villa Hills Fire Department — our history, mission, and commitment to St. Clair County, Illinois since 1955.",
};

export default function AboutPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative flex items-center"
        style={{
          minHeight: "40vh",
          background: "#0d0d0d",
          borderBottom: "1px solid rgba(139,0,0,0.2)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="wrap relative z-10 py-20">
          <p className="section-label mb-6">Villa Hills Fire Department</p>
          <h1
            className="font-display text-white uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 700,
              lineHeight: 0.9,
            }}
          >
            About
            <br />
            <span style={{ color: "#8B0000" }}>Our Department</span>
          </h1>
        </div>
      </section>

      {/* MISSION */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#111111",
        }}
      >
        <div className="wrap max-w-3xl">
          <p className="section-label mb-6">Our Mission</p>
          <h2 className="heading-lg mb-8">
            Protect.<br />
            <span style={{ color: "#8B0000" }}>Serve. Respond.</span>
          </h2>
          <div
            className="space-y-5 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "#d1d5db" }}
          >
            <p>
              Villa Hills Fire Department exists for one purpose: to protect the lives and
              property of every person in St. Clair County, Illinois. That mission has not
              changed in seventy years, and it never will.
            </p>
            <p>
              Founded in 1955, our department has grown from a small community volunteer
              organization into a modern, professionally equipped fire and rescue service —
              while never losing the community spirit that built us.
            </p>
            <p>
              We train continuously. We invest in equipment. We show up — for fires, for
              accidents, for mutual aid response, for medical emergencies, and for the
              community events that make Villa Hills home.
            </p>
          </div>
        </div>
      </section>

      {/* HISTORY TIMELINE */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#0A0A0A",
          borderTop: "1px solid rgba(139,0,0,0.15)",
        }}
      >
        <div className="wrap">
          <p className="section-label mb-4">Our History</p>
          <h2 className="heading-lg mb-14">
            A History Written<br />
            <span style={{ color: "#8B0000" }}>in Apparatus</span>
          </h2>
          <div className="flex flex-col gap-0 max-w-3xl">
            {[
              { year: "1947",  event: "Mack Pumper — One of the earliest pieces of equipment associated with the department's history, representing the foundation of fire protection in the community." },
              { year: "1960s", event: "American LaFrance & Pirsch Pumpers — As the district grew, more capable apparatus were placed into service to meet increasing demand and expand response capability." },
              { year: "1970s", event: "Seagrave & Dodge Mini-Pumper — The department continued to evolve with versatile apparatus designed for both structure fires and rural response." },
              { year: "1980s", event: "Pirsch & Spartan Apparatus — Modernization efforts brought improved pumping capacity and reliability to the fleet." },
              { year: "1990s", event: "Spartan / Luverne Pumper — A transition toward more advanced apparatus platforms supporting expanded operational needs." },
              { year: "2000s", event: "Freightliner Tanker — Increased water supply capability strengthened fireground operations, particularly in non-hydranted areas." },
              { year: "2010s", event: "Fleet Modernization — Continued investment in updated apparatus to improve response efficiency, safety, and capability." },
              { year: "2020s", event: "Rosenbauer Apparatus — The addition of modern Rosenbauer equipment, including a rear-mount Avenger engine and a 3,000-gallon pumper/tanker, represents the current standard of performance and reliability for the department." },
            ].map((item, i, arr) => (
              <div
                key={item.year}
                className="flex gap-6 pb-10 relative"
                style={{
                  borderLeft: i < arr.length - 1 ? "1px solid rgba(139,0,0,0.3)" : "1px solid transparent",
                  paddingLeft: "2.5rem",
                  marginLeft: "0.75rem",
                }}
              >
                <div className="absolute w-3 h-3 rounded-full" style={{ background: "#8B0000", left: "-6px", top: "8px" }} />
                <div>
                  <div
                    className="font-display font-bold mb-2 uppercase"
                    style={{ fontFamily: "var(--font-display)", color: "#8B0000", fontSize: "1.6rem", lineHeight: 1 }}
                  >
                    {item.year}
                  </div>
                  <p className="text-gray-300" style={{ fontFamily: "var(--font-body)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BADGE SHOWCASE */}
      <section
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(139,0,0,0.15)",
          borderBottom: "1px solid rgba(139,0,0,0.15)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="wrap flex flex-col items-center text-center">
          <div className="relative shrink-0" style={{ width: "min(500px, 85vw)", height: "min(500px, 85vw)" }}>
            <Image
              src="/images/badge.png"
              alt="Villa Hills Fire Department Badge"
              fill
              sizes="(max-width: 768px) 85vw, 520px"
              className="object-contain"
            />
          </div>
          {/* "Our Identity" — no dash, centered above heading */}
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#8B0000",
              textAlign: "center",
            }}
          >
            Our Identity
          </p>
          <h2 className="heading-lg mb-6">
            <span style={{ color: "#8B0000" }}>Dedicated</span><br />
            &amp; Proud
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xl"
            style={{ fontFamily: "var(--font-body)", color: "#d1d5db" }}
          >
            The Villa Hills Fire Department badge is more than an emblem — it represents
            the commitment of every firefighter who has worn it. St. Clair County,
            Illinois. Since 1955. Dedicated &amp; Proud is not just a motto. It is a standard
            that every member of this department is held to, every single day.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#111111", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="wrap flex flex-col sm:flex-row gap-4">
          <Link href="/members" className="btn-fire">View Active Members</Link>
          <Link href="/fundraising" className="btn-outline">Support the Department</Link>
        </div>
      </section>
    </>
  );
}
