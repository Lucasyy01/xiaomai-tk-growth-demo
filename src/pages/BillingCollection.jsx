import { useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { billingCollectionDetail } from '../data/mockData.js';

const dangerStatuses = ['已逾期', '扣款失败', '建议暂停'];
const warningStatuses = ['待支付', '部分回款', '摘要核销中', '待确认', '待生成'];
const successStatuses = ['已结清', '已绑定', '已授权'];

function resolveTone(status, tone) {
  if (tone) return tone;
  if (dangerStatuses.includes(status)) return 'danger';
  if (successStatuses.includes(status)) return 'success';
  if (warningStatuses.includes(status)) return 'warning';
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

function BillingDetailDrawer({ detail, onClose }) {
  if (!detail) return null;

  return (
    <div className="task-drawer-backdrop" onClick={onClose}>
      <aside className="task-drawer billing-drawer" aria-label="账单回款轻量详情" onClick={(event) => event.stopPropagation()}>
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

        {detail.nextStep ? (
          <div className="drawer-block drawer-block--next billing-drawer__priority">
            <span>下一步建议</span>
            <p>{detail.nextStep}</p>
          </div>
        ) : null}

        {detail.facts?.length ? (
          <dl className="task-drawer__meta billing-drawer__meta">
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
      </aside>
    </div>
  );
}

export default function BillingCollection({ page, onNavigate }) {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const { autoDebit, bills, collectionSummary, nextActions, project, risks, summaryCards } = billingCollectionDetail;

  const openSummaryDetail = (card) => {
    setSelectedDetail({
      eyebrow: '账单汇总',
      title: card.title,
      status: card.status,
      tone: card.tone,
      body: card.detail,
      statusMeta: card.meta,
    });
  };

  const openBillDetail = (bill) => {
    setSelectedDetail({
      eyebrow: '账单轻量详情',
      title: bill.id,
      status: bill.status,
      body: bill.detail,
      nextStep: bill.nextStep,
      facts: [
        { label: '所属项目', value: bill.project },
        { label: '账单类型', value: bill.type },
        { label: '应收金额', value: bill.amount },
        { label: '已收金额', value: bill.paid },
        { label: '待收金额', value: bill.pending },
        { label: '到期日', value: bill.dueDate },
      ],
    });
  };

  const openAutoDebitDetail = (type) => {
    const detailMap = {
      account: {
        eyebrow: '回款账户状态',
        title: autoDebit.accountStatus,
        status: autoDebit.accountStatus,
        body: autoDebit.accountDetail,
        nextStep: '保持账户校验有效；如状态变为已失效，需要先恢复绑定再进入自动扣款。',
        facts: [
          { label: '账户平台', value: autoDebit.platform },
          { label: '账户信息', value: autoDebit.accountMasked },
        ],
      },
      authorization: {
        eyebrow: '自动扣款授权状态',
        title: autoDebit.authorizationStatus,
        status: autoDebit.authorizationStatus,
        body: autoDebit.authorizationDetail,
        nextStep: '下次计划扣款前复核授权有效性，并提醒客户保持余额充足。',
        facts: [
          { label: '授权范围', value: '平台对客户应收' },
          { label: '下次计划扣款', value: autoDebit.nextPlan },
        ],
      },
      result: {
        eyebrow: '最近一次自动扣款结果',
        title: autoDebit.lastResult.status,
        status: autoDebit.lastResult.status,
        tone: 'danger',
        body: `${autoDebit.lastResult.time} 发起 ${autoDebit.lastResult.amount} 自动扣款，结果为失败。原因：${autoDebit.lastResult.reason}。`,
        nextStep: autoDebit.lastResult.suggestion,
        facts: [
          { label: '扣款金额', value: autoDebit.lastResult.amount },
          { label: '扣款时间', value: autoDebit.lastResult.time },
          { label: '失败原因', value: autoDebit.lastResult.reason },
        ],
      },
    };

    setSelectedDetail(detailMap[type]);
  };

  const openRiskDetail = (risk) => {
    setSelectedDetail({
      eyebrow: '风险处理建议',
      title: risk.title,
      status: risk.status,
      body: risk.description,
      nextStep: risk.handling,
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
    <section className="page billing-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status={page.status} />
        </div>
      </header>

      <article className="central-hero billing-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">资金闭环 / 平台应收</div>
            <StatusBadge status={project.status} />
          </div>
          <h2>{project.name}</h2>
          <p>{project.fundingJudgement}</p>
          <div className="billing-scope-note">{project.scopeNote}</div>
          <div className="hero-facts">
            <DetailMetric label="客户" value={project.clientName} />
            <DetailMetric label="负责人" value={project.owner} />
            <DetailMetric label="周期" value={project.cycle} />
            <DetailMetric label="下一次扣款" value={autoDebit.nextPlan} />
          </div>
        </div>

        <div className="workorder-hero__side billing-hero__side">
          <StatusBadge status={autoDebit.lastResult.status} tone="danger" />
          <strong>{autoDebit.lastResult.amount}</strong>
          <span>{autoDebit.blockingReason}</span>
          <div className="billing-hero__decision">
            <span>当前阻塞</span>
            <p>逾期未补款前，不建议新增放量预算。</p>
          </div>
          <button className="primary-action" type="button" onClick={() => openAutoDebitDetail('result')}>
            查看扣款结果
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four billing-summary-grid" aria-label="账单资金汇总">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            status={card.status}
            tone={resolveTone(card.status, card.tone)}
            meta={card.meta}
            isCentral={card.status === '已逾期'}
            onClick={() => openSummaryDetail(card)}
          />
        ))}
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="账单列表" title="按账单看应收和状态" action={<StatusBadge status="轻量详情" tone="accent" />} />
        <div className="billing-table" role="table" aria-label="账单列表">
          <div className="billing-row billing-row--head" role="row">
            <span>账单编号 / 项目</span>
            <span>账单类型</span>
            <span>应收金额</span>
            <span>到期日</span>
            <span>当前状态</span>
          </div>
          {bills.map((bill) => (
            <button
              key={bill.id}
              className={`billing-row billing-row--button${bill.status === '已逾期' ? ' billing-row--risk' : ''}`}
              type="button"
              role="row"
              onClick={() => openBillDetail(bill)}
            >
              <span className="billing-row__main">
                <strong>{bill.id}</strong>
                <small>{bill.project}</small>
              </span>
              <span>{bill.type}</span>
              <span className="billing-amount">{bill.amount}</span>
              <span>{bill.dueDate}</span>
              <span>
                <StatusBadge status={bill.status} tone={resolveTone(bill.status)} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="billing-two-column">
        <article className="workorder-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>回款与核销摘要</h3>
              <p>{collectionSummary.note}</p>
            </div>
            <StatusBadge status={collectionSummary.status} tone="warning" />
          </div>
          <div className="mini-metric-grid mini-metric-grid--four">
            <DetailMetric label="已回款金额" value={collectionSummary.receivedTotal} />
            <DetailMetric label="部分回款记录" value={collectionSummary.partialReceived} />
            <DetailMetric label="核销状态" value={collectionSummary.reconciliationStatus} />
            <DetailMetric label="最近回款时间" value={collectionSummary.lastReceivedAt} />
          </div>
          <div className="billing-record-list">
            {collectionSummary.records.map((record) => (
              <div className="billing-record-item" key={`${record.time}-${record.title}`}>
                <span>{record.time}</span>
                <div>
                  <strong>{record.title}</strong>
                  <small>{record.meta}</small>
                </div>
                <b>{record.amount}</b>
                <StatusBadge status={record.status} tone={resolveTone(record.status)} />
              </div>
            ))}
          </div>
        </article>

        <article className="workorder-panel billing-auto-debit">
          <div className="workorder-panel__header">
            <div>
              <h3>自动扣款设置</h3>
              <p>{autoDebit.scopeNote}</p>
            </div>
            <div className="billing-auto-debit__badges">
              <StatusBadge status="平台应收代扣" tone="accent" />
              <StatusBadge status={autoDebit.authorizationStatus} tone="success" />
            </div>
          </div>
          <div className="billing-status-grid">
            <button className="billing-status-card" type="button" onClick={() => openAutoDebitDetail('account')}>
              <span>小麦云回款账户</span>
              <strong>{autoDebit.platform}</strong>
              <StatusBadge status={autoDebit.accountStatus} tone="success" />
            </button>
            <button className="billing-status-card" type="button" onClick={() => openAutoDebitDetail('authorization')}>
              <span>项目应收授权</span>
              <strong>{autoDebit.authorizationStatus}</strong>
              <StatusBadge status={autoDebit.authorizationStatus} tone="success" />
            </button>
            <button className="billing-status-card billing-status-card--risk" type="button" onClick={() => openAutoDebitDetail('result')}>
              <span>项目应收扣款结果</span>
              <strong>{autoDebit.lastResult.status}</strong>
              <StatusBadge status={autoDebit.lastResult.status} tone="danger" />
            </button>
          </div>
          <div className="drawer-block drawer-block--next billing-inline-next">
            <span>阻塞原因</span>
            <p>{autoDebit.blockingReason}</p>
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="风险提醒" title="失败后如何处理" action={<StatusBadge status="需关注" tone="danger" />} />
        <div className="billing-risk-grid">
          {risks.map((risk) => (
            <button
              key={risk.title}
              className={`risk-item billing-risk-card${dangerStatuses.includes(risk.status) ? ' billing-risk-card--danger' : ''}`}
              type="button"
              onClick={() => openRiskDetail(risk)}
            >
              <div>
                <strong>{risk.title}</strong>
                <p>{risk.description}</p>
                <small>{risk.handling}</small>
              </div>
              <StatusBadge status={risk.status} tone={resolveTone(risk.status)} />
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作" title="让资金状态进入可处理状态" />
        <div className="action-grid">
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

      <BillingDetailDrawer detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </section>
  );
}
