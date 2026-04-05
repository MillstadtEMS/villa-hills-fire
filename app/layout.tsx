import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StatusBar from "@/components/StatusBar";
import FireTruckAnimation from "@/components/FireTruckAnimation";
import HolidayOverlay from "@/components/HolidayOverlay";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: {
    default: "Villa Hills Fire Department | St. Clair County, Illinois",
    template: "%s | Villa Hills Fire Department",
  },
  description:
    "Villa Hills Fire Department — Dedicated & Proud, serving St. Clair County, Illinois since 1955. Emergency response, fire suppression, and community protection.",
  keywords: ["fire department", "Villa Hills", "St. Clair County", "Illinois", "emergency services", "fire protection"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VHFD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="bg-[#0A0A0A] text-gray-200 antialiased overflow-x-hidden">
        <StatusBar />
        <Nav />
        <main style={{ paddingTop: "calc(2.5rem + 3.5rem)" }}>
          {children}
        </main>
        <Footer />
        <FireTruckAnimation />
        <HolidayOverlay />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
