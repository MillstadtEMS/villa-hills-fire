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
    <header
      className="fixed left-0 right-0 z-40 transition-all duration-300 overflow-visible"
      style={{
        top: "2.5rem", /* sit below status bar */
        height: "3.5rem",
        background: scrolled
          ? "rgba(10,10,10,0.97)"
          : "rgba(10,10,10,0.88)",
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

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-[1.5px] bg-white transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "" }}
          />
          <span
            className="block h-[1.5px] bg-white transition-all duration-200"
            style={{ width: open ? "0" : "1.5rem", opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-6 h-[1.5px] bg-white transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "" }}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "320px" : "0",
          background: "#0d0d0d",
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
  );
}
