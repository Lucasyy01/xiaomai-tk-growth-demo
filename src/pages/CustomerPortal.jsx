import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function CustomerPortal({ page }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--three">
        <SummaryCard title="我的项目" value="1 个进行中" status="执行中" meta="客户侧看到项目摘要" />
        <SummaryCard title="待确认内容" value="3 项" status="待确认" meta="素材授权和账单确认占位" />
        <SummaryCard title="待支付账单" value="¥22,800" status="待支付" meta="第一轮不提供真实支付动作" />
      </div>
    </PageScaffold>
  );
}
