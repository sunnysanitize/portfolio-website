export type ProjectGroup = "Built" | "Competitions" | "Research";

export interface Project {
  name: string;
  group: ProjectGroup;
  description: string;
  /** Headline result shown under the title, e.g. a placement or prize. */
  result?: string;
  /** Featured projects appear on the home page, in array order. */
  featured?: boolean;
  links: { label: string; href: string }[];
}

/** Order of the groups on the /projects page. */
export const projectGroups: ProjectGroup[] = ["Built", "Competitions", "Research"];

export const projects: Project[] = [
  {
    name: "Tiny Society",
    group: "Built",
    featured: true,
    description:
      "A multi-agent simulator that turns a user-authored world and cast into a seven-day narrative.",
    links: [
      { label: "website", href: "https://tinysocietyai.com" },
      { label: "code", href: "https://github.com/sunnysanitize/tiny-society" },
      { label: "metrics", href: "/tiny-society-calculations-and-metrics.pdf" },
    ],
  },
  {
    name: "LaunchPilot",
    group: "Competitions",
    featured: true,
    result: "Winner, Backboard.io and SPUR Top 3",
    description:
      "An AI launch assistant built in 36 hours, running four agents from market research to approved outreach.",
    links: [
      { label: "website", href: "https://launchpilot-theta.vercel.app" },
      { label: "code", href: "https://github.com/LegendaryAKx3/launchpilot" },
      { label: "devpost", href: "https://devpost.com/software/launchpilot-si9j8d" },
    ],
  },
  {
    name: "QuantiFi 2026 Algorithmic Trading",
    group: "Competitions",
    featured: true,
    result: "2nd in PnL of 30+ teams",
    description:
      "A market-making engine for 26 products with a fair-value model per product family, tuned on held-out days to avoid overfitting.",
    links: [{ label: "strategy report", href: "/quantifi-2026.pdf" }],
  },
  {
    name: "Robust Portfolio Optimization",
    group: "Research",
    description:
      "A pre-registered UTDSYS study of whether robust portfolios lower risk without giving up risk-adjusted return, now paper trading on Alpaca.",
    links: [
      {
        label: "website",
        href: "https://utdsys.com/quantitative-research/robust-portfolios",
      },
    ],
  },
  {
    name: "Feedback or Annealing?",
    group: "Research",
    description:
      "A preregistered study of adaptive state aggregation on a 9,261-state MDP, finding no consistent benefit from feedback.",
    links: [
      { label: "paper", href: "/feedback-or-annealing.pdf" },
      {
        label: "code",
        href: "https://github.com/sunnysanitize/Residual-Epsilon-Aggregation",
      },
    ],
  },
  {
    name: "Parallel State Aggregation",
    group: "Research",
    description:
      "A threaded benchmark of exact value iteration against adaptive state aggregation on maze MDPs up to a million states, where value iteration wins at every size tested.",
    links: [
      {
        label: "full report",
        href: "https://github.com/sunnysanitize/Parallel-State-Aggregation/blob/main/docs/parallel_note.md",
      },
      {
        label: "code",
        href: "https://github.com/sunnysanitize/Parallel-State-Aggregation",
      },
    ],
  },
  {
    name: "Theft Mapping Around UofT St. George",
    group: "Built",
    description:
      "A heatmap of Toronto Police theft-over-$5,000 incidents around the UofT St. George campus, built after my own laptop was stolen there.",
    links: [
      { label: "website", href: "https://theftdataproject.sunnyzhang.dev" },
      {
        label: "code",
        href: "https://github.com/sunnysanitize/uoft-theft-map-project",
      },
    ],
  },
];
