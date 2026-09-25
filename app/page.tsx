import Image from "next/image";
import CityWorld from "./components/world/CityWorld";
import CheckpointAdvance from "./components/world/CheckpointAdvance";
import DriveInstruction from "./components/world/DriveInstruction";
import SocialButtons from "./components/SocialButtons";
import { projects } from "./data/projects";

function ArrowIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M7 17 17 7M7 7h10v10" /></svg>; }

const featured = ["Tiny Society", "LaunchPilot"];

const research = [
  { title: "Language–Action Decoupling", type: "Multi-agent systems", href: "/language-action-decoupling.pdf" },
  { title: "Residual-Epsilon Aggregation", type: "Reinforcement learning", href: "/feedback-or-annealing.pdf" },
  { title: "Parallel State Aggregation", type: "Optimization", href: "https://github.com/sunnysanitize/Parallel-State-Aggregation" },
];

export default function Home() {
  return (
    <main className="drive-experience">
      <CityWorld />
      <section id="stop-0" className="drive-stop drive-hero">
        <div className="stop-card hero-terminal">
          <div className="terminal-bar"><span>CHECKPOINT 0</span><span className="terminal-live">ENGINE IDLING</span></div>
          <h1>SUNNY<br /><span>ZHANG</span></h1>
          <p className="hero-deck">I am currently studying Computer Science and Statistics at the University of Toronto, and my interests lie in operations research and applied probability.</p>
          <div className="terminal-actions"><CheckpointAdvance target="#stop-1" /><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé ↗</a></div>
        </div>
        <DriveInstruction />
      </section>
      <section id="stop-1" className="drive-stop">
        <div className="stop-card stop-card-right">
          <div className="stop-number">STOP 01 <span>ENROLLED</span></div>
          <p className="eyebrow text-primary">Academic record</p><h2>EDUCATION<br />DISTRICT</h2>
          <div className="city-list">
            <article><div className="company"><Image src="/uoftlogo.png" alt="" width={34} height={34} className="crest" /><div><strong>University of Toronto</strong><p>Computer Science &amp; Statistics</p></div></div><time>2025—29</time></article>
          </div>
          <div className="stop-advance"><CheckpointAdvance target="#stop-2" /></div>
        </div>
      </section>
      <section id="stop-2" className="drive-stop">
        <div className="stop-card">
          <div className="stop-number">STOP 02 <span>13:40:21</span></div>
          <p className="eyebrow text-accent">Current coordinates</p><h2>EXPERIENCE<br />DISTRICT</h2>
          <div className="city-list">
            <article><div className="company"><Image src="/algoverse.webp" alt="" width={34} height={34} /><div><strong>Algoverse</strong><p>AI Research Intern</p></div></div><time>SUMMER 26</time></article>
          </div>
          <div className="stop-advance"><CheckpointAdvance target="#stop-3" /></div>
        </div>
      </section>
      <section id="stop-3" className="drive-stop">
        <div className="stop-card stop-card-right">
          <div className="stop-number">STOP 03 <span>RESTRICTED LABS</span></div>
          <p className="eyebrow text-primary">Research archive</p><h2>RESEARCH<br />SECTOR</h2>
          <div className="city-list research-list">
            {research.map((item, index) => <a href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}><span>0{index + 1}</span><div><strong>{item.title}</strong><p>{item.type}</p></div><ArrowIcon /></a>)}
          </div>
          <div className="stop-advance"><CheckpointAdvance target="#stop-4" /></div>
        </div>
      </section>
      <section id="stop-4" className="drive-stop">
        <div className="stop-card stop-card-wide">
          <div className="stop-number">STOP 04 <span>BUILD GRID</span></div>
          <p className="eyebrow text-accent">Selected transmissions</p><h2>PROJECT<br />MARKET</h2>
          <div className="project-transmissions">
            {projects.filter((project) => featured.includes(project.name)).map((project, index) => { const href = project.projectUrl || project.sourceUrl; return <a href={href} target="_blank" rel="noopener noreferrer" key={project.name}><span>0{index + 1}</span><div><strong>{project.name}</strong><p>{project.featuredDescription ?? project.shortDescription}</p></div><ArrowIcon /></a>; })}
          </div>
          <div className="stop-advance"><CheckpointAdvance target="#stop-5" /></div>
        </div>
      </section>
      <section id="stop-5" className="drive-stop drive-finale">
        <div className="stop-card finale-card">
          <div className="stop-number">FINAL STOP <span>CHANNELS OPEN</span></div>
          <p className="eyebrow text-accent">Contact</p><h2>GET IN<br /><span>TOUCH</span></h2>
          <p className="hero-deck">Email, GitHub, and LinkedIn below.</p><SocialButtons />
          <CheckpointAdvance target="#stop-0" label="Restart journey" direction="up" className="restart-drive" />
        </div>
      </section>
    </main>
  );
}
