import { Geist, Geist_Mono } from "next/font/google";

// Geist: neutral neo-grotesque, the closest free stand-in for n1.xyz's
// ABC Monument Grotesk. Used for the wordmark, headings, and body.
export const geistSans = Geist({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// Geist Mono: utility face for eyebrows, section indices, dates, tags,
// and the hero status strip — n1's technical data treatment.
export const geistMono = Geist_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
