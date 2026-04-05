import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "Apparatus Gallery",
  description: "Villa Hills Fire Protection District apparatus gallery — current fleet and historical vehicles.",
};

const CURRENT = [
  { src: "/images/station-night.jpg",           caption: "Villa Hills Station — Night" },
  { src: "/images/fleet-night.jpg",             caption: "Engine 5712 & Tanker 5717 — Night" },
  { src: "/images/apparatus-bay.jpg",           caption: "Apparatus Bay — Current Fleet" },
  { src: "/images/tankers.jpg",                 caption: "Engine 5711 & Tanker 5717" },
  { src: "/images/tanker-parade.png",           caption: "Tanker 5717 — Parade" },
  { src: "/images/tanker-5717-bay.jpg",         caption: "Tanker 5717 — In the Bay" },
  { src: "/images/engine-5711-front-show.jpg",  caption: "Engine 5711 — Front" },
  { src: "/images/engine-5711-front.jpg",       caption: "Engine 5711 — Front Profile" },
  { src: "/images/engine-5711-side.jpg",        caption: "Engine 5711 — Driver Side" },
  { src: "/images/engine-5711-a.png",           caption: "Engine 5711 — Quarter View" },
  { src: "/images/engine-5711-b.png",           caption: "Engine 5711 — Side View" },
  { src: "/images/apparatus/engine-historical-4.png", caption: "Engine 5712 — Side View" },
];

const HISTORICAL = [
  { src: "/images/apparatus/engine-370.png",          caption: "Engine 370" },
  { src: "/images/apparatus/engine-371.png",          caption: "Engine 371" },
  { src: "/images/apparatus/engine-historical-1.png", caption: "Engine — Historical" },
  { src: "/images/apparatus/engine-historical-2.png", caption: "Engine — Historical" },
  { src: "/images/apparatus/engine-372-a.png",        caption: "Engine 372" },
  { src: "/images/apparatus/engine-372-b.png",        caption: "Engine 372 — Road Shot" },
  { src: "/images/apparatus/engine-historical-3.png", caption: "Engine — Historical" },
  { src: "/images/apparatus/engine-historical-5.png", caption: "Engine — Historical" },
  { src: "/images/apparatus/tanker-old.png",          caption: "Tanker 273 — Historical" },
  { src: "/images/apparatus/tanker-chrome-a.png",     caption: "Tanker — Historical" },
  { src: "/images/apparatus/tanker-chrome-b.png",     caption: "Tanker — Historical" },
  { src: "/images/apparatus/brush-truck.png",         caption: "Brush Truck #911" },
];

