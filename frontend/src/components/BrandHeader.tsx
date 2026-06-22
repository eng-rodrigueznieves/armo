import type { ReactNode } from "react";

type BrandHeaderProps = {
  subtitle?: string;
  rightSlot?: ReactNode;
};

function BrandHeader({ subtitle, rightSlot }: BrandHeaderProps) {
  return (
    <header className="app-header">
      <a className="brand-home-link" href="/" aria-label="Go to ARMO Visual home">
        <div className="brand-lockup">
          <div className="brand-wordmark" aria-label="ARMO">
            ARMO
          </div>

          <div className="brand-divider" aria-hidden="true" />

          <div className="brand-text">
            <span className="brand-name">Visual</span>

            {subtitle ? (
              <span className="brand-subtitle">{subtitle}</span>
            ) : null}
          </div>
        </div>
      </a>

      {rightSlot ? <div className="header-actions">{rightSlot}</div> : null}
    </header>
  );
}

export default BrandHeader;