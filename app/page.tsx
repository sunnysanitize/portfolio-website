import Image from "next/image";
import Link from "next/link";
import CityWorld from "./components/world/CityWorld";
import DriveHUD from "./components/world/DriveHUD";
import SocialButtons from "./components/SocialButtons";
import { projects } from "./data/projects";

function ArrowIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M7 17 17 7M7 7h10v10" /></svg>; }

const research = [
  { title: "Language–Action Decoupling", type: "Multi-agent systems", href: "/language-action-decoupling.pdf" },
  { title: "Residual-Epsilon Aggregation", type: "Reinforcement learning", href: "/feedback-or-annealing.pdf" },
  { title: "Parallel State Aggregation", type: "Optimization", href: "https://github.com/sunnysanitize/Parallel-State-Aggregation" },
];

export default function Home() {
  return (
    <main className="drive-experience">
      <CityWorld />
      <DriveHUD />
      <section id="stop-0" className="drive-stop drive-hero">
        <div className="stop-card hero-terminal">
          <div className="terminal-bar"><span>TORONTO // 43.6532° N</span><span className="terminal-live">LIVE</span></div>
          <p className="eyebrow text-accent">CS + Mathematics · Researcher · Builder</p>
          <h1>SUNNY<br /><span>ZHANG</span></h1>
          <p className="hero-deck">I build intelligent systems at the intersection of operations research, applied probability, and machine learning.</p>
          <div className="terminal-actions"><a href="#stop-1">Begin drive <span>↓</span></a><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></div>
        </div>
        <div className="drive-instruction"><span className="mouse-icon" /> Scroll to accelerate</div>
      </section>
      <section id="stop-1" className="drive-stop">
        <div className="stop-card stop-card-right">
          <div className="stop-number">STOP 01 <span>13:40:21</span></div>
          <p className="eyebrow text-primary">Current coordinates</p><h2>EXPERIENCE<br />DISTRICT</h2>
          <div className="city-list">
            <article><div><strong>University of Toronto</strong><p>Computer Science &amp; Mathematics</p></div><time>2025—29</time></article>
            <article><div className="company"><Image src="/algoverse.webp" alt="" width={34} height={34} /><div><strong>Algoverse</strong><p>AI Research Intern</p></div></div><time>SUMMER 26</time></article>
          </div>
        </div>
      </section>
      <section id="stop-2" className="drive-stop">
        <div className="stop-card">
          <div className="stop-number">STOP 02 <span>RESTRICTED LABS</span></div>
          <p className="eyebrow text-accent">Research archive</p><h2>RESEARCH<br />SECTOR</h2>
          <div className="city-list research-list">
            {research.map((item, index) => <a href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}><span>0{index + 1}</span><div><strong>{item.title}</strong><p>{item.type}</p></div><ArrowIcon /></a>)}
          </div>
        </div>
      </section>
      <section id="stop-3" className="drive-stop">
        <div className="stop-card stop-card-right stop-card-wide">
          <div className="stop-number">STOP 03 <span>BUILD GRID</span></div>
          <p className="eyebrow text-primary">Selected transmissions</p><h2>PROJECT<br />MARKET</h2>
          <div className="project-transmissions">
            {projects.slice(0, 3).map((project, index) => { const href = project.projectUrl || project.sourceUrl; return <a href={href} target="_blank" rel="noopener noreferrer" key={project.name}><span>0{index + 1}</span><div><strong>{project.name}</strong><p>{project.featuredDescription ?? project.shortDescription}</p></div><ArrowIcon /></a>; })}
          </div>
          <Link href="/projects" className="all-projects">ACCESS ALL PROJECTS →</Link>
        </div>
      </section>
      <section id="stop-4" className="drive-stop drive-finale">
        <div className="stop-card finale-card">
          <div className="stop-number">FINAL STOP <span>CONNECTION OPEN</span></div>
          <p className="eyebrow text-accent">End of the line</p><h2>LET&apos;S BUILD<br /><span>SOMETHING.</span></h2>
          <p className="hero-deck">Have an interesting problem, research idea, or ambitious product?</p><SocialButtons />
          <a className="restart-drive" href="#stop-0">RESTART JOURNEY ↑</a>
        </div>
      </section>
    </main>
  );
}
