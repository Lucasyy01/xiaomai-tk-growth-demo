import { useMemo, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import { CENTRAL_PAGE_ID, pages } from './config/pages.js';
import BillingCollection from './pages/BillingCollection.jsx';
import CreditApproval from './pages/CreditApproval.jsx';
import CreatorAssets from './pages/CreatorAssets.jsx';
import CustomerAdmission from './pages/CustomerAdmission.jsx';
import CustomerPortal from './pages/CustomerPortal.jsx';
import LaunchChecklist from './pages/LaunchChecklist.jsx';
import PaymentAuthorization from './pages/PaymentAuthorization.jsx';
import ProjectWorkorder from './pages/ProjectWorkorder.jsx';

const pageComponentMap = {
  'customer-admission': CustomerAdmission,
  'launch-checklist': LaunchChecklist,
  'payment-authorization': PaymentAuthorization,
  'credit-approval': CreditApproval,
  'project-workorder': ProjectWorkorder,
  'creator-assets': CreatorAssets,
  'billing-collection': BillingCollection,
  'customer-portal': CustomerPortal,
};

export default function App() {
  const [activePageId, setActivePageId] = useState(CENTRAL_PAGE_ID);

  const activePage = useMemo(() => {
    return pages.find((page) => page.id === activePageId) || pages.find((page) => page.id === CENTRAL_PAGE_ID);
  }, [activePageId]);

  const ActivePage = pageComponentMap[activePage.id] || ProjectWorkorder;

  return (
    <AppShell pages={pages} activePage={activePage} onNavigate={setActivePageId}>
      <ActivePage page={activePage} onNavigate={setActivePageId} />
    </AppShell>
  );
}
