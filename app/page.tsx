import Image from "next/image";
import { projects } from "./data/projects";

const EMAIL = "ssunny.zhang@mail.utoronto.ca";
const GITHUB = "https://github.com/sunnysanitize";
const LINKEDIN = "https://www.linkedin.com/in/sunny-zhang-413902297/";

const education = [
  {
    school: "University of Toronto",
    detail: "Computer Science & Mathematics",
    period: "2025 — 2030",
  },
];

const experience = [
  {
    place: "Algoverse",
    detail: "ML Research Intern",
    period: "Jun 2026 —",
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="section-heading">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Dated row used by Education and Experience. The date sits in a fixed left
 * column so both sections share one vertical rule, rather than drifting to the
 * far right edge where it reads as detached from its entry.
 */
function EntryRow({
  primary,
  detail,
  period,
}: {
  primary: string;
  detail: string;
  period: string;
}) {
  return (
    <div className="flex flex-col gap-x-5 sm:flex-row sm:items-baseline">
      <span className="shrink-0 text-muted-foreground sm:w-[7rem]">
        {period}
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{primary}</p>
        <p className="leading-snug text-muted-foreground">
          {detail}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* ── Bio ───────────────────────────────────────────────── */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* h-auto is required: the CSS width overrides the width attribute, but
            the height attribute still applies without it, stretching the photo. */}
        <Image
          src="/photo.png"
          alt="Sunny Zhang"
          width={392}
          height={370}
          priority
          className="h-auto w-[200px] shrink-0"
        />

        <div className="min-w-0">
          <h1 className="font-semibold">
            Sunny Zhang
          </h1>

          <p className="mt-3">
            I study Computer Science and Mathematics at the University of
            Toronto, St. George campus. My interests lie in operations research
            and applied probability.
          </p>

          <p className="mt-5">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <span className="mx-2 text-muted-foreground">·</span>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              CV
            </a>
            <span className="mx-2 text-muted-foreground">·</span>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span className="mx-2 text-muted-foreground">·</span>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </header>

      <Section title="Education">
        <div className="space-y-4">
          {education.map((item) => (
            <EntryRow
              key={item.school}
              primary={item.school}
              detail={item.detail}
              period={item.period}
            />
          ))}
        </div>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {experience.map((item) => (
            <EntryRow
              key={item.place}
              primary={item.place}
              detail={item.detail}
              period={item.period}
            />
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <ul className="space-y-5">
          {projects.map((project) => {
            const site = project.projectUrl?.trim();

            // Titles stay in ink like every other heading on the page; blue is
            // reserved for the link row, so each entry reads as one block.
            const links = [
              site ? { label: "website", href: site } : null,
              project.sourceUrl ? { label: "code", href: project.sourceUrl } : null,
            ].filter((link) => link !== null);

            return (
              <li key={project.name}>
                <p className="font-semibold">
                  {site ? (
                    <a
                      href={site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </p>
                <p className="leading-snug text-muted-foreground">
                  {project.description}
                </p>
                {project.details ? (
                  <ul className="mt-1 pl-6 text-muted-foreground">
                    {project.details.map((detail) => (
                      <li key={detail.label}>
                        {detail.href ? (
                          <>
                            {detail.label}{" ("}
                            <a
                              href={detail.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {detail.linkLabel ?? "link"}
                            </a>
                            )
                          </>
                        ) : (
                          detail.label
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-1">
                  {links.map((link, i) => (
                    <span key={link.label}>
                      {i > 0 ? (
                        <span className="mx-2 text-muted-foreground">·</span>
                      ) : null}
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </span>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
