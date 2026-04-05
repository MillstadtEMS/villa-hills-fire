"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",            label: "Home" },
  { href: "/about",       label: "About" },
  { href: "/apparatus",   label: "Apparatus" },
  { href: "/members",     label: "Active Members" },
  { href: "/fundraising", label: "Fundraising" },
  { href: "/join",        label: "Join the Team" },
  { href: "/apply",       label: "Apply Now" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className="fixed left-0 right-0 z-40 transition-all duration-300 overflow-visible"
        style={{
          top: "2.5rem",
          height: "3.5rem",
          background: scrolled ? "rgba(10,10,10,0.97)" : "rgba(10,10,10,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid rgba(139,0,0,0.5)"
            : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="wrap h-full flex items-center justify-between gap-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-[70px] h-[70px]">
              <Image
                src="/images/badge.png"
                alt="Villa Hills Fire Department Badge"
                fill
                sizes="70px"
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div
                className="font-display text-white uppercase leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.12em", fontSize: "1.05rem" }}
              >
                Villa Hills
              </div>
              <div
                className="tracking-[0.3em] uppercase leading-none mt-1"
                style={{ color: "#8B0000", fontSize: "0.72rem" }}
              >
                Fire Department
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-[0.7rem] tracking-[0.18em] uppercase font-semibold transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: active ? "#ffffff" : "#9ca3af",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                  }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: "#8B0000" }}
                    />
                  )}
                </Link>
              );
            })}
            <a
              href="https://www.paypal.com/ncp/payment/YFDSAQ6GNCCS4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fire text-xs px-4 py-2"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
            >
              Donate Now
            </a>
          </nav>

          {/* MOBILE — "More" label replaces hamburger, bottom bar handles navigation */}
          <button
            className="md:hidden flex flex-col items-center gap-[3px]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden>
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </button>
        </div>

        {/* MOBILE FULL MENU — slides down from header */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? "480px" : "0",
            background: "rgba(8,8,8,0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: open ? "1px solid rgba(139,0,0,0.3)" : "none",
          }}
        >
          <nav className="wrap py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="block py-3 text-sm tracking-[0.15em] uppercase font-semibold border-b border-white/5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: active ? "#ffffff" : "#6b7280",
                    borderLeft: active ? "2px solid #8B0000" : "2px solid transparent",
                    paddingLeft: active ? "0.75rem" : "0",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-4">
              <a
                href="https://www.paypal.com/ncp/payment/YFDSAQ6GNCCS4"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fire w-full text-center text-sm"
              >
                Donate Now
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <MobileBottomNav pathname={pathname} menuOpen={open} onMenuToggle={() => setOpen((v) => !v)} />
    </>
  );
}

function MobileBottomNav({
  pathname,
  menuOpen,
  onMenuToggle,
}: {
  pathname: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const tabs = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      href: "/apparatus",
      label: "Apparatus",
      icon: (
        /* fire truck silhouette */
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M18 11l-2-4H8L6 11H3v6h2a2 2 0 004 0h6a2 2 0 004 0h2v-6h-3zM7 16a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2zM8 9h8l1.5 3H6.5L8 9z" />
        </svg>
      ),
    },
    {
      href: "/members",
      label: "Members",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      href: "https://www.paypal.com/ncp/payment/YFDSAQ6GNCCS4",
      label: "Donate",
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div
        style={{
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(139,0,0,0.25)",
        }}
      >
        <div
          className="flex items-stretch"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {tabs.map((tab) =>
            tab.external ? (
              <a
                key={tab.label}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
                style={{ color: "#4b5563" }}
              >
                {tab.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  {tab.label}
                </span>
              </a>
            ) : (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
                style={{ color: isActive(tab.href) ? "#8B0000" : "#4b5563" }}
              >
                {tab.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  {tab.label}
                </span>
              </Link>
            )
          )}

          {/* More / Menu */}
          <button
            onClick={onMenuToggle}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={{ color: menuOpen ? "#8B0000" : "#4b5563" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
