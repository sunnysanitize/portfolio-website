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

/**
 * Optional small label, then the title with the date (if any) aligned right,
 * then any lines beneath it.
 */
export function Entry({
  title,
  when,
  label,
  children,
}: {
  title: string;
  when?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="entry">
      {label ? <p className="entry-label">{label}</p> : null}
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

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="entry-tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** `index` numbers the entry within its section, starting at 1. */
export function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Entry
      title={project.name}
      label={`${String(index).padStart(2, "0")} · ${project.topic}`}
    >
      {project.result ? (
        <p className="entry-result">{project.result}</p>
      ) : null}
      <p className="entry-desc">{project.description}</p>
      {project.stack ? <Tags items={project.stack} /> : null}
      <LinkRow links={project.links} />
    </Entry>
  );
}

export function Footer() {
  return <footer className="site-footer">Updated November 2026</footer>;
}
