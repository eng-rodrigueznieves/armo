import BrandHeader from "./BrandHeader";

type LoginScreenProps = {
  username: string;
  password: string;
  loginError: string;
  isSubmittingLogin: boolean;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
};

function LoginScreen({
  username,
  password,
  loginError,
  isSubmittingLogin,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginScreenProps) {
  return (
    <div className="app-shell login-shell">
      <BrandHeader />

      <main className="login-layout">
        <section className="login-intro">
          <p className="eyebrow">ARMO Visual</p>
          <h1 className="login-title">Plan the space before the purchase.</h1>
          <p className="login-description">Sign in to create visual plans, product layout, and shopping lists for in-store consultations.</p>
        </section>

        <section className="login-card" aria-label="Employee login">
          <div>
            <p className="login-card-kicker">Employee login</p>
            <h2 className="login-card-title">Employee access</h2>
            <p className="login-card-description">Use your ARMO credentials to continue.</p>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <label className="form-field">
              <span>Username</span>
              <input
                autoComplete="username"
                name="username"
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Enter username"
                type="text"
                value={username}
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Enter password"
                type="password"
                value={password}
              />
            </label>

            {loginError ? (
              <p className="form-error" role="alert">
                {loginError}
              </p>
            ) : null}

            <button
              className="primary-button full-width-button"
              disabled={isSubmittingLogin}
              type="submit"
            >
              {isSubmittingLogin ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-support-note">Need help? Contact a store administrator.</p>
        </section>
      </main>
    </div>
  );
}

export default LoginScreen;