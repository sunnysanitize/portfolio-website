import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { sourceSerif } from "./fonts";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const title = "Sunny Zhang";
const description =
  "Sunny Zhang — Computer Science and Mathematics, University of Toronto. Projects, experience, and contact.";

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
        className={`${sourceSerif.variable} bg-background text-foreground antialiased`}
      >
        <div className="mx-auto flex min-h-[100svh] w-full max-w-[64rem] flex-col overflow-x-hidden px-5 pt-[calc(3rem+env(safe-area-inset-top))] pl-[calc(1.25rem+env(safe-area-inset-left))] pr-[calc(1.25rem+env(safe-area-inset-right))] pb-[calc(3rem+env(safe-area-inset-bottom))] sm:px-10 sm:pt-16">
          <main className="flex-1">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
