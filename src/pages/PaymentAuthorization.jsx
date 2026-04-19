import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function PaymentAuthorization({ page }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--three">
        <SummaryCard title="账户平台" value="连连" status="已绑定" meta="回款账户已完成基础校验" />
        <SummaryCard title="自动扣款授权" value="已授权" status="已授权" meta="用于平台对客户应收的自动扣款演示" />
        <SummaryCard title="最近授权结果" value="成功" status="已授权" meta="第一轮仅展示状态，不接真实接口" />
      </div>
    </PageScaffold>
  );
}
