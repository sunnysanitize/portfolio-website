"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-full items-center justify-between border-b border-line py-3"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-[17px] font-bold uppercase tracking-tight text-foreground transition-opacity hover:opacity-70"
      >
        Sunny Zhang
        <span className="h-1.5 w-1.5 bg-primary" aria-hidden />
      </Link>

      <div className="flex items-center gap-6 sm:gap-9">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`nav-link eyebrow !text-[11px] transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bracket-link eyebrow !text-[11px] text-foreground"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
