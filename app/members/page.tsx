import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Active Members",
  description: "Villa Hills Fire Department active members — ISO Class 4, 100% volunteer, serving Villa Hills and unincorporated St. Clair County.",
};

const LINE_OFFICERS = [
  { rank: "Chief",              name: "Steven Allen",       radio: "5700" },
  { rank: "Assistant Chief",    name: "Michael Kempf",      radio: "5701" },
  { rank: "Captain",            name: "Frank Stell",        radio: "5702" },
  { rank: "Captain",            name: "Brian Steiner",      radio: "5703" },
  { rank: "Captain",            name: "Matt Arnold",        radio: "5704" },
  { rank: "Captain",            name: "Joseph Weik",        radio: "5705" },
  { rank: "Lieutenant",         name: "Jacob Stell",        radio: "5706" },
  { rank: "Lieutenant",         name: "Michael Pond-Jones", radio: "5707" },
];

const MEMBERS = [
  { rank: "Firefighter",              name: "James Griffin"      },
  { rank: "Driver / Operator",        name: "Kevin Collier"      },
  { rank: "Engineer",                 name: "Steve White"        },
  { rank: "Firefighter",              name: "Brian Buescher"     },
  { rank: "Firefighter",              name: "Braeden Pfeil"      },
  { rank: "Firefighter",              name: "Alex Prost"         },
  { rank: "Firefighter",              name: "Hudson Wills"       },
  { rank: "Probationary Firefighter", name: "Hunter Arnold"      },
  { rank: "Probationary Firefighter", name: "Lucas Grohmann"     },
  { rank: "Secretary",                name: "Kati Hrabusicky"    },
  { rank: "Support Staff",            name: "Angie Allen"        },
];

