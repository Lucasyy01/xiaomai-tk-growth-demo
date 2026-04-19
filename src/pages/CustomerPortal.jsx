import { useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { customerPortalDetail } from '../data/mockData.js';

const dangerStatuses = ['已逾期', '扣款失败', '已超时'];
const successStatuses = ['已完成', '已授权', '已绑定', '已结清', '正常'];
const warningStatuses = ['待确认', '待授权', '待支付', '部分回款', '待补充', '需关注'];
const accentStatuses = ['执行中', '服务中'];

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

function CustomerPortalDrawer({ detail, onClose }) {
  if (!detail) return null;

  return (
    <div className="task-drawer-backdrop" onClick={onClose}>
      <aside className="task-drawer customer-portal-drawer" aria-label="客户门户轻量详情" onClick={(event) => event.stopPropagation()}>
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
          <dl className="task-drawer__meta customer-portal-drawer__meta">
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

export default function CustomerPortal({ page, onNavigate }) {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const { alerts, confirmations, customer, hero, nextSteps, payment, projects, readiness, summaryCards } = customerPortalDetail;

  const openSummaryDetail = (card) => {
    setSelectedDetail({
      eyebrow: '客户门户摘要',
      title: card.title,
      status: card.status,
      tone: card.tone,
      statusMeta: card.meta,
      body: card.detail,
      nextStep: card.nextStep,
    });
  };

  const openConfirmationDetail = (item) => {
    setSelectedDetail({
      eyebrow: `${item.category} / 待确认事项`,
      title: item.title,
      status: item.status,
      body: item.body,
      nextStep: item.nextStep,
      facts: [
        { label: '截止时间', value: item.due },
        ...item.facts,
      ],
    });
  };

  const openReadinessDetail = (item) => {
    setSelectedDetail({
      eyebrow: '店铺与广告授权准备',
      title: item.label,
      status: item.status,
      body: item.description,
      nextStep: item.nextStep,
      facts: [
        { label: '当前状态', value: item.value },
        { label: '阻塞影响', value: item.blocks },
      ],
    });
  };

  const openAccountDetail = (type) => {
    const detailMap = {
      account: {
        eyebrow: '回款账户状态',
        title: payment.account.platform,
        status: payment.account.accountStatus,
        body: payment.account.accountDetail,
        nextStep: '保持回款账户绑定有效；如状态失效，需要先恢复绑定再处理自动扣款。',
        facts: [
          { label: '账户平台', value: payment.account.platform },
          { label: '绑定状态', value: payment.account.accountStatus },
        ],
      },
      authorization: {
        eyebrow: '自动扣款授权状态',
        title: payment.account.authorizationStatus,
        status: payment.account.authorizationStatus,
        body: payment.account.authorizationDetail,
        nextStep: '下次计划扣款前，请保持授权有效并确认账户余额充足。',
        facts: [
          { label: '授权范围', value: '小麦云平台对客户项目应收' },
          { label: '扣费说明', value: '不是 TikTok 原生广告扣费' },
        ],
      },
      result: {
        eyebrow: '最近一次扣款结果',
        title: payment.account.lastResult,
        status: payment.account.lastResult,
        tone: 'danger',
        body: payment.account.blockingReason,
        nextStep: '请先确认补款时间或账户余额，再由平台跟进后续处理。',
        facts: [
          { label: '账户平台', value: payment.account.platform },
          { label: '账单影响', value: '逾期金额继续占用授信额度' },
        ],
      },
    };

    setSelectedDetail(detailMap[type]);
  };

  const openBillDetail = (bill) => {
    setSelectedDetail({
      eyebrow: '账单状态说明',
      title: bill.id,
      status: bill.status,
      body: bill.summary,
      nextStep: bill.status === '已逾期' ? '请确认补款时间；本页不会发起真实支付。' : '请保持授权和账户余额可用，等待计划扣款窗口。',
      facts: [
        { label: '账单类型', value: bill.type },
        { label: '金额', value: bill.amount },
        { label: '到期日', value: bill.due },
      ],
    });
  };

  const openAlertDetail = (alert) => {
    setSelectedDetail({
      eyebrow: '异常提醒与下一步',
      title: alert.title,
      status: alert.status,
      body: alert.description,
      nextStep: alert.suggestion,
    });
  };

  const handleNextStep = (step) => {
    if (step.target) {
      onNavigate(step.target);
      return;
    }

    setSelectedDetail({
      eyebrow: '下一步建议',
      title: step.title,
      status: step.status,
      body: step.description,
      nextStep: step.detail,
      facts: [
        { label: '建议处理人', value: step.owner },
        { label: '建议时间', value: step.due },
      ],
    });
  };

  return (
    <section className="page customer-portal-page">
      <header className="page-header customer-portal-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status="客户视角" tone="accent" />
          <StatusBadge status={customer.status} tone="warning" />
        </div>
      </header>

      <article className="central-hero customer-portal-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">{hero.label}</div>
            <StatusBadge status={hero.mainNextAction.status} tone="warning" />
          </div>
          <h2>{hero.headline}</h2>
          <p>{hero.description}</p>
          <div className="customer-portal-scope-note">{hero.trustNote}</div>
          <div className="hero-facts">
            {hero.metrics.map((metric) => (
              <DetailMetric key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        <div className="workorder-hero__side customer-portal-hero__side">
          <StatusBadge status={hero.mainNextAction.status} tone="warning" />
          <strong>{hero.mainNextAction.title}</strong>
          <span>{hero.mainNextAction.description}</span>
          <button
            className="primary-action"
            type="button"
            onClick={() =>
              setSelectedDetail({
                eyebrow: '当前最建议动作',
                title: hero.mainNextAction.title,
                status: hero.mainNextAction.status,
                body: hero.mainNextAction.description,
                nextStep: hero.mainNextAction.nextStep,
              })
            }
          >
            查看下一步
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four customer-portal-summary-grid" aria-label="客户门户摘要">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            status={card.status}
            tone={resolveTone(card.status, card.tone)}
            meta={card.meta}
            isCentral={card.status === '部分回款'}
            onClick={() => openSummaryDetail(card)}
          />
        ))}
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="我的项目" title="当前项目进度一眼看清" action={<StatusBadge status="客户可见摘要" tone="accent" />} />
        <div className="customer-project-grid">
          {projects.map((project) => {
            const currentStageIndex = project.stages.findIndex((stage) => stage === project.stage);

            return (
              <button key={project.id} className="customer-project-card" type="button" onClick={() => onNavigate(project.target)}>
                <div className="customer-project-card__header">
                  <div>
                    <span>{project.type}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <StatusBadge status={project.status} tone={resolveTone(project.status)} />
                </div>

                <p>{project.resultSummary}</p>

                <div className="customer-stage-mini" aria-label={`${project.name} 当前阶段`}>
                  {project.stages.map((stage, index) => (
                    <span
                      key={stage}
                      className={`customer-stage-mini__step${index < currentStageIndex ? ' customer-stage-mini__step--past' : ''}${
                        index === currentStageIndex ? ' customer-stage-mini__step--active' : ''
                      }`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>

                <div className="mini-metric-grid mini-metric-grid--three">
                  {project.facts.map((fact) => (
                    <DetailMetric key={fact.label} {...fact} />
                  ))}
                </div>

                <div className="customer-project-card__next">
                  <span>当前建议动作</span>
                  <p>{project.recommendedAction}</p>
                  <strong>{project.currentFocus}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="customer-portal-two-column">
        <article className="workorder-panel customer-confirm-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>待我确认内容</h3>
              <p>这里只展示轻量确认事项，不做真实提交、不做复杂审核。</p>
            </div>
            <StatusBadge status={`${confirmations.length} 项`} tone="warning" />
          </div>
          <div className="customer-confirm-list">
            {confirmations.map((item) => (
              <button
                key={item.id}
                className={`customer-confirm-item${dangerStatuses.includes(item.status) ? ' customer-confirm-item--risk' : ''}`}
                type="button"
                onClick={() => openConfirmationDetail(item)}
              >
                <div>
                  <span>{item.category} / 截止 {item.due}</span>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
                <div className="customer-confirm-item__action">
                  <StatusBadge status={item.status} tone={resolveTone(item.status)} />
                  <b>{item.actionLabel}</b>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="workorder-panel customer-readiness-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>店铺与广告授权准备</h3>
              <p>{readiness.note}</p>
            </div>
            <StatusBadge status={readiness.status} tone="warning" />
          </div>
          <div className="customer-status-grid">
            {readiness.items.map((item) => (
              <button key={item.id} className="billing-status-card customer-status-card" type="button" onClick={() => openReadinessDetail(item)}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <StatusBadge status={item.status} tone={resolveTone(item.status)} />
                <small>{item.blocks}</small>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="customer-portal-two-column customer-portal-two-column--payment">
        <article className="workorder-panel customer-payment-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>回款账户与自动扣款状态</h3>
              <p>{payment.scopeNote}</p>
            </div>
            <StatusBadge status={payment.account.authorizationStatus} tone="success" />
          </div>
          <div className="billing-status-grid customer-account-grid">
            <button className="billing-status-card customer-status-card" type="button" onClick={() => openAccountDetail('account')}>
              <span>回款账户平台</span>
              <strong>{payment.account.platform}</strong>
              <StatusBadge status={payment.account.accountStatus} tone="success" />
            </button>
            <button className="billing-status-card customer-status-card" type="button" onClick={() => openAccountDetail('authorization')}>
              <span>自动扣款授权</span>
              <strong>{payment.account.authorizationStatus}</strong>
              <StatusBadge status={payment.account.authorizationStatus} tone="success" />
            </button>
            <button className="billing-status-card billing-status-card--risk customer-status-card" type="button" onClick={() => openAccountDetail('result')}>
              <span>最近一次扣款结果</span>
              <strong>{payment.account.lastResult}</strong>
              <StatusBadge status={payment.account.lastResult} tone="danger" />
            </button>
          </div>
          <div className="drawer-block drawer-block--next customer-inline-next">
            <span>当前阻塞原因</span>
            <p>{payment.account.blockingReason}</p>
          </div>
        </article>

        <article className="workorder-panel customer-billing-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>账单与支付状态</h3>
              <p>只展示待支付、已支付和逾期状态，不提供真实支付动作。</p>
            </div>
            <StatusBadge status={payment.status} tone="warning" />
          </div>
          <div className="mini-metric-grid mini-metric-grid--four">
            {payment.metrics.map((metric) => (
              <DetailMetric key={metric.label} {...metric} />
            ))}
          </div>
          <div className="customer-bill-list">
            {payment.bills.map((bill) => (
              <button
                key={bill.id}
                className={`customer-bill-row${bill.status === '已逾期' ? ' customer-bill-row--risk' : ''}`}
                type="button"
                onClick={() => openBillDetail(bill)}
              >
                <span>
                  <strong>{bill.type}</strong>
                  <small>{bill.id} / 到期 {bill.due}</small>
                </span>
                <b>{bill.amount}</b>
                <StatusBadge status={bill.status} tone={resolveTone(bill.status)} />
              </button>
            ))}
          </div>
          <button className="primary-action customer-billing-action" type="button" onClick={() => onNavigate('billing-collection')}>
            查看账单详情
          </button>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="异常提醒" title="现在需要留意的风险" action={<StatusBadge status="有下一步建议" tone="accent" />} />
        <div className="customer-alert-grid">
          {alerts.map((alert) => (
            <button
              key={alert.title}
              className={`risk-item billing-risk-card customer-alert-card${dangerStatuses.includes(alert.status) ? ' billing-risk-card--danger' : ''}`}
              type="button"
              onClick={() => openAlertDetail(alert)}
            >
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.description}</p>
                <small>{alert.suggestion}</small>
              </div>
              <StatusBadge status={alert.status} tone={resolveTone(alert.status)} />
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步建议" title="客户侧可以怎么配合" />
        <div className="action-grid customer-next-grid">
          {nextSteps.map((step) => (
            <button key={step.title} className="action-card action-card--clickable customer-next-card" type="button" onClick={() => handleNextStep(step)}>
              <div className="action-card__top">
                <div>
                  <span>{step.title}</span>
                  <strong>{step.owner}</strong>
                </div>
                <StatusBadge status={step.status} tone={resolveTone(step.status)} />
              </div>
              <p>{step.description}</p>
              <div className="action-card__next">
                <span>说明</span>
                <p>{step.detail}</p>
              </div>
              <div className="action-card__footer">
                <span>{step.due}</span>
                <strong>{step.target ? '跳转查看' : '查看说明'}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <article className="customer-service-note">
        <div>
          <span>服务支持</span>
          <strong>{customer.serviceOwner}</strong>
        </div>
        <p>{customer.welcome}</p>
        <StatusBadge status={customer.serviceWindow} tone="accent" />
      </article>

      <CustomerPortalDrawer detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </section>
  );
}
