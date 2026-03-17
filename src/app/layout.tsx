import "@/styles/globals.css";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import ClientShell from "./client-shell";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "FootyConnects — Elite Football Gear",
  description:
    "Discover elite football gear curated by position, style, and surface. Get recommendations that match your game.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}