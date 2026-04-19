import { useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { paymentAuthorizationDetail } from '../data/mockData.js';

const dangerStatuses = ['已失效', '授权失效', '已阻塞', '扣款失败'];
const warningStatuses = ['未绑定', '待校验', '未授权', '授权中', '需明确', '待复核'];
const successStatuses = ['已绑定', '已授权', '无硬阻塞', '可进入授信', '可推进'];
const accentStatuses = ['账户授权', '轻量详情'];

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

function PaymentDetailDrawer({ detail, onClose }) {
  if (!detail) return null;

  return (
    <div className="task-drawer-backdrop" onClick={onClose}>
      <aside className="task-drawer payment-drawer" aria-label="回款账户与扣款授权轻量详情" onClick={(event) => event.stopPropagation()}>
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
          <dl className="task-drawer__meta payment-drawer__meta">
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

export default function PaymentAuthorization({ page, onNavigate }) {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const { account, authorization, blockerCards, decision, nextActions, project, readinessChecks, statusCards, timeline } = paymentAuthorizationDetail;

  const openSummaryDetail = (card) => {
    setSelectedDetail({
      eyebrow: '状态摘要',
      title: card.title,
      status: card.status,
      tone: card.tone,
      statusMeta: card.meta,
      body: card.detail,
      nextStep: card.nextStep,
    });
  };

  const openAccountDetail = () => {
    setSelectedDetail({
      eyebrow: '回款账户绑定记录',
      title: account.platform,
      status: account.bindingStatus,
      body: account.detail,
      nextStep: account.nextStep,
      facts: [
        { label: '平台类型', value: account.platformType },
        { label: '账户标识摘要', value: account.accountMasked },
        { label: '最近校验结果', value: account.lastValidation },
        { label: '当前阻塞', value: account.blockingReason },
      ],
    });
  };

  const openAuthorizationDetail = () => {
    setSelectedDetail({
      eyebrow: '自动扣款授权记录',
      title: authorization.authorizationStatus,
      status: authorization.authorizationStatus,
      body: authorization.detail,
      nextStep: authorization.nextStep,
      facts: [
        { label: '授权范围', value: authorization.scope },
        { label: '最近授权结果', value: authorization.lastResult },
        { label: '扣费边界', value: authorization.notTikTokNote },
        { label: '当前阻塞', value: authorization.blockingReason },
      ],
    });
  };

  const openDecisionDetail = () => {
    setSelectedDetail({
      eyebrow: '继续推进判断',
      title: decision.allowText,
      status: decision.status,
      body: decision.reason,
      nextStep: decision.nextStep,
      facts: [
        { label: '是否允许进入授信审批', value: decision.allowCreditApproval ? '允许' : '暂不允许' },
        { label: '当前硬阻塞', value: decision.blockingReason },
        { label: '本页边界', value: decision.scopeNote },
      ],
    });
  };

  const openReadinessDetail = (item) => {
    setSelectedDetail({
      eyebrow: '前置条件检查',
      title: item.label,
      status: item.status,
      body: item.description,
      nextStep: item.nextStep,
      facts: [
        { label: '当前值', value: item.value },
        { label: '阻塞影响', value: item.blocks },
      ],
    });
  };

  const openBlockerDetail = (item) => {
    setSelectedDetail({
      eyebrow: '阻塞原因判断',
      title: item.title,
      status: item.status,
      tone: item.tone,
      body: item.description,
      nextStep: item.handling,
    });
  };

  const handleActionClick = (action) => {
    if (action.target) {
      onNavigate(action.target);
      return;
    }

    setSelectedDetail({
      eyebrow: '下一步动作',
      title: action.title,
      status: action.status,
      body: action.description,
      nextStep: action.detail,
      facts: [
        { label: '负责人', value: action.owner },
        { label: '时间要求', value: action.due },
      ],
    });
  };

  return (
    <section className="page payment-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status={decision.status} tone={resolveTone(decision.status)} />
        </div>
      </header>

      <article className="central-hero payment-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">账户授权 / 回款准备</div>
            <StatusBadge status={project.overallStatus} tone="success" />
          </div>
          <h2>{project.clientName} 回款路径已准备</h2>
          <p>{project.summary}</p>
          <div className="payment-scope-note">{project.scopeNote}</div>
          <div className="hero-facts">
            <DetailMetric label="客户" value={project.clientName} />
            <DetailMetric label="账户平台" value={account.platform} />
            <DetailMetric label="账户标识" value={account.accountMasked} />
            <DetailMetric label="最近校验" value={account.lastValidationShort} />
          </div>
        </div>

        <div className="workorder-hero__side payment-hero__side">
          <StatusBadge status={decision.status} tone="success" />
          <strong>{decision.allowText}</strong>
          <span>{decision.reason}</span>
          <div className="payment-hero__decision">
            <span>当前硬阻塞</span>
            <p>{decision.blockingReason}</p>
          </div>
          <button className="primary-action" type="button" onClick={openDecisionDetail}>
            查看推进判断
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four payment-summary-grid" aria-label="账户授权状态摘要">
        {statusCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            status={card.status}
            tone={resolveTone(card.status, card.tone)}
            meta={card.meta}
            isCentral={card.isCentral}
            onClick={() => openSummaryDetail(card)}
          />
        ))}
      </section>

      <section className="payment-two-column">
        <article className="workorder-panel payment-status-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>回款账户绑定状态</h3>
              <p>{account.description}</p>
            </div>
            <StatusBadge status={account.bindingStatus} tone="success" />
          </div>
          <div className="payment-status-flow" aria-label="回款账户绑定状态流">
            {account.flow.map((step) => (
              <button
                key={step.label}
                className={`payment-flow-step${step.active ? ' payment-flow-step--active' : ''}`}
                type="button"
                onClick={openAccountDetail}
              >
                <span>{step.label}</span>
                <strong>{step.description}</strong>
              </button>
            ))}
          </div>
          <div className="mini-metric-grid mini-metric-grid--four">
            <DetailMetric label="平台类型" value={account.platformType} />
            <DetailMetric label="账户标识摘要" value={account.accountMasked} />
            <DetailMetric label="最近校验结果" value={account.lastValidationShort} />
            <DetailMetric label="绑定阻塞" value={account.blockingReason} />
          </div>
          <div className="drawer-block drawer-block--next">
            <span>下一步</span>
            <p>{account.nextStep}</p>
          </div>
        </article>

        <article className="workorder-panel payment-status-panel payment-status-panel--authorization">
          <div className="workorder-panel__header">
            <div>
              <h3>自动扣款授权状态</h3>
              <p>{authorization.description}</p>
            </div>
            <StatusBadge status={authorization.authorizationStatus} tone="success" />
          </div>
          <div className="payment-status-flow" aria-label="自动扣款授权状态流">
            {authorization.flow.map((step) => (
              <button
                key={step.label}
                className={`payment-flow-step${step.active ? ' payment-flow-step--active' : ''}`}
                type="button"
                onClick={openAuthorizationDetail}
              >
                <span>{step.label}</span>
                <strong>{step.description}</strong>
              </button>
            ))}
          </div>
          <div className="mini-metric-grid mini-metric-grid--four">
            <DetailMetric label="授权范围" value={authorization.scope} />
            <DetailMetric label="最近授权结果" value={authorization.lastResultShort} />
            <DetailMetric label="扣费边界" value="非 TikTok 原生扣费" />
            <DetailMetric label="授权阻塞" value={authorization.blockingReason} />
          </div>
          <div className="drawer-block drawer-block--next">
            <span>说明</span>
            <p>{authorization.notTikTokNote}</p>
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="继续推进判断" title="授信审批前置条件是否满足" action={<StatusBadge status={decision.status} tone="success" />} />
        <div className="payment-check-grid">
          {readinessChecks.map((item) => (
            <button key={item.id} className="billing-status-card payment-check-card" type="button" onClick={() => openReadinessDetail(item)}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <StatusBadge status={item.status} tone={resolveTone(item.status)} />
              <small>{item.blocks}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="当前阻塞原因" title="绑定、授权与推进边界" action={<StatusBadge status={decision.blockingReason} tone="success" />} />
        <div className="payment-blocker-grid">
          {blockerCards.map((item) => (
            <button key={item.title} className="risk-item payment-blocker-card" type="button" onClick={() => openBlockerDetail(item)}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <small>{item.handling}</small>
              </div>
              <StatusBadge status={item.status} tone={resolveTone(item.status, item.tone)} />
            </button>
          ))}
        </div>
      </section>

      <section className="payment-two-column payment-two-column--bottom">
        <article className="workorder-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>最近账户与授权记录</h3>
              <p>只展示轻量状态记录，不发起真实绑定、真实授权或扣款动作。</p>
            </div>
            <StatusBadge status="轻量详情" tone="accent" />
          </div>
          <div className="event-list">
            {timeline.map((item) => (
              <div className="event-item" key={`${item.time}-${item.title}`}>
                <span>{item.time}</span>
                <p>{item.title}</p>
                <StatusBadge status={item.status} tone={resolveTone(item.status, item.tone)} />
              </div>
            ))}
          </div>
        </article>

        <article className="workorder-panel payment-decision-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>能否继续推进</h3>
              <p>{decision.reason}</p>
            </div>
            <StatusBadge status={decision.status} tone="success" />
          </div>
          <div className="payment-decision-result">
            <span>结论</span>
            <strong>{decision.allowText}</strong>
            <p>{decision.nextStep}</p>
          </div>
          <div className="payment-scope-note">{decision.scopeNote}</div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作" title="只提供跳转和查看入口" />
        <div className="action-grid payment-next-grid">
          {nextActions.map((action) => (
            <button key={action.title} className="action-card action-card--clickable" type="button" onClick={() => handleActionClick(action)}>
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

      <PaymentDetailDrawer detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </section>
  );
}
