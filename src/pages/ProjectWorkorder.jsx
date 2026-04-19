import PageScaffold from '../components/PageScaffold.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { phaseSteps, projectSnapshot, shellMetrics } from '../data/mockData.js';

export default function ProjectWorkorder({ page, onNavigate }) {
  return (
    <PageScaffold page={page}>
      <article className="central-hero">
        <div>
          <div className="eyebrow">全系统中枢页</div>
          <h2>{projectSnapshot.projectName}</h2>
          <p>{projectSnapshot.nextAction}</p>
        </div>
        <div className="central-hero__meta">
          <span>{projectSnapshot.clientName}</span>
          <strong>{projectSnapshot.owner}</strong>
          <small>{projectSnapshot.cycle}</small>
        </div>
      </article>

      <article className="stage-strip">
        {phaseSteps.map((step) => (
          <div key={step} className={`stage-node${step === projectSnapshot.currentStage ? ' stage-node--active' : ''}`}>
            <span>{step}</span>
            {step === projectSnapshot.currentStage ? <StatusBadge status="当前阶段" tone="accent" /> : null}
          </div>
        ))}
      </article>

      <div className="section-grid section-grid--four">
        {shellMetrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} isCentral={metric.title === '账单回款'} />
        ))}
      </div>

      <div className="section-grid section-grid--three">
        <SummaryCard
          title="达人合作入口"
          value="查看合作与素材"
          status="待授权"
          meta="第一轮只跳转页面，不深做漏斗"
          onClick={() => onNavigate('creator-assets')}
        />
        <SummaryCard
          title="账单回款入口"
          value="查看应收与扣款"
          status="部分回款"
          meta="第一轮只展示状态，不做真实支付"
          onClick={() => onNavigate('billing-collection')}
        />
        <SummaryCard
          title="客户视角入口"
          value="预览轻门户"
          status="待确认"
          meta="第一轮只提供客户侧骨架"
          onClick={() => onNavigate('customer-portal')}
        />
      </div>
    </PageScaffold>
  );
}
