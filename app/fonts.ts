import { Inter } from "next/font/google";

// Inter carries body text, links and small print. Headings use Georgia, a
// system serif, so it needs no download.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
