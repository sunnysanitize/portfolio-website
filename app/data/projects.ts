export type ProjectGroup = "Projects" | "Competitions" | "Research";

export interface Project {
  name: string;
  /** Home-page section the project is listed under. */
  group: ProjectGroup;
  /** Area of work, shown as a small label above the title. */
  topic: string;
  description: string;
  /** Headline result shown under the title, e.g. a placement or prize. */
  result?: string;
  /** Main languages and frameworks, taken from the repo's dependency files. */
  stack?: string[];
  links: { label: string; href: string }[];
}

/** Order of the project sections on the home page. */
export const projectGroups: ProjectGroup[] = ["Research", "Competitions", "Projects"];

/** Within a section, projects are listed in array order. */
export const projects: Project[] = [
  {
    name: "Tiny Society",
    group: "Projects",
    topic: "Multi-agent LLM systems",
    description:
      "A multi-agent simulator that turns a user-authored world and cast of characters into a seven-day narrative.",
    stack: ["Python", "Claude API", "FastAPI", "Next.js"],
    links: [
      { label: "Live site", href: "https://tinysocietyai.com" },
      { label: "GitHub", href: "https://github.com/sunnysanitize/tiny-society" },
      { label: "Metrics", href: "/tiny-society-calculations-and-metrics.pdf" },
    ],
  },
  {
    name: "LaunchPilot",
    group: "Competitions",
    topic: "Agentic workflows",
    result: "Winner, Backboard.io and SPUR Top 3",
    description:
      "An AI launch assistant that runs four agents in sequence, from market research through to approved outreach. Built in 36 hours.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Next.js"],
    links: [
      { label: "Live site", href: "https://launchpilot-theta.vercel.app" },
      { label: "GitHub", href: "https://github.com/LegendaryAKx3/launchpilot" },
      { label: "Devpost", href: "https://devpost.com/software/launchpilot-si9j8d" },
    ],
  },
  {
    name: "QuantiFi 2026 Algorithmic Trading",
    group: "Competitions",
    topic: "Market making",
    result: "2nd in PnL of 30+ teams",
    description:
      "A market-making engine for 26 products with a fair-value model per product family, tuned on held-out days to avoid overfitting.",
    links: [{ label: "Strategy report", href: "/quantifi-2026.pdf" }],
  },
  {
    name: "Theft Mapping Around UofT St. George",
    group: "Projects",
    topic: "Geospatial data",
    description:
      "A heatmap of Toronto Police theft-over-$5,000 incidents around the UofT St. George campus, built after my own laptop was stolen there.",
    stack: ["Python", "FastAPI", "Next.js"],
    links: [
      { label: "Live site", href: "https://theftdataproject.sunnyzhang.dev" },
      {
        label: "GitHub",
        href: "https://github.com/sunnysanitize/uoft-theft-map-project",
      },
    ],
  },
  {
    name: "Robust Portfolio Optimization",
    group: "Research",
    topic: "Portfolio optimization",
    description:
      "A pre-registered UTDSYS study of whether robust portfolios lower risk without giving up risk-adjusted return, now paper trading on Alpaca.",
    links: [
      {
        label: "Read the study",
        href: "https://utdsys.com/quantitative-research/robust-portfolios",
      },
    ],
  },
  {
    name: "Feedback or Annealing?",
    group: "Research",
    topic: "Reinforcement learning",
    description:
      "A preregistered study of adaptive state aggregation on a 9,261-state MDP, testing whether feedback improves on a fixed schedule.",
    stack: ["Python", "NumPy", "Numba"],
    links: [
      { label: "Paper", href: "/feedback-or-annealing.pdf" },
      {
        label: "GitHub",
        href: "https://github.com/sunnysanitize/Residual-Epsilon-Aggregation",
      },
    ],
  },
  {
    name: "Parallel State Aggregation",
    group: "Research",
    topic: "Dynamic programming",
    description:
      "A threaded benchmark of exact value iteration against adaptive state aggregation on maze MDPs of up to a million states.",
    stack: ["Python", "NumPy", "Numba"],
    links: [
      {
        label: "Read the report",
        href: "https://github.com/sunnysanitize/Parallel-State-Aggregation/blob/main/docs/parallel_note.md",
      },
      {
        label: "GitHub",
        href: "https://github.com/sunnysanitize/Parallel-State-Aggregation",
      },
    ],
  },
];
