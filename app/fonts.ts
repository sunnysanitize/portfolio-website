import { Source_Serif_4 } from "next/font/google";

// Source Serif 4: a text serif in the Charter/Source tradition, the type of face
// academic personal pages use. Carries headings and body alike.
export const sourceSerif = Source_Serif_4({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});
