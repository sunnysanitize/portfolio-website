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
      "A multi-agent simulator that turns a user-authored world and cast into a seven-day narrative.",
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
    description:
      "An AI launch assistant built in 36 hours, running four agents from market research to approved outreach.",
    projectUrl: "https://launchpilot-theta.vercel.app",
    sourceUrl: "https://github.com/LegendaryAKx3/launchpilot",
    details: [
      { label: "Winner — Backboard.io: Best Use of Backboard" },
      { label: "Winner — SPUR: Build a Real Canadian Startup (Top 3)" },
      {
        label: "Devpost",
        href: "https://devpost.com/software/launchpilot-si9j8d",
        linkLabel: "link",
      },
    ],
  },
  {
    name: "Feedback or Annealing?",
    description:
      "A preregistered study of adaptive state aggregation on a 9,261-state MDP, finding no consistent benefit from feedback.",
    sourceUrl: "https://github.com/sunnysanitize/Residual-Epsilon-Aggregation",
    details: [
      {
        label: "Paper",
        href: "/feedback-or-annealing.pdf",
        linkLabel: "PDF",
      },
    ],
  },
  {
    name: "Parallel State Aggregation",
    description:
      "A threaded benchmark of exact value iteration against adaptive state aggregation on maze MDPs up to a million states, where value iteration wins at every size tested.",
    sourceUrl: "https://github.com/sunnysanitize/Parallel-State-Aggregation",
    details: [
      {
        label: "Full report",
        href: "https://github.com/sunnysanitize/Parallel-State-Aggregation/blob/main/docs/parallel_note.md",
        linkLabel: "link",
      },
    ],
  },
  {
    name: "Theft Mapping Around UofT St. George",
    description:
      "A heatmap of Toronto Police theft-over-$5,000 incidents around the UofT St. George campus, built after my own laptop was stolen there.",
    projectUrl: "https://theftdataproject.sunnyzhang.dev",
    sourceUrl: "https://github.com/sunnysanitize/uoft-theft-map-project",
  },
];
