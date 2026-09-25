export interface Project {
  name: string;
  bullets: string[];
  shortDescription: string;
  /** Optional longer copy used when the project is shown in the Featured section. */
  featuredDescription?: string;
  tags: string[];
  projectUrl: string;
  showWebsiteButton?: boolean;
  sourceUrl: string;
  devpostUrl?: string;
  image: string;
}

export const projects: Project[] = [
  {
    name: "Tiny Society",
    shortDescription:
      "A multi-agent AI social simulation and prediction engine. Build a world, drop in your characters, fire off an event, and watch them reason, remember, form relationships, and shift opinions over simulated days, then read the swarm's forecast of where it's heading, like Tomodachi Life, but the villagers actually have opinions.",
    featuredDescription:
      "Social simulation and prediction engine. Tomodachi Life, but the villagers actually have opinions.",
    bullets: [
      "A multi-agent AI social simulation and prediction engine, where AI agents observe, remember, reflect, and shift opinions over 7 to 30+ simulated days, then forecast where the world is heading.",
      "Built with Next.js, FastAPI (Server-Sent Events), a Python generative-agents engine, and optional Supabase saves with JWT auth.",
      "A consequence layer converts LLM social intents into calibrated affinity changes, giving relationships real inertia instead of model-written numbers.",
    ],
    tags: ["Next.js", "TypeScript", "React Flow", "D3 Force", "FastAPI", "Pydantic", "Supabase", "Server-Sent Events"],
    projectUrl: "https://tinysocietyai.com",
    sourceUrl: "https://github.com/sunnysanitize/tiny-society",
    image: "/tinysociety.png",
  },
  {
    name: "LaunchPilot",
    shortDescription:
      "A Hack Canada 2026 winning web application that orchestrates multi-agent product research, positioning, execution planning, and outreach in one supervised launch workflow.",
    featuredDescription:
      "A two-time winning Hack Canada 2026 project.",
    bullets: [
      "A two-time winning project at Hack Canada 2026 that moves a product from a brief or GitHub repo into a supervised, multi-agent launch workflow.",
      "Built with Next.js, FastAPI, SQLAlchemy, Alembic, and Postgres, with a Backboard memory layer giving each agent persistent context across runs.",
      "Maps competitors and pain points, generates ICP and messaging, builds a 7-day execution plan, and prepares outreach leads batched for approval.",
    ],
    tags: ["Next.js", "TypeScript", "Auth0", "FastAPI", "SQLAlchemy", "Alembic", "PostgreSQL", "Resend"],
    projectUrl: "https://launchpilot-theta.vercel.app",
    sourceUrl: "https://github.com/LegendaryAKx3/launchpilot",
    devpostUrl: "https://devpost.com/software/launchpilot-si9j8d",
    image: "/launchpilot.png",
  },
  // Temporarily disabled — uncomment to restore.
  // {
  //   name: "FactorAtlas",
  //   shortDescription:
  //     "A full-stack portfolio intelligence platform with a Next.js frontend, FastAPI backend, PostgreSQL, and Docker Compose, combining deterministic quant analytics with grounded AI explanations for traceable investment insight.",
  //   bullets: [
  //     "A full-stack portfolio intelligence platform that pairs deterministic quant analytics with grounded AI explanations for traceable investment insight.",
  //     "Built with Next.js, TypeScript, FastAPI, PostgreSQL, and Docker Compose, split into modular portfolio, market data, quant, graph, and AI services.",
  //     "Computes volatility, beta, Sharpe ratio, and correlation matrices with pandas, numpy, scipy, and statsmodels, with AI prompts grounded in the analytics.",
  //   ],
  //   tags: ["Next.js", "FastAPI", "PostgreSQL", "pandas", "SciPy", "statsmodels", "NetworkX", "yfinance"],
  //   projectUrl: "",
  //   showWebsiteButton: false,
  //   sourceUrl: "https://github.com/sunnysanitize/FactorAtlas",
  //   image: "/FactorAtlas.png",
  // },
  {
    name: "Markov Chain Model for Market Regime Forecasting",
    shortDescription:
      "A modular Python application that models daily equity return regimes (down/flat/up) using a first-order Markov chain and forecasts next-day state probabilities from historical price data. Includes a Flask dashboard with threshold tuning and Monte Carlo simulation.",
    featuredDescription:
      "Markov-chain model forecasting daily up/flat/down market regimes from price history.",
    bullets: [
      "A modular Python app that models daily equity return regimes (down/flat/up) with a first-order Markov chain and forecasts next-day state probabilities.",
      "Cleans price data, computes returns, discretizes regimes, and builds a row-normalized transition matrix for conditional next-state probabilities.",
      "Ships a CLI report tool and a Flask dashboard with threshold tuning, Monte Carlo simulation, and unit tests for the transition logic.",
    ],
    tags: ["Python", "pandas", "NumPy", "Flask", "Markov Chains", "Monte Carlo"],
    projectUrl: "",
    showWebsiteButton: false,
    sourceUrl:
      "https://github.com/sunnysanitize/Markov-Chain-Model-for-Daily-Return-Regimes",
    image: "/MarkovForecast.png",
  },
  {
    name: "Heat Mapping $5,000+ Thefts Around UofT (St. George)",
    shortDescription:
      "A full-stack crime intelligence web app that maps Toronto Police theft-over-$5,000 incidents around the UofT St. George campus. Runs a Python/FastAPI pipeline with SQLite and a Next.js frontend featuring an interactive OpenStreetMap heatmap.",
    featuredDescription:
      "Interactive heatmap of $5,000+ thefts around UofT — built after my laptop was stolen on campus.",
    bullets: [
      "A full-stack crime intelligence app that maps Toronto Police theft-over-$5,000 incidents around the UofT St. George campus, built after my own laptop was stolen on campus.",
      "A Python/FastAPI pipeline filters police records by campus geospatial boundaries, normalizes the data in SQLite, and serves a clean API.",
      "A Next.js/TypeScript frontend renders an interactive OpenStreetMap heatmap with live summary metrics and incident sample tables.",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MapLibre GL", "FastAPI", "Pydantic", "SQLite", "OpenStreetMap"],
    projectUrl: "https://theftdataproject.sunnyzhang.dev",
    sourceUrl: "https://github.com/sunnysanitize/uoft-theft-map-project",
    image: "/theftdatabase.png",
  },
  {
    name: "Stochastic Risk Modeling: Gambler's Ruin Simulation",
    shortDescription:
      "A Gambler's Ruin simulation platform in Python combining Monte Carlo experimentation with closed-form probability analysis. Supports up to 100k trials per run with Flask and Streamlit web workflows and an interactive Plotly dashboard.",
    featuredDescription:
      "Gambler's Ruin risk simulator pairing Monte Carlo trials with closed-form probability.",
    bullets: [
      "A Gambler's Ruin simulation platform in Python that combines Monte Carlo experimentation with closed-form probability analysis to validate outcomes against theory.",
      "Organized as a reusable package (simulation, analytics, visualization, CLI, web) supporting up to 100k trials per run with Flask and Streamlit workflows.",
      "Includes convergence diagnostics, empirical-vs-theoretical error tracking, and an interactive Plotly dashboard for reproducible analysis.",
    ],
    tags: ["Python", "NumPy", "Flask", "Streamlit", "Plotly", "Monte Carlo"],
    projectUrl: "",
    showWebsiteButton: false,
    sourceUrl: "https://github.com/sunnysanitize/gamblers-ruin-simulatior",
    image: "/GamblersRuin.png",
  },
];
