import { useEffect, useState } from "react";

import { getHealthStatus } from "./lib/api";

type DashboardCard = {
  kicker: string;
  title: string;
  description: string;
  actionLabel: string;
};

const dashboardCards: DashboardCard[] = [
  {
    kicker: "Curated solutions",
    title: "Shop The Set",
    description:
      "Present ready-made organization sets for pantry, coffee station, and laundry spaces.",
    actionLabel: "View sets",
  },
  {
    kicker: "Customer project",
    title: "Upload Space",
    description:
      "Start a personalized consultation by uploading a customer space photo.",
    actionLabel: "Create project",
  },
  {
    kicker: "Specialized builder",
    title: "Refrigerator Builder",
    description:
      "Plan organized refrigerator sections using templates and ARMO product groups.",
    actionLabel: "Open builder",
  },
  {
    kicker: "Product library",
    title: "Product Catalog",
    description:
      "Browse ARMO products by category, style, dimensions, material, and price.",
    actionLabel: "Browse catalog",
  },
];

function App() {
  const [apiStatus, setApiStatus] = useState("Checking API connection...");
  const [isApiOnline, setIsApiOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkApiHealth() {
      try {
        const health = await getHealthStatus();

        if (isMounted) {
          setApiStatus(`${health.service}: ${health.status}`);
          setIsApiOnline(true);
        }
      } catch {
        if (isMounted) {
          setApiStatus("API not reachable");
          setIsApiOnline(false);
        }
      }
    }

    checkApiHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            A
          </div>

          <div className="brand-text">
            <span className="brand-name">ARMO Visual</span>
            <span className="brand-subtitle">Internal consultation tool</span>
          </div>
        </div>

        <div className="header-status" aria-live="polite">
          <span
            className={isApiOnline ? "status-dot is-online" : "status-dot"}
            aria-hidden="true"
          />
          <span>{apiStatus}</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ARMO employee workspace</p>

            <h1 className="hero-title">
              Help customers visualize calm, organized spaces before they buy.
            </h1>

            <p className="hero-description">
              Create customer projects, upload space photos, build layouts with
              ARMO products, and turn each consultation into a clear shopping
              list.
            </p>
          </div>

          <aside className="hero-panel">
            <div>
              <p className="panel-label">Current milestone</p>
              <p className="panel-value">
                Foundation, employee login, and dashboard shell
              </p>
            </div>

            <button className="primary-button" type="button">
              Start consultation
            </button>
          </aside>
        </section>

        <section>
          <h2 className="section-heading">Home</h2>

          <div className="dashboard-grid">
            {dashboardCards.map((card) => (
              <article className="dashboard-card" key={card.title}>
                <div>
                  <p className="card-kicker">{card.kicker}</p>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                </div>

                <button className="secondary-button" type="button">
                  {card.actionLabel}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;