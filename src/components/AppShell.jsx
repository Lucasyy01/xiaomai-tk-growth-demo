import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AppShell({ pages, activePage, onNavigate, children }) {
  return (
    <div className="app-shell">
      <Sidebar pages={pages} activePageId={activePage.id} onNavigate={onNavigate} />
      <main className="app-main">
        <Topbar activePage={activePage} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
