import PageScaffold from '../components/PageScaffold.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

export default function BillingCollection({ page }) {
  return (
    <PageScaffold page={page}>
      <div className="section-grid section-grid--four">
        <SummaryCard title="应收总额" value="¥42,800" status="待支付" meta="平台对客户的项目应收" />
        <SummaryCard title="已收金额" value="¥20,000" status="部分回款" meta="最近一次自动扣款成功" />
        <SummaryCard title="待收金额" value="¥22,800" status="待支付" meta="本轮不做核销联动" />
        <SummaryCard title="扣款授权" value="有效" status="已授权" meta="只做状态展示，不接真实支付" />
      </div>
    </PageScaffold>
  );
}
