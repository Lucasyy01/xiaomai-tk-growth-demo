import StatusBadge from './StatusBadge.jsx';

export default function SummaryCard({ title, value, meta, status, tone, isCentral = false, onClick }) {
  const Component = onClick ? 'button' : 'article';
  const className = `summary-card${isCentral ? ' summary-card--central' : ''}${onClick ? ' summary-card--clickable' : ''}`;

  return (
    <Component className={className} onClick={onClick} type={onClick ? 'button' : undefined}>
      <div className="summary-card__topline">
        <span>{title}</span>
        {status ? <StatusBadge status={status} tone={tone} /> : null}
      </div>
      <strong>{value}</strong>
      {meta ? <p>{meta}</p> : null}
    </Component>
  );
}
