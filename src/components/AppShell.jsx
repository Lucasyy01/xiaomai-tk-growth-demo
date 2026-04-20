import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AppShell({ pages, activePage, onNavigate, children }) {
  const navigationPages = pages.filter((page) => !page.hideInSidebar);
  const activeNavPageId = activePage.hideInSidebar && activePage.parentId ? activePage.parentId : activePage.id;

  return (
    <div className="app-shell">
      <Sidebar pages={navigationPages} activePageId={activeNavPageId} onNavigate={onNavigate} />
      <main className="app-main">
        <Topbar activePage={activePage} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
