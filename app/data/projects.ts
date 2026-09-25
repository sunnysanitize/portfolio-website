export interface Project {
  name: string;
  description: string;
  projectUrl?: string;
  sourceUrl: string;
  details?: {
    label: string;
    href?: string;
    linkLabel?: string;
  }[];
}

export const projects: Project[] = [
  {
    name: "Tiny Society",
    description:
      "An experimental platform for studying how small populations of LLM agents can model and predict behaviour in social settings.",
    projectUrl: "https://tinysocietyai.com",
    sourceUrl: "https://github.com/sunnysanitize/tiny-society",
    details: [
      {
        label: "Calculations & metrics",
        href: "/tiny-society-calculations-and-metrics.pdf",
        linkLabel: "PDF",
      },
    ],
  },
  {
    name: "LaunchPilot",
    description: "A two-time winning Hack Canada 2026 project.",
    projectUrl: "https://launchpilot-theta.vercel.app",
    sourceUrl: "https://github.com/LegendaryAKx3/launchpilot",
    details: [
      { label: "Winner — Backboard.io: Best Use of Backboard" },
      { label: "Winner — SPUR: Build a Real Canadian Startup (Top 3)" },
    ],
  },
];
