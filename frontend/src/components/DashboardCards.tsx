export type DashboardCardData = {
  kicker: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

type DashboardCardProps = {
  card: DashboardCardData;
};

function DashboardCard({ card }: DashboardCardProps) {
  return (
    <article className="dashboard-card">
      <div>
        <p className="card-kicker">{card.kicker}</p>
        <h3 className="card-title">{card.title}</h3>
        <p className="card-description">{card.description}</p>
      </div>
      <a href={card.actionHref} className="secondary-link-button">
        {card.actionLabel}
      </a>
    </article>
  );
}

export default DashboardCard;