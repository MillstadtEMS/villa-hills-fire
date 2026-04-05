import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raffle Tickets",
  description: "Purchase raffle tickets to support Villa Hills Fire Department. We hold a summer raffle and a winter raffle each year.",
};

export default function RafflePage() {
  return (
    <>
      {/* PAGE HEADER */}
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
        {/* Raffle wheel graphic — top right accent */}
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-20 flex items-center" style={{ width: "min(55vw, 600px)" }}>
          <RaffleWheelSVG />
        </div>
        <div className="wrap relative z-10 pb-16 pt-24">
          <p
            className="text-[0.65rem] tracking-[0.35em] uppercase font-semibold mb-6"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
          >
            Support the Department
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
            Raffle
            <br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Tickets</span>
          </h1>
        </div>
      </section>

      {/* RAFFLES */}
      <section
        style={{
          paddingTop: "var(--spacing-section)",
          paddingBottom: "var(--spacing-section)",
          background: "#111111",
        }}
      >
        <div className="wrap">
          <p className="section-label mb-6">Annual Raffles</p>
          <h2 className="heading-lg mb-10">
            Two Chances<br />
            <span style={{ color: "#8B0000" }}>Each Year</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Summer Raffle */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(139,0,0,0.25)",
                padding: "2.5rem",
              }}
            >
              <div className="w-8 mb-6" style={{ height: "2px", background: "#8B0000" }} />
              <div
                className="text-[0.6rem] tracking-[0.3em] uppercase mb-3"
                style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
              >
                Summer
              </div>
              <h3
                className="font-display text-white uppercase mb-4"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.05em" }}
              >
                Summer Raffle
              </h3>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)", color: "#9ca3af" }}
              >
                {/* PLACEHOLDER — add summer raffle details here */}
                Details coming soon. Check back or contact the department for prize information and ticket availability.
              </p>
              <div
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "#4b5563" }}
              >
                {/* PLACEHOLDER — dates / prize info */}
              </div>
            </div>

            {/* Winter Raffle */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(139,0,0,0.25)",
                padding: "2.5rem",
              }}
            >
              <div className="w-8 mb-6" style={{ height: "2px", background: "#8B0000" }} />
              <div
                className="text-[0.6rem] tracking-[0.3em] uppercase mb-3"
                style={{ color: "#8B0000", fontFamily: "var(--font-body)" }}
              >
                Winter
              </div>
              <h3
                className="font-display text-white uppercase mb-4"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "0.05em" }}
              >
                Winter Raffle
              </h3>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)", color: "#9ca3af" }}
              >
                {/* PLACEHOLDER — add winter raffle details here */}
                Details coming soon. Check back or contact the department for prize information and ticket availability.
              </p>
              <div
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "#4b5563" }}
              >
                {/* PLACEHOLDER — dates / prize info */}
              </div>
            </div>
          </div>

          {/* Purchase CTA */}
          <div
            className="text-center py-16 px-8"
            style={{ background: "#0A0A0A", border: "1px solid rgba(139,0,0,0.2)" }}
          >
            <RaffleWheelSVG size={120} className="mx-auto mb-8 opacity-80" />
            <h3
              className="font-display text-white uppercase mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "0.06em" }}
            >
              Get Your Tickets
            </h3>
            <p
              className="text-sm mb-10 max-w-md mx-auto"
              style={{ fontFamily: "var(--font-body)", color: "#9ca3af", lineHeight: 1.8 }}
            >
              Tickets are $10.87 each. All proceeds go directly to supporting the Villa Hills Fire Department.
            </p>
            <a
              href="https://www.paypal.com/ncp/payment/YFDSAQ6GNCCS4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fire"
              style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}
            >
              Buy Raffle Tickets — $10.87
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function RaffleWheelSVG({ size = 500, className = "" }: { size?: number; className?: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const segments = 12;
  const angleStep = (2 * Math.PI) / segments;

  const segmentColors = ["#8B0000", "#6b0000", "#a30000", "#730000"];

  function polarToCartesian(angle: number, radius: number) {
    return {
      x: cx + radius * Math.cos(angle - Math.PI / 2),
      y: cy + radius * Math.sin(angle - Math.PI / 2),
    };
  }

  function segmentPath(i: number) {
    const start = i * angleStep;
    const end = start + angleStep;
    const s = polarToCartesian(start, r);
    const e = polarToCartesian(end, r);
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`;
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* Segments */}
      {Array.from({ length: segments }).map((_, i) => (
        <path
          key={i}
          d={segmentPath(i)}
          fill={segmentColors[i % segmentColors.length]}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={1.5}
        />
      ))}

      {/* Spoke lines */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = i * angleStep;
        const inner = polarToCartesian(angle, r * 0.15);
        const outer = polarToCartesian(angle, r);
        return (
          <line
            key={`spoke-${i}`}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1}
          />
        );
      })}

      {/* Outer rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={3} />

      {/* Inner hub */}
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#1a1a1a" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r * 0.07} fill="#8B0000" />

      {/* Ticket labels on alternate segments */}
      {Array.from({ length: segments }).map((_, i) => {
        if (i % 2 !== 0) return null;
        const angle = (i + 0.5) * angleStep;
        const pos = polarToCartesian(angle, r * 0.62);
        const deg = ((i + 0.5) * 360) / segments - 90;
        return (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize={size * 0.04}
            fontFamily="sans-serif"
            fontWeight="bold"
            transform={`rotate(${deg}, ${pos.x}, ${pos.y})`}
          >
            WIN
          </text>
        );
      })}

      {/* Pointer at top */}
      <polygon
        points={`${cx - size * 0.04},${cy - r - size * 0.07} ${cx + size * 0.04},${cy - r - size * 0.07} ${cx},${cy - r + size * 0.04}`}
        fill="#ff3333"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={1}
      />
    </svg>
  );
}
