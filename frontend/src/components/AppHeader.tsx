import type { EmployeeUser } from "../lib/api";

type AppHeaderProps = {
  apiStatus: string;
  isApiOnline: boolean;
  employee: EmployeeUser;
  onLogout: () => void;
};

function getEmployeeDisplayName(employee: EmployeeUser) {
  const fullName = `${employee.first_name} ${employee.last_name}`.trim();

  return fullName || employee.username;
}

function AppHeader({apiStatus, isApiOnline, employee, onLogout}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-wordmark" aria-label="ARMO">ARMO</div>
        <div className="brand-divider" aria-hidden="true"></div>
        <div className="brand-text">
          <span className="brand-name">Visual</span>
          <span className="brand-subtitle">Signed in as {getEmployeeDisplayName(employee)}</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-status" aria-live="polite">
          <span className={isApiOnline ? "status-dot is-online" : "status-dot"} aria-hidden="true" />
          <span>{apiStatus}</span>
        </div>
        <button className="secondary-button compact-button" onClick={onLogout} type="button">
          Log out
        </button>
      </div>
    </header>
  );
}

export default AppHeader;