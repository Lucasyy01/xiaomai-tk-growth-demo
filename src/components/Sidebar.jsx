import StatusBadge from './StatusBadge.jsx';

export default function Sidebar({ pages, activePageId, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark">XM</div>
        <div>
          <strong>小麦云增长</strong>
          <span>TK Service OS</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="主导航">
        {pages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            className={`nav-item${activePageId === page.id ? ' nav-item--active' : ''}${page.isCentral ? ' nav-item--central' : ''}`}
            onClick={() => onNavigate(page.id)}
          >
            <span className="nav-item__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="nav-item__text">
              <strong>{page.navTitle}</strong>
              <small>{page.phase}</small>
            </span>
            {page.isCentral ? <StatusBadge status="中枢" tone="accent" /> : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}
