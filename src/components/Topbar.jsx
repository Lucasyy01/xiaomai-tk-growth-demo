import { demoSummary } from '../data/mockData.js';
import { workflow } from '../config/pages.js';
import StatusBadge from './StatusBadge.jsx';

export default function Topbar({ activePage }) {
  return (
    <header className="topbar">
      <div>
        <div className="topbar__product">{demoSummary.productName}</div>
        <div className="workflow-path">
          {workflow.map((item) => (
            <span key={item} className={item === activePage.phase ? 'workflow-path__item workflow-path__item--active' : 'workflow-path__item'}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="topbar__right">
        <div className="topbar__client">
          <span>当前项目</span>
          <strong>{demoSummary.activeProject}</strong>
        </div>
        <StatusBadge status={activePage.status} />
      </div>
    </header>
  );
}
