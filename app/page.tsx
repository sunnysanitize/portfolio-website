import Image from "next/image";
import Link from "next/link";
import { projects } from "./data/projects";
import {
  Entry,
  Footer,
  LinkRow,
  ProjectEntry,
  Section,
} from "./components/site";

const EMAIL = "ssunny.zhang@mail.utoronto.ca";
const GITHUB = "https://github.com/sunnysanitize";
const LINKEDIN = "https://www.linkedin.com/in/sunnyzhang8";

const education = [
  {
    school: "University of Toronto, St. George",
    detail: "Computer Science and Mathematics",
    period: "2025 – 2029",
  },
];

const experience: {
  role: string;
  place: string;
  url?: string;
  period: string;
}[] = [
  {
    role: "Founder",
    place: "UofT Decision Systems (UTDSYS)",
    url: "https://utdsys.com",
    period: "2026 – now",
  },
  {
    role: "Lead Researcher",
    place: "Algoverse",
    period: "Jun – Sep 2026",
  },
];

const publications = [
  {
    title:
      "Language–Action Decoupling: Speech as a Weak Proxy for Action in LLM Hierarchies",
    authors: "Zhang et al.",
    year: "2026",
    venue:
      "Accepted to four NeurIPS 2026 workshops: IAB, AIWILD, VerifyAgents, and SocialAgent.",
    paperUrl: "/language-action-decoupling.pdf",
  },
];

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <header className="site-header">
        <div>
          <h1>Sunny Zhang</h1>
          <p className="bio">
            I study Computer Science and Mathematics at the University of
            Toronto, St. George campus. My interests lie in machine learning,
            sequential decision making, and mathematical optimization.
          </p>
          <div className="header-links">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              CV
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        {/* h-auto is required: the CSS width overrides the width attribute, but
            the height attribute still applies without it, stretching the photo. */}
        <Image
          src="/photo.png"
          alt="Sunny Zhang"
          width={392}
          height={370}
          priority
          className="header-photo h-auto"
        />
      </header>

      <Section title="Education">
        {education.map((item) => (
          <Entry key={item.school} title={item.school} when={item.period}>
            <p className="entry-desc">{item.detail}</p>
          </Entry>
        ))}
      </Section>

      <Section title="Publications">
        {publications.map((paper) => (
          // One flowing paragraph, the way a reference list sets a citation:
          // authors, title, venue, then the link.
          <p key={paper.title} className="citation">
            {paper.authors} ({paper.year}).{" "}
            <span className="entry-title">{paper.title}.</span>{" "}
            <span className="entry-result">{paper.venue}</span>{" "}
            <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer">
              [PDF]
            </a>
          </p>
        ))}
      </Section>

      <Section title="Experience">
        {experience.map((item) => (
          <Entry key={item.place} title={item.role} when={item.period}>
            <p className="entry-desc">{item.place}</p>
            {item.url ? (
              <LinkRow
                links={[
                  { label: item.url.replace("https://", ""), href: item.url },
                ]}
              />
            ) : null}
          </Entry>
        ))}
      </Section>

      <Section title="Projects">
        {featured.map((project) => (
          <ProjectEntry key={project.name} project={project} />
        ))}
        <p className="all-link">
          <Link href="/projects">All projects →</Link>
        </p>
      </Section>

      <Footer />
    </>
  );
}
