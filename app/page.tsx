import { projectGroups, projects } from "./data/projects";
import {
  Entry,
  Footer,
  LinkRow,
  ProjectEntry,
  Section,
  Tags,
} from "./components/site";

const EMAIL = "ssunny.zhang@mail.utoronto.ca";
const GITHUB = "https://github.com/sunnysanitize";
const LINKEDIN = "https://www.linkedin.com/in/sunnyzhang8";

const education = [
  {
    school: "University of Toronto",
    detail: "Computer Science and Mathematics",
    period: "2025 – 2029",
  },
];

const experience: {
  role: string;
  place: string;
  url?: string;
  period: string;
  description: string;
}[] = [
  {
    role: "Founder",
    place: "UofT Decision Systems (UTDSYS)",
    url: "https://utdsys.com",
    period: "2026 – now",
    description:
      "Founded a student research group in quantitative and fundamental research.",
  },
  {
    role: "Lead Researcher",
    place: "Algoverse",
    period: "Jun – Sep 2026",
    description:
      "Led research on LLM agent hierarchies, leading to Language–Action Decoupling.",
  },
];

const publications = [
  {
    title:
      "Language–Action Decoupling: Speech as a Weak Proxy for Action in LLM Hierarchies",
    topic: "LLM agents",
    venue: "Accepted to four NeurIPS 2026 workshops",
    description:
      "A first-author study of whether what LLM agents say predicts what they do, in hierarchies where agents direct other agents. Workshops: IAB, AIWILD, VerifyAgents, and SocialAgent.",
    tags: ["Python", "LLM evaluation", "Multi-agent systems"],
    paperUrl: "/language-action-decoupling.pdf",
  },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div>
          <h1>Sunny Zhang</h1>
          <p className="bio">
            I work on applied machine learning, with a focus on multi-agent LLM
            systems and optimization.
          </p>
          <p className="affiliation">
            Computer Science + Mathematics at the University of Toronto
          </p>
          <div className="header-links">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <Section title="Education">
        {education.map((item) => (
          <Entry key={item.school} title={item.school} when={item.period}>
            <p className="entry-desc">{item.detail}</p>
          </Entry>
        ))}
      </Section>

      <Section title="Publications">
        {publications.map((paper, i) => (
          <Entry
            key={paper.title}
            title={paper.title}
            label={`${String(i + 1).padStart(2, "0")} · ${paper.topic}`}
          >
            <p className="entry-result">{paper.venue}</p>
            <p className="entry-desc">{paper.description}</p>
            <Tags items={paper.tags} />
            <LinkRow links={[{ label: "Paper", href: paper.paperUrl }]} />
          </Entry>
        ))}
      </Section>

      <Section title="Experience">
        {experience.map((item) => (
          <Entry key={item.place} title={item.role} when={item.period}>
            <p className="entry-org">{item.place}</p>
            <p className="entry-desc">{item.description}</p>
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

      {projectGroups.map((group) => (
        <Section key={group} title={group}>
          {projects
            .filter((project) => project.group === group)
            .map((project, i) => (
              <ProjectEntry
                key={project.name}
                project={project}
                index={i + 1}
              />
            ))}
        </Section>
      ))}

      <Footer />
    </>
  );
}
