import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function CreatorAssets({ page }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--two">
        <SummaryCard title="达人合作 Tab" value="12 个合作单" status="待交付" meta="本轮只保留 Tab 骨架和摘要入口" />
        <SummaryCard title="素材资产 Tab" value="18 条素材" status="待授权" meta="明确已通过、已授权、可放量是不同状态" />
      </div>
    </PageScaffold>
  );
}