function SpecBlock({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div
        className="text-[0.6rem] tracking-[0.3em] uppercase font-semibold mb-3"
        style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {items.map(([label, value]) => (
          <div key={label} className="flex gap-3 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <span className="shrink-0 text-gray-400 w-36">{label}</span>
            <span className="text-gray-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ApparatusPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative flex items-end"
        style={{ minHeight: "40vh", background: "#8B0000", overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="wrap relative z-10 pb-16 pt-24">
          <p className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-6"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>
            Villa Hills Fire Protection District
          </p>
          <h1 className="font-display text-white uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 700, lineHeight: 0.9 }}>
            Apparatus
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Gallery</span>
          </h1>
        </div>
      </section>

      {/* ── CURRENT FLEET PHOTOS ── */}
      <section style={{ background: "#0A0A0A", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)" }}>
        <div className="wrap">
          <div className="mb-12">
            <p className="section-label mb-4">Active Fleet</p>
            <h2 className="heading-lg">
              Current<br />
              <span style={{ color: "#8B0000" }}>Apparatus</span>
            </h2>
          </div>

          <PhotoGallery photos={CURRENT} bg="#111" />
        </div>
      </section>

      {/* ── ENGINE 5711 SPECS ── */}
      <section style={{ background: "#111111", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)", borderTop: "1px solid rgba(139,0,0,0.2)" }}>
        <div className="wrap">
          <p className="section-label mb-4">Current Fleet</p>
          <h2 className="heading-lg mb-12">
            Engine 5711<br />
            <span style={{ color: "#8B0000" }}>Rosenbauer Rear-Mount Pumper</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Villa Hills Fire Protection District took delivery of this Rosenbauer rear-mount pumper — the
                department's first Rosenbauer. Engine 5711 serves as the primary attack engine, staffed by
                approximately twenty volunteers responding to roughly 50 calls per year.
              </p>
              <div className="flex flex-col gap-8">
                <SpecBlock title="Chassis & Power" items={[
                  ["Chassis", "Avenger — 60″ Cab, 11″ Raised Roof"],
                  ["Engine", "Cummins L9 — 450 HP"],
                  ["Interior", "Line X Finish"],
                ]} />
                <SpecBlock title="Fire Suppression" items={[
                  ["Pump", "N Series — 1,250 GPM Rear Mount"],
                  ["Tank", "Pro Poly — 1,000 Gallon"],
                  ["Foam System", "Foam Pro 2001 — 30 Gallon Class A"],
                  ["Crosslays", "Two (2) 1.75″ Front Bumper Crosslays"],
                ]} />
                <SpecBlock title="Features" items={[
                  ["Body", "FX Aluminum Body"],
                  ["Access", "EZ Climb Access Ladder"],
                  ["Pump Controls", "Lever Bank"],
                  ["Hosebed", "Power Hosebed Covers"],
                  ["Lighting", "Federal Signal Warning Lights / Akron Revel Scene Lights"],
                  ["Storage", "Oil Dry Compartment in Wheelwell"],
                ]} />
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/images/engine-5711-front-show.jpg"
                alt="Engine 5711 — Villa Hills Fire Protection District"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid rgba(139,0,0,0.3)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TANKER 5717 SPECS ── */}
      <section style={{ background: "#0A0A0A", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)", borderTop: "1px solid rgba(139,0,0,0.2)" }}>
        <div className="wrap">
          <p className="section-label mb-4">Current Fleet</p>
          <h2 className="heading-lg mb-12">
            Tanker 5717<br />
            <span style={{ color: "#8B0000" }}>3,000 Gallon Pumper / Tanker</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/images/tanker-5717-bay.jpg"
                alt="Tanker 5717 — Villa Hills Fire Protection District"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid rgba(139,0,0,0.3)" }} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-body)", color: "#d1d5db", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Villa Hills Fire Protection District continues to invest in modern, capable apparatus with the
                addition of Tanker 5717 — a 2020 Kenworth T440 built by Rosenbauer. Designed for both water
                supply and fireground operations, this unit strengthens the department's ability to operate
                effectively in areas without hydrant access, providing rapid water delivery and sustained
                fire suppression capabilities across initial attack and extended incidents.
              </p>
              <div className="flex flex-col gap-8">
                <SpecBlock title="Chassis & Power" items={[
                  ["Chassis", "Kenworth T440"],
                  ["Engine", "PACCAR PX-9 — 400 HP"],
                ]} />
                <SpecBlock title="Fire Suppression" items={[
                  ["Pump", "Waterous CXVK — 750 GPM"],
                  ["Tank", "Pro Poly — 3,000 Gallons"],
                ]} />
                <SpecBlock title="Operational Features" items={[
                  ["Body", "FX Aluminum — reduced weight"],
                  ["Access", "EZ Climb Access Ladder"],
                  ["Dump Valves", "Dual power dump (rear & between tandems)"],
                  ["Tank Storage", "Power drop-down for efficient equipment access"],
                ]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HISTORICAL ── */}
      <section style={{ background: "#111111", paddingTop: "var(--spacing-section)", paddingBottom: "var(--spacing-section)", borderTop: "1px solid rgba(139,0,0,0.2)" }}>
        <div className="wrap">
          <div className="mb-12">
            <p className="section-label mb-4">Through the Years</p>
            <h2 className="heading-lg">
              Historical<br />
              <span style={{ color: "#8B0000" }}>Apparatus</span>
            </h2>
          </div>

          <PhotoGallery photos={HISTORICAL} bg="#0A0A0A" />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", borderTop: "1px solid rgba(139,0,0,0.2)", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-white uppercase text-2xl mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Interested in joining?
            </h3>
            <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Help us staff and operate this equipment. Villa Hills is always accepting volunteers.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/join" className="btn-fire">Join the Team</Link>
            <Link href="/about" className="btn-outline">About the Department</Link>
          </div>
        </div>
      </section>
    </>
  );
}
