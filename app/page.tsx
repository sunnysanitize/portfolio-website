import Image from "next/image";
import Link from "next/link";
import { projects } from "./data/projects";
import SocialButtons from "./components/SocialButtons";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line pb-3">
      <span className="section-index eyebrow">{index}</span>
      <h2 className="eyebrow text-foreground">{title}</h2>
    </div>
  );
}

export default function Home() {
  const experience = [
    {
      title: "Algoverse",
      detail: "ML Researcher",
      period: "Jun 2026 —",
      icon: "/algoverse.webp",
    },
  ];

  const stack = [
    { label: "Languages", items: ["Python", "JavaScript", "C/C++", "HTML/CSS", "SQL"] },
    {
      label: "Frameworks/Libraries",
      items: [
        "FastAPI",
        "Flask",
        "SQLAlchemy",
        "Pandas",
        "NumPy",
        "PyTorch",
        "TensorFlow",
        "scikit-learn",
        "Matplotlib",
        "D3",
      ],
    },
    {
      label: "Tools/Platforms",
      items: [
        "Git",
        "Docker",
        "PostgreSQL",
        "SQLite",
        "Supabase",
        "Auth0",
        "Hugging Face",
        "pytest",
        "Vercel",
      ],
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <header>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="reveal-mask block py-[0.04em]">
              <span className="reveal-line" style={{ animationDelay: "0.1s" }}>
                Sunny Zhang
              </span>
            </span>
          </h1>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="fade-in group mb-2 inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            style={{ animationDelay: "0.35s" }}
          >
            Résumé
            <ArrowIcon className="h-3 w-3 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <p
          className="fade-in mt-4 text-[16px] font-medium leading-relaxed text-foreground sm:text-[18px]"
          style={{ animationDelay: "0.45s" }}
        >
          Computer Science &amp; Mathematics,{" "}
          <Image
            src="/uoftlogo.png"
            alt="University of Toronto"
            width={64}
            height={64}
            className="mx-1 inline h-[1.3em] w-auto object-contain align-[-0.3em]"
          />
          University of Toronto.
        </p>

        <div
          className="fade-in eyebrow mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-line py-3 text-muted-foreground"
          style={{ animationDelay: "0.55s" }}
        >
          <span>Toronto, CA</span>
        </div>
      </header>

      {/* ── Modules: experience + selected work ──────────────── */}
      <div className="mt-9 grid gap-9 lg:grid-cols-12 lg:gap-12">
        <section className="lg:col-span-4">
          <SectionLabel index="01" title="Experience" />
          <div className="mt-1 divide-y divide-line">
            {experience.map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-3.5">
                <Image
                  src={item.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-6 w-6 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <span className="eyebrow shrink-0 text-muted-foreground">
                  {item.period}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-8">
          <SectionLabel index="02" title="Selected Work" />
          <ul className="mt-1 divide-y divide-line">
            {projects.map((project, i) => {
              const external = project.projectUrl.trim().length > 0;
              const href = external ? project.projectUrl : "/projects";
              const blurb = project.featuredDescription ?? project.shortDescription;

              return (
                <li key={project.name}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 py-3 transition-colors"
                  >
                    <span className="section-index eyebrow w-6 shrink-0 self-start pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[16px]">
                        {project.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] leading-snug text-muted-foreground">
                        {blurb}
                      </span>
                    </span>
                    <ArrowIcon className="h-4 w-4 shrink-0 self-start text-muted-foreground transition-all duration-300 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/projects"
            className="bracket-link mt-4 inline-block w-fit text-[12px] font-semibold uppercase tracking-wide text-foreground"
          >
            View all work
          </Link>
        </section>
      </div>

      {/* ── Stack + contact (bottom) ─────────────────────────── */}
      <div className="mt-auto pt-10">
        <div className="space-y-1.5 font-mono text-[10.5px] leading-relaxed text-muted-foreground/50">
          {stack.map((group) => (
            <p key={group.label}>
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
              <span className="mx-2 text-line">/</span>
              {group.items.join("  ·  ")}
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow text-accent">{"// Contact"}</span>
            <div className="mt-3">
              <SocialButtons />
            </div>
          </div>
          <div className="eyebrow flex flex-col gap-1 text-muted-foreground sm:items-end">
            <span>&copy; 2026 Sunny Zhang &middot; Toronto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
