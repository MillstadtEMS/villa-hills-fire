"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

const SLIDES = [
  {
    src: "/images/station-night.jpg",
    alt: "Villa Hills Fire Protection District — station at night",
    position: "center 50%",
  },
  {
    src: "/images/fleet-night.jpg",
    alt: "Engine 5712 and Tanker 5717 — Villa Hills",
    position: "center 50%",
  },
  {
    src: "/images/apparatus-bay.jpg",
    alt: "Villa Hills Fire Department apparatus bay",
    position: "center 40%",
  },
  {
    src: "/images/engine-5711-front-show.jpg",
    alt: "Engine 5711 — Villa Hills Fire Department",
    position: "center 50%",
  },
];

const INTERVAL = 8000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 400);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <>
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover transition-opacity duration-500"
          style={{
            objectPosition: slide.position,
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transitionDuration: "500ms",
          }}
        />
      ))}

      {/* Dot indicators */}
      <div
        className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-2 z-20"
        aria-label="Carousel navigation"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "1.75rem" : "0.5rem",
              height: "0.5rem",
              borderRadius: "9999px",
              background: i === current ? "#8B0000" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
