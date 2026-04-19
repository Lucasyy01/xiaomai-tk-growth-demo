import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { assetSummary, creatorAssetsDetail, creatorSummary } from '../data/mockData.js';

const dangerStatuses = ['不建议复投', '已失效', '已超时', '已阻塞'];
const warningStatuses = ['待授权', '待交付', '待寄样', '待测试', '待审核', '待筛选', '已触达', '已回复', '洽谈中'];
const successStatuses = ['已通过', '已授权', '测试通过', '放量中', '已确认', '已完成'];
const accentStatuses = ['执行中', '全部'];

function resolveTone(status, tone) {
  if (tone) return tone;
  if (dangerStatuses.includes(status)) return 'danger';
  if (successStatuses.includes(status)) return 'success';
  if (warningStatuses.includes(status)) return 'warning';
  if (accentStatuses.includes(status)) return 'accent';
  return undefined;
}

function DetailMetric({ label, value }) {
  return (
    <div className="detail-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function CreatorAssetDrawer({ detail, onClose }) {
  if (!detail) return null;

  return (
    <div className="task-drawer-backdrop" onClick={onClose}>
      <aside className="task-drawer creator-assets-drawer" aria-label="达人与素材轻量详情" onClick={(event) => event.stopPropagation()}>
        <div className="task-drawer__header">
          <div>
            <span>{detail.eyebrow}</span>
            <h3>{detail.title}</h3>
          </div>
          <button className="icon-button" type="button" aria-label="关闭详情" onClick={onClose}>
            ×
          </button>
        </div>

        {detail.status ? (
          <div className="task-drawer__status">
            <StatusBadge status={detail.status} tone={resolveTone(detail.status, detail.tone)} />
            {detail.statusMeta ? <span>{detail.statusMeta}</span> : null}
          </div>
        ) : null}

        {detail.facts?.length ? (
          <dl className="task-drawer__meta creator-assets-drawer__meta">
            {detail.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="drawer-block">
          <span>当前说明</span>
          <p>{detail.body}</p>
        </div>

        {detail.nextStep ? (
          <div className="drawer-block drawer-block--next">
            <span>下一步建议</span>
            <p>{detail.nextStep}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export default function CreatorAssets({ page, onNavigate }) {
  const [activeCreatorStatus, setActiveCreatorStatus] = useState('全部');
  const [activeAssetStatus, setActiveAssetStatus] = useState('全部');
  const [selectedDetail, setSelectedDetail] = useState(null);

  const { assetLadder, assetLayers, assets, creatorFunnel, creators, nextActions, project } = creatorAssetsDetail;

  const filteredCreators = useMemo(() => {
    if (activeCreatorStatus === '全部') return creators;
    return creators.filter((creator) => creator.status === activeCreatorStatus);
  }, [activeCreatorStatus, creators]);

  const filteredAssets = useMemo(() => {
    if (activeAssetStatus === '全部') return assets;
    return assets.filter((asset) => asset.status === activeAssetStatus);
  }, [activeAssetStatus, assets]);

  const openCreatorDetail = (creator) => {
    setSelectedDetail({
      eyebrow: '达人合作单 / 轻量详情',
      title: creator.name,
      status: creator.status,
      body: creator.detail,
      nextStep: creator.nextStep,
      facts: [
        { label: '国家 / 垂类', value: `${creator.country} / ${creator.category}` },
        { label: '报价', value: creator.quote },
        { label: '授权意愿', value: creator.authorizationIntent },
        { label: '当前阻塞', value: creator.blocker },
        { label: '内容角度', value: creator.contentAngle },
        { label: '最近更新', value: creator.recentUpdate },
      ],
    });
  };

  const openAssetDetail = (asset) => {
    setSelectedDetail({
      eyebrow: '素材资产 / 轻量详情',
      title: asset.name,
      status: asset.status,
      body: asset.detail,
      nextStep: asset.nextStep,
      facts: [
        { label: '关联达人', value: asset.creator },
        { label: '授权状态', value: asset.authorizationStatus },
        { label: '测试状态', value: asset.testStatus },
        { label: '放量状态', value: asset.scaleStatus },
        { label: '阻塞项', value: asset.blocker },
      ],
    });
  };

  const openMetricDetail = (type) => {
    if (type === 'creator') {
      setActiveCreatorStatus('全部');
      setSelectedDetail({
        eyebrow: '达人合作漏斗',
        title: '达人合作不是复杂建联系统',
        status: creatorSummary.status,
        body: creatorSummary.nextAction,
        nextStep: '通过漏斗看当前卡在哪一步，再进入对应合作单轻量详情。',
        facts: creatorSummary.metrics,
      });
      return;
    }

    setActiveAssetStatus('全部');
    setSelectedDetail({
      eyebrow: '素材状态分层',
      title: '已通过 ≠ 已授权 ≠ 可放量',
      status: assetSummary.status,
      body: assetSummary.conversionNote,
      nextStep: '先把已通过但未授权的素材推进到已授权，再进入小预算测试。',
      facts: assetSummary.metrics,
    });
  };

  const handleNextAction = (action) => {
    if (action.target && onNavigate) {
      onNavigate(action.target);
      return;
    }

    if (action.filterType === 'asset') {
      setActiveAssetStatus(action.filter);
      setSelectedDetail({
        eyebrow: '下一步动作',
        title: action.title,
        status: action.status,
        body: action.description,
        nextStep: action.detail,
        facts: [
          { label: '负责人', value: action.owner },
          { label: '建议时间', value: action.due },
          { label: '当前筛选', value: action.filter },
        ],
      });
      return;
    }

    if (action.filterType === 'creator') {
      setActiveCreatorStatus(action.filter);
      setSelectedDetail({
        eyebrow: '下一步动作',
        title: action.title,
        status: action.status,
        body: action.description,
        nextStep: action.detail,
        facts: [
          { label: '负责人', value: action.owner },
          { label: '建议时间', value: action.due },
          { label: '当前筛选', value: action.filter },
        ],
      });
    }
  };

  return (
    <section className="page creator-assets-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status={project.status} tone="warning" />
        </div>
      </header>

      <article className="central-hero creator-assets-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">TikTok 内容供给 / 达人合作与素材资产</div>
            <StatusBadge status={project.status} tone="warning" />
          </div>
          <h2>{project.name}</h2>
          <p>{project.focus}</p>
          <div className="creator-assets-note">{project.businessNote}</div>
          <div className="hero-facts">
            {project.facts.map((fact) => (
              <DetailMetric key={fact.label} {...fact} />
            ))}
          </div>
        </div>

        <div className="workorder-hero__side creator-assets-hero__side">
          <StatusBadge status={project.primaryAction.status} tone="warning" />
          <strong>{project.primaryAction.title}</strong>
          <span>{project.primaryAction.description}</span>
          <button
            className="primary-action"
            type="button"
            onClick={() =>
              setSelectedDetail({
                eyebrow: '当前最关键动作',
                title: project.primaryAction.title,
                status: project.primaryAction.status,
                body: project.primaryAction.description,
                nextStep: project.primaryAction.nextStep,
              })
            }
          >
            查看授权卡点
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--two creator-assets-top-summary" aria-label="页面核心摘要">
        <SummaryCard
          title="达人合作漏斗"
          value={`${creators.length} 个合作单`}
          status={creatorSummary.status}
          meta={creatorSummary.nextAction}
          onClick={() => openMetricDetail('creator')}
        />
        <SummaryCard
          title="素材资产分层"
          value={`${assets.length} 条素材`}
          status={assetSummary.status}
          meta="已通过 ≠ 已授权 ≠ 可放量，必须逐层判断。"
          isCentral
          onClick={() => openMetricDetail('asset')}
        />
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="达人合作漏斗"
          title="合作推进到哪一步"
          action={<StatusBadge status={`当前筛选：${activeCreatorStatus}`} tone={activeCreatorStatus === '全部' ? 'accent' : 'warning'} />}
        />
        <div className="creator-funnel-grid">
          {creatorFunnel.map((item) => {
            const isActive = activeCreatorStatus === item.status;

            return (
              <button
                key={item.label}
                className={`creator-funnel-card${isActive ? ' creator-funnel-card--active' : ''}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCreatorStatus(item.status)}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <StatusBadge status={item.status} tone={resolveTone(item.status)} />
                <p>{item.description}</p>
              </button>
            );
          })}
        </div>

        <div className="creator-list-toolbar">
          <button className="text-action" type="button" onClick={() => setActiveCreatorStatus('全部')}>
            查看全部达人
          </button>
          <span>{filteredCreators.length} 个合作单正在展示</span>
        </div>

        <div className="creator-collab-grid">
          {filteredCreators.map((creator) => (
            <button
              key={creator.id}
              className={`creator-collab-card${['待授权', '待交付'].includes(creator.status) ? ' creator-collab-card--risk' : ''}`}
              type="button"
              onClick={() => openCreatorDetail(creator)}
            >
              <div className="creator-collab-card__header">
                <div>
                  <span>
                    {creator.country} / {creator.category}
                  </span>
                  <h3>{creator.name}</h3>
                </div>
                <StatusBadge status={creator.status} tone={resolveTone(creator.status)} />
              </div>
              <div className="creator-collab-card__meta">
                <DetailMetric label="报价" value={creator.quote} />
                <DetailMetric label="授权意愿" value={creator.authorizationIntent} />
                <DetailMetric label="当前阻塞项" value={creator.blocker} />
              </div>
              <p>{creator.nextStep}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="素材资产分层"
          title="从交付物到可投资产"
          action={<StatusBadge status={`当前筛选：${activeAssetStatus}`} tone={activeAssetStatus === '全部' ? 'accent' : resolveTone(activeAssetStatus)} />}
        />
        <article className="creator-assets-ladder">
          {assetLadder.map((step, index) => (
            <div className="creator-assets-ladder__step" key={step.label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
              <p>{step.description}</p>
              <small>{step.warning}</small>
              <StatusBadge status={step.status} tone={resolveTone(step.status)} />
            </div>
          ))}
        </article>

        <div className="asset-layer-grid">
          {assetLayers.map((layer) => {
            const isActive = activeAssetStatus === layer.filter;

            return (
              <button
                key={layer.label}
                className={`asset-layer-card${isActive ? ' asset-layer-card--active' : ''}${layer.status === '不建议复投' ? ' asset-layer-card--danger' : ''}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveAssetStatus(layer.filter)}
              >
                <span>{layer.label}</span>
                <strong>{layer.value}</strong>
                <StatusBadge status={layer.status} tone={resolveTone(layer.status)} />
                <p>{layer.description}</p>
              </button>
            );
          })}
        </div>

        <div className="creator-list-toolbar">
          <button className="text-action" type="button" onClick={() => setActiveAssetStatus('全部')}>
            查看全部素材
          </button>
          <span>{filteredAssets.length} 条素材正在展示</span>
        </div>

        <div className="asset-card-grid">
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              className={`asset-card${['已通过', '不建议复投'].includes(asset.status) ? ' asset-card--attention' : ''}`}
              type="button"
              onClick={() => openAssetDetail(asset)}
            >
              <div className="asset-card__header">
                <div>
                  <span>{asset.id} / {asset.creator}</span>
                  <h3>{asset.name}</h3>
                </div>
                <StatusBadge status={asset.status} tone={resolveTone(asset.status)} />
              </div>
              <div className="asset-card__states">
                <DetailMetric label="授权状态" value={asset.authorizationStatus} />
                <DetailMetric label="测试状态" value={asset.testStatus} />
                <DetailMetric label="放量状态" value={asset.scaleStatus} />
              </div>
              <div className="asset-card__next">
                <span>建议动作</span>
                <p>{asset.suggestedAction}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作" title="保持页面轻量，只推进关键业务判断" />
        <div className="action-grid">
          {nextActions.map((action) => (
            <button key={action.title} className="action-card action-card--clickable" type="button" onClick={() => handleNextAction(action)}>
              <div className="action-card__top">
                <div>
                  <span>{action.title}</span>
                  <strong>{action.owner}</strong>
                </div>
                <StatusBadge status={action.status} tone={resolveTone(action.status)} />
              </div>
              <p>{action.description}</p>
              <div className="action-card__next">
                <span>动作说明</span>
                <p>{action.detail}</p>
              </div>
              <div className="action-card__footer">
                <span>{action.due}</span>
                <strong>{action.actionLabel}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <CreatorAssetDrawer detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </section>
  );
}
