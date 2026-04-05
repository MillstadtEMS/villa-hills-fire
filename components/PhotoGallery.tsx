"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface Photo {
  src: string;
  caption: string;
}

interface Props {
  photos: Photo[];
  bg?: string;
}

export default function PhotoGallery({ photos, bg = "#111" }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  const prev = useCallback(() => {
    setOpen((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const next = useCallback(() => {
    setOpen((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {photos.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B0000]"
            style={{ aspectRatio: "4/3", background: bg, cursor: "zoom-in" }}
            aria-label={`Open photo: ${img.caption}`}
          >
            <Image
              src={img.src}
              alt={img.caption}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }}
            >
              <p
                className="p-4 text-white text-sm tracking-wider uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {img.caption}
              </p>
            </div>
            {/* Zoom hint icon */}
            <div
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                background: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="white"
                style={{ width: "0.875rem", height: "0.875rem" }}
              >
                <path
                  fillRule="evenodd"
                  d="M3 8a5 5 0 1110 0A5 5 0 013 8zm5-7a7 7 0 104.192 12.606l3.1 3.1a1 1 0 001.415-1.415l-3.1-3.1A7 7 0 008 1zm-1 4a1 1 0 012 0v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1H6a1 1 0 010-2h1V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
            aria-label="Close photo"
            className="absolute top-4 right-4 z-10 flex items-center justify-center transition-colors hover:bg-white/10"
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 flex items-center justify-center transition-colors hover:bg-white/10"
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 flex items-center justify-center transition-colors hover:bg-white/10"
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Image container — stop propagation so clicking image doesn't close */}
          <div
            className="relative flex flex-col items-center"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative"
              style={{
                width: "min(90vw, 1100px)",
                height: "min(75vh, 700px)",
              }}
            >
              <Image
                src={photos[open].src}
                alt={photos[open].caption}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Caption + counter */}
            <div className="mt-4 flex items-center gap-6">
              <p
                className="text-white text-sm tracking-wider uppercase text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {photos[open].caption}
              </p>
              <span
                className="text-xs shrink-0"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body)" }}
              >
                {open + 1} / {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
