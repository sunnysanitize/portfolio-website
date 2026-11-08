import type { Project } from "../data/projects";

/**
 * A section with its name in a left-hand column and its entries on the right.
 * The rail and the rule above each section carry all the separation, so
 * entries themselves need no boxes or dividers.
 */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

/** Title with the date (if any) aligned right, then any lines beneath it. */
export function Entry({
  title,
  when,
  children,
}: {
  title: string;
  when?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="entry">
      <p className="entry-title">{title}</p>
      {when ? <span className="entry-when">{when}</span> : null}
      {children}
    </div>
  );
}

export function LinkRow({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="entry-links">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function ProjectEntry({ project }: { project: Project }) {
  return (
    <Entry title={project.name}>
      {project.result ? (
        <p className="entry-result">{project.result}</p>
      ) : null}
      <p className="entry-desc">{project.description}</p>
      <LinkRow links={project.links} />
    </Entry>
  );
}

export function Footer() {
  return <footer className="site-footer">Updated November 2026</footer>;
}
