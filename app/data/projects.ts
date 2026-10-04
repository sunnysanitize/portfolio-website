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
      "A multi-agent simulator that turns any user-authored world and cast into a seven-day narrative through planning, memory retrieval, reflection, and relationship consequences.",
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
      "An AI launch assistant built in 36 hours: four agents research a market, write positioning, generate assets, and queue outreach behind a human approval gate, paired with a seven-day launch plan.",
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
      "A preregistered study of adaptive state aggregation on a 9,261-state MDP, separating the value of the Bellman residual signal from the annealing schedule it drives. Feedback shows no consistent benefit.",
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
    name: "Theft Mapping Around UofT St. George",
    description:
      "A map of Toronto Police theft-over-$5,000 incidents around the UofT St. George campus, built after my own laptop was stolen there. A FastAPI pipeline filters records by campus boundary and a Next.js frontend renders the heatmap.",
    projectUrl: "https://theftdataproject.sunnyzhang.dev",
    sourceUrl: "https://github.com/sunnysanitize/uoft-theft-map-project",
  },
  {
    name: "Markov Chain Model for Market Regime Forecasting",
    description:
      "A first-order Markov chain over daily equity return regimes (down, flat, up) that forecasts next-day state probabilities, with a Flask dashboard for threshold tuning and Monte Carlo simulation.",
    sourceUrl:
      "https://github.com/sunnysanitize/Markov-Chain-Model-for-Daily-Return-Regimes",
  },
  {
    name: "Gambler's Ruin Simulation",
    description:
      "A stochastic risk simulator pairing Monte Carlo trials, up to 100k per run, with closed-form probability, including convergence diagnostics and empirical-versus-theoretical error tracking.",
    sourceUrl: "https://github.com/sunnysanitize/gamblers-ruin-simulatior",
  },
];