export default function MembersPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative flex items-center"
        style={{ minHeight: "40vh", background: "#0d0d0d", borderBottom: "1px solid rgba(139,0,0,0.2)" }}
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
          <p className="section-label mb-6">Villa Hills Fire Protection District</p>
          <h1
            className="font-display text-white uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 700, lineHeight: 0.9 }}
          >
            Active
            <br />
            <span style={{ color: "#8B0000" }}>Members</span>
          </h1>
          {/* Dept descriptor */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "ISO Rating", value: "Class 4" },
              { label: "Staffing", value: "100% Volunteer" },
              { label: "Training", value: "Every Monday · 6–10 PM" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "#8B0000" }}>{s.value}</div>
                <div className="text-[0.6rem] tracking-widest uppercase text-gray-400" style={{ fontFamily: "var(--font-body)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINE OFFICERS */}
      <section style={{ paddingTop: "var(--spacing-section)", paddingBottom: "4rem", background: "#111111" }}>
        <div className="wrap">
          <p className="section-label mb-4">Command Staff</p>
          <h2 className="heading-lg mb-3">
            Line <span style={{ color: "#8B0000" }}>Officers</span>
          </h2>
          <p className="text-sm text-gray-400 mb-12" style={{ fontFamily: "var(--font-body)" }}>
            Listed in order of rank with MABAS (Mutual Aid Box Alarm System) radio identifier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(139,0,0,0.12)" }}>
            {LINE_OFFICERS.map((m) => (
              <div key={m.radio} className="flex items-center gap-5 p-7" style={{ background: "#111111" }}>
                {/* Radio ID badge */}
                <div
                  className="shrink-0 w-16 h-16 flex items-center justify-center font-bold"
                  style={{ border: "2px solid rgba(139,0,0,0.6)", color: "#8B0000", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
                >
                  {m.radio}
                </div>
                <div>
                  <div className="text-white font-bold uppercase" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em", fontSize: "1.15rem" }}>
                    {m.name}
                  </div>
                  <div className="tracking-widest uppercase mt-1" style={{ color: "#8B0000", fontFamily: "var(--font-body)", fontSize: "0.75rem" }}>
                    {m.rank}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Helmets photo */}
          <div className="mt-12 relative overflow-hidden" style={{ aspectRatio: "16/7" }}>
            <Image
              src="/images/helmets.jpg"
              alt="Villa Hills Fire Department helmets by rank"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.6) 0%, transparent 40%, transparent 60%, rgba(10,10,10,0.6) 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <span className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
                Rank Helmets — Captain · Asst. Chief · Lieutenant · Engineer · Firefighter · Probationary
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL ROSTER */}
      <section style={{ paddingTop: "4rem", paddingBottom: "var(--spacing-section)", background: "#111111" }}>
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-12">
            <div>
              <p className="section-label mb-4">Full Roster</p>
              <h2 className="heading-lg">
                The <span style={{ color: "#8B0000" }}>Team</span>
              </h2>
            </div>
            {/* VFA badge */}
            <div className="flex justify-end">
              <div className="relative" style={{ width: "140px", height: "180px" }}>
                <Image
                  src="/images/vfa-badge.png"
                  alt="Villa Hills Volunteer Fire Association Badge No. 1"
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
            {MEMBERS.map((m, i) => (
              <div key={i} className="panel" style={{ borderLeft: "2px solid rgba(139,0,0,0.3)", padding: "1.25rem 1.5rem" }}>
                <div className="shrink-0 w-8 text-gray-400 text-sm font-mono font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>
                    {m.name}
                  </div>
                </div>
                <div className="tracking-widest uppercase shrink-0" style={{ color: "#8B0000", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>
                  {m.rank}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-center" style={{ color: "#374151", fontFamily: "var(--font-body)" }}>
            Roster current as of 2025. Contact the department for the most up-to-date information.
          </p>

          {/* Team photo */}
          <div className="mt-12 relative overflow-hidden" style={{ aspectRatio: "16/7" }}>
            <Image
              src="/images/team-photo.jpg"
              alt="Villa Hills Fire Department team"
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.7) 0%, transparent 50%)" }} />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
                Villa Hills Fire Protection District · Team Photo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITING INFO */}
      <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(139,0,0,0.2)", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)" }}>
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-label mb-4">Now Accepting Applications</p>
              <h2 className="heading-lg mb-6">
                Probationary<br />
                <span style={{ color: "#8B0000" }}>Firefighter Candidates</span>
              </h2>
              <div className="space-y-4 mb-10" style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.8 }}>
                <p>
                  The Villa Hills Fire Protection District is currently accepting applications for
                  probationary firefighter candidates. All applicants must be a minimum of
                  <strong className="text-white"> 18 years of age</strong> and must reside within
                  a <strong className="text-white">15-minute response time</strong> to the fire station.
                </p>
                <p>
                  All applicants must possess a valid Illinois driver's license at the time of application
                  and will be subjected to a comprehensive background check by local law enforcement agencies.
                </p>
                <p>
                  Pending approval by the VHFD board of directors, all successful applicants will be placed
                  on a mandatory <strong className="text-white">six (6) month probationary period</strong> during
                  which the candidate is required to attend <strong className="text-white">all</strong> scheduled
                  meetings and training sessions.
                </p>
                <p>
                  Weekly training sessions and meetings are held every
                  <strong className="text-white"> Monday evening from 6:00 PM to 10:00 PM</strong>.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/apply" className="btn-fire">Apply Online</Link>
                <Link href="/join" className="btn-outline">Learn More</Link>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-2">
              {[
                { label: "Station Address", value: "100 Conniston Drive", sub: "Villa Hills, Illinois" },
                { label: "Phone", value: "618-538-5369", sub: "Call or leave a message" },
                { label: "Training Nights", value: "Every Monday", sub: "6:00 PM – 10:00 PM" },
                { label: "Minimum Age", value: "18 Years", sub: "At time of application" },
                { label: "Response Requirement", value: "15-Minute Response Time", sub: "Must reside within" },
              ].map((item) => (
                <div key={item.label} className="panel" style={{ borderLeft: "2px solid rgba(139,0,0,0.4)" }}>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>{item.value}</div>
                    <div className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{item.sub}</div>
                  </div>
                  <div className="text-[0.6rem] tracking-widest uppercase shrink-0" style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
