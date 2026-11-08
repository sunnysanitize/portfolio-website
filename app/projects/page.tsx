import type { Metadata } from "next";
import Link from "next/link";
import { projectGroups, projects } from "../data/projects";
import { Footer, ProjectEntry, Section } from "../components/site";

export const metadata: Metadata = {
  title: "Projects · Sunny Zhang",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <header className="site-header">
        <div>
          <Link href="/" className="back-link">
            ← Sunny Zhang
          </Link>
          <h1 className="mt-4">Projects</h1>
          <p className="bio text-muted-foreground">
            All projects, grouped by what each one was for.
          </p>
        </div>
      </header>

      {projectGroups.map((group) => (
        <Section key={group} title={group}>
          {projects
            .filter((project) => project.group === group)
            .map((project) => (
              <ProjectEntry key={project.name} project={project} />
            ))}
        </Section>
      ))}

      <Footer />
    </>
  );
}
