import Image from "next/image";
import Link from "next/link";
import { projects } from "../data/projects";

function DevpostIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61H6.002zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595V5.694zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853h-1.336z" />
    </svg>
  );
}

export default function ProjectsPage() {
  const actionClass =
    "route-link inline-flex items-center gap-1.5 rounded-md text-[12px] font-bold text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline";
  const disabledActionClass =
    "inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium text-muted-foreground/40";

  return (
    <div className="page-fade">
      <div className="pt-2">
        <Link
          href="/"
          className="eyebrow inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden>&larr;</span> Index
        </Link>
        <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-baseline gap-3 sm:gap-4">
            <span className="section-index eyebrow">02</span>
            <h2 className="text-[22px] font-bold tracking-tight text-foreground sm:text-[28px]">
              Selected Work
            </h2>
          </div>
          <span className="eyebrow text-muted-foreground">
            {String(projects.length).padStart(2, "0")} total
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 auto-rows-fr divide-y divide-line/70">
          {projects.map((project, index) => {
            const hasProjectLink = project.projectUrl.trim().length > 0;
            const hasSourceLink = project.sourceUrl.trim().length > 0;
            const hasDevpostLink = (project.devpostUrl?.trim().length ?? 0) > 0;
            const showWebsiteButton = project.showWebsiteButton !== false;

            return (
              <div
                key={`${project.name}-${index}`}
                className="group flex h-full flex-col py-6"
              >
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:gap-4">
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border border-line bg-background sm:aspect-auto sm:w-[20rem] md:w-[24rem]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 320px, 384px"
                        className="object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[20px] font-bold text-foreground sm:text-[23px]">
                      {project.name}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
                      {project.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    {project.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 pl-[0.875rem]">
                        {project.tags.map((tag) => (
                          <span key={tag} className="eyebrow !text-[10px] text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {showWebsiteButton ? (
                        hasProjectLink ? (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={actionClass}
                          >
                            <Image
                              src="/globe.svg"
                              alt=""
                              width={14}
                              height={14}
                              className="h-3.5 w-3.5 object-contain"
                            />
                            Website
                          </a>
                        ) : (
                          <span className={disabledActionClass}>
                            <Image
                              src="/globe.svg"
                              alt=""
                              width={14}
                              height={14}
                              className="h-3.5 w-3.5 object-contain opacity-50"
                            />
                            Website
                          </span>
                        )
                      ) : null}
                      {hasSourceLink ? (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={actionClass}
                        >
                          <Image
                            src="/GithubLogo.svg"
                            alt=""
                            width={14}
                            height={14}
                            className="h-3.5 w-3.5 object-contain"
                          />
                          Source
                        </a>
                      ) : (
                        <span className={disabledActionClass}>
                          <Image
                            src="/GithubLogo.svg"
                            alt=""
                            width={14}
                            height={14}
                            className="h-3.5 w-3.5 object-contain opacity-50"
                          />
                          Source
                        </span>
                      )}
                      {hasDevpostLink ? (
                        <a
                          href={project.devpostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={actionClass}
                        >
                          <DevpostIcon className="h-3.5 w-3.5" />
                          Devpost
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/"
          className="bracket-link mt-8 inline-flex w-fit items-center text-[14px] font-semibold text-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
