import { pageSkeletonItems } from '../data/mockData.js';
import StatusBadge from './StatusBadge.jsx';
import SummaryCard from './SummaryCard.jsx';

export default function PageScaffold({ page, children }) {
  const skeletonItems = pageSkeletonItems[page.id] || [];

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone={page.priority === 'P0' ? 'accent' : 'neutral'} />
          {page.isCentral ? <StatusBadge status="中枢页" tone="accent" /> : null}
          <StatusBadge status={page.status} />
        </div>
      </header>

      {children}

      <div className="section-grid section-grid--two">
        <SummaryCard title="页面下一步" value={page.nextAction} status={page.status} meta="第一轮仅展示动作入口，不实现复杂流程。" />
        <article className="object-panel">
          <div className="section-title">承接对象</div>
          <div className="tag-list">
            {page.objects.map((item) => (
              <span key={item} className="object-tag">
                {item}
              </span>
            ))}
          </div>
        </article>
      </div>

      <article className="skeleton-panel">
        <div>
          <div className="section-title">本轮骨架占位</div>
          <p>先建立页面结构、业务区块和跳转入口，后续迭代再补深层交互。</p>
        </div>
        <div className="skeleton-list">
          {skeletonItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </article>
    </section>
  );
}
