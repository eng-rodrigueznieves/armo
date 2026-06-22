import { useEffect, useState } from "react";

import { getHealthStatus } from "../lib/api";
import BrandHeader from "./BrandHeader";

type HealthState = {
  statusLabel: string;
  serviceLabel: string;
  isOnline: boolean;
};

function HealthPage() {
  const [health, setHealth] = useState<HealthState>({
    statusLabel: "Checking",
    serviceLabel: "ARMO Visual API",
    isOnline: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const response = await getHealthStatus();

        if (isMounted) {
          setHealth({
            statusLabel: response.status,
            serviceLabel: response.service,
            isOnline: response.status === "ok",
          });
        }
      } catch {
        if (isMounted) {
          setHealth({
            statusLabel: "unreachable",
            serviceLabel: "ARMO Visual API",
            isOnline: false,
          });
        }
      }
    }

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <BrandHeader
        subtitle="System information"
        rightSlot={
          <a className="secondary-link-button" href="/">
            Back to app
          </a>
        }
      />

      <main className="main-content">
        <section className="health-page">
          <p className="eyebrow">System status</p>

          <h1 className="health-title">ARMO Visual Health Check</h1>

          <p className="health-description">
            Check the connection between ARMO Visual and the API.
          </p>

          <div className="health-card">
            <div>
              <p className="health-label">Service</p>
              <p className="health-value">{health.serviceLabel}</p>
            </div>

            <div>
              <p className="health-label">Status</p>
              <p className="health-status">
                <span
                  className={
                    health.isOnline ? "status-dot is-online" : "status-dot"
                  }
                  aria-hidden="true"
                />
                {health.statusLabel}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HealthPage;