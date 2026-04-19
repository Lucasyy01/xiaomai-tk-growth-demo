import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function CreditApproval({ page, onNavigate }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--three">
        <SummaryCard title="总额度" value="¥300,000" status="已通过" meta="授信用于项目消耗占额展示" />
        <SummaryCard title="账期" value="15 天" status="已通过" meta="第一轮不实现审批流和账期计算" />
        <SummaryCard title="风险等级" value="低风险" status="可立项" meta="可进入项目工单" onClick={() => onNavigate('project-workorder')} />
      </div>
    </PageScaffold>
  );
}
