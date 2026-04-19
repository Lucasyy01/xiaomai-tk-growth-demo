import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function CustomerAdmission({ page }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--three">
        <SummaryCard title="候选客户" value="24 家" status="待评估" meta="品牌型卖家优先进入准入池" />
        <SummaryCard title="可推进客户" value="8 家" status="可推进" meta="满足基础经营和内容测试条件" />
        <SummaryCard title="待补充信息" value="5 家" status="待补资料" meta="缺少店铺或广告资产准备信息" />
      </div>
    </PageScaffold>
  );
}
