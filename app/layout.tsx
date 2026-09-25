import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { geistSans, geistMono } from "./fonts";
import SiteNav from "./components/SiteNav";
import GrainCanvas from "./components/GrainCanvas";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

const title = "Sunny Zhang | Portfolio";
const description = "Developer portfolio: projects, experience, and contact.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunnyzhang.dev"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://sunnyzhang.dev",
    siteName: "Sunny Zhang",
    images: [{ url: "/og.png", width: 500, height: 500, alt: "Sunny Zhang" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <GrainCanvas />
        <div className="relative z-10 flex min-h-[100svh] flex-col overflow-x-hidden px-5 pt-[calc(0.5rem+env(safe-area-inset-top))] pl-[calc(1.25rem+env(safe-area-inset-left))] pr-[calc(1.25rem+env(safe-area-inset-right))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-10 sm:pt-3 md:px-16">
          <div className="relative mx-auto w-full max-w-6xl">
            <SiteNav />
          </div>
          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col pt-7 sm:pt-9">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
