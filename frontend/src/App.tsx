import { useEffect, useState } from "react";

import BrandHeader from "./components/BrandHeader";
import DashboardCard, { type DashboardCardData } from "./components/DashboardCards";
import HealthPage from "./components/HealthPage";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";
import {
  type EmployeeUser,
  getCurrentEmployee,
  loginEmployee,
  logoutEmployee,
} from "./lib/api";

const dashboardCards: DashboardCardData[] = [
  {
    kicker: "Curated sets",
    title: "Shop The Set",
    description: "Ready-made solutions for common spaces.",
    actionLabel: "Open sets",
  },
  {
    kicker: "Upload space",
    title: "Upload Space",
    description: "Begin with a customer photo.",
    actionLabel: "Upload photo",
  },
  {
    kicker: "Build a layout",
    title: "Builder",
    description: "Choose a space and create a visual plan.",
    actionLabel: "Open builder",
  },
  {
    kicker: "Catalog",
    title: "Product Catalog",
    description: "Browse ARMO products and details.",
    actionLabel: "Browse products",
  },
];

function getEmployeeDisplayName(employee: EmployeeUser) {
  const fullName = `${employee.first_name} ${employee.last_name}`.trim();

  return fullName || employee.username;
}

function App() {
  const [employee, setEmployee] = useState<EmployeeUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const currentPath = window.location.pathname;

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        const currentEmployee = await getCurrentEmployee();

        if (isMounted) {
          setEmployee(currentEmployee);
        }
      } catch {
        if (isMounted) {
          setEmployee(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    if (currentPath !== "/health" && currentPath !== "/info") {
      initializeSession();
    } else {
      setIsCheckingSession(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentPath]);

  async function handleLogin(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoginError("");
    setIsSubmittingLogin(true);

    try {
      const response = await loginEmployee(username, password);

      setEmployee(response.user);
      setUsername("");
      setPassword("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";

      setLoginError(message);
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutEmployee();
      setEmployee(null);
    } catch {
      setLoginError("Unable to log out. Please try again.");
    }
  }

  if (currentPath === "/health" || currentPath === "/info") {
    return <HealthPage />;
  }

  if (isCheckingSession) {
    return <LoadingScreen />;
  }

  if (!employee) {
    return (
      <LoginScreen
        username={username}
        password={password}
        loginError={loginError}
        isSubmittingLogin={isSubmittingLogin}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="app-shell">
      <BrandHeader
        rightSlot={
          <button
            className="secondary-button compact-button"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
        }
      />

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">ARMO Visual</p>
            <h1 className="hero-title">Create a visual plan with intention.</h1>
            <p className="hero-description">Upload a customer photo, place ARMO products, and prepare a clear shopping list.</p>
          </div>

          <aside className="hero-panel">
            <div>
              <p className="panel-label">New consultation</p>
              <p className="panel-value">Start with a customer space.</p>
            </div>

            <button className="primary-button" type="button">
              Start
            </button>
          </aside>
        </section>

        <section>
          <h2 className="section-heading">Choose a path</h2>

          <div className="dashboard-grid">
            {dashboardCards.map((card) => (
              <DashboardCard card={card} key={card.title} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;