import PageScaffold from '../components/PageScaffold.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const checks = [
  ['店铺准备', '已通过'],
  ['广告资产接入', '检查中'],
  ['广告授权准备', '待补资料'],
  ['归因准备', '已通过'],
];

export default function LaunchChecklist({ page }) {
  return (
    <PageScaffold page={page}>
      <article className="placeholder-table">
        {checks.map(([label, status]) => (
          <div key={label} className="placeholder-row">
            <span>{label}</span>
            <StatusBadge status={status} />
          </div>
        ))}
      </article>
    </PageScaffold>
  );
}
