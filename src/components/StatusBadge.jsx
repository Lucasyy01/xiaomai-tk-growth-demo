const dangerStatuses = ['已冻结', '已超时', '已阻塞', '已逾期', '授权失效', '已失效', '不建议复投', '已拒绝'];
const successStatuses = ['可推进', '已通过', '已授权', '已绑定', '可立项', '已完成', '已结清'];
const warningStatuses = ['待确认', '待授权', '待支付', '待补资料', '待补材料', '部分回款'];

function resolveTone(status, tone) {
  if (tone) return tone;
  if (dangerStatuses.includes(status)) return 'danger';
  if (successStatuses.includes(status)) return 'success';
  if (warningStatuses.includes(status)) return 'warning';
  return 'neutral';
}

export default function StatusBadge({ status, tone }) {
  const resolvedTone = resolveTone(status, tone);

  return <span className={`status-badge status-badge--${resolvedTone}`}>{status}</span>;
}
