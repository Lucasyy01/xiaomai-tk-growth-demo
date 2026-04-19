import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { creditApprovalDetail } from '../data/mockData.js';

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

function NextActionCard({ action, onNavigate }) {
  const canNavigate = Boolean(action.target);
  const Component = canNavigate ? 'button' : 'article';

  return (
    <Component
      className={`action-card${canNavigate ? ' action-card--clickable' : ''}`}
      type={canNavigate ? 'button' : undefined}
      onClick={canNavigate ? () => onNavigate(action.target) : undefined}
    >
      <div className="action-card__top">
        <div>
          <span>{action.title}</span>
          <strong>{action.owner}</strong>
        </div>
        <StatusBadge status={action.status} />
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
    </Component>
  );
}

export default function CreditApproval({ page, onNavigate }) {
  const { credit, customer, nextActions, parameters, riskNotes, summaryCards } = creditApprovalDetail;

  return (
    <section className="page credit-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status={credit.status} tone="success" />
          <StatusBadge status={page.status} />
        </div>
      </header>

      <article className="central-hero credit-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">业务授信 / 先投后付判断</div>
            <StatusBadge status={credit.riskLevel} tone="success" />
          </div>
          <h2>{customer.name}</h2>
          <p>{customer.entryReason}</p>
          <div className="credit-decision-strip">
            <div className="credit-decision-item credit-decision-item--strong">
              <span>当前审批结论</span>
              <strong>{credit.approvalConclusion}</strong>
            </div>
            <div className="credit-decision-item">
              <span>是否允许进入项目立项</span>
              <strong>{credit.allowProjectSetupText}</strong>
            </div>
            <div className="credit-decision-item">
              <span>是否需要补充材料</span>
              <strong>{credit.supplementText}</strong>
            </div>
          </div>
          <div className="hero-facts">
            <DetailMetric label="品类 / 市场" value={customer.categoryMarket} />
            <DetailMetric label="当前业务状态" value={customer.businessStatus} />
            <DetailMetric label="服务阶段" value={customer.serviceStage} />
            <DetailMetric label="负责人" value={customer.owner} />
          </div>
        </div>

        <div className="workorder-hero__side credit-hero__side">
          <StatusBadge status={credit.status} tone="success" />
          <strong>{credit.availableCredit}</strong>
          <span>可用额度足够支持本轮小预算测试，进入项目工单后继续跟进授权与回款。</span>
          <button className="primary-action" type="button" onClick={() => onNavigate('project-workorder')}>
            进入项目立项
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four credit-summary-grid" aria-label="授信额度核心信息">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <section className="credit-two-column">
        <article className="workorder-panel credit-usage-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>授信参数</h3>
              <p>{credit.parameterNote}</p>
            </div>
            <StatusBadge status="轻量配置" tone="accent" />
          </div>
          <div className="credit-usage-meter">
            <div className="credit-usage-meter__head">
              <span>额度使用</span>
              <strong>{credit.usagePercent}</strong>
            </div>
            <div className="quota-rail" style={{ '--usage': credit.usagePercent }}>
              <span />
            </div>
          </div>
          <div className="mini-metric-grid mini-metric-grid--four">
            {parameters.map((item) => (
              <DetailMetric key={item.label} {...item} />
            ))}
          </div>
        </article>

        <article className="workorder-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>客户经营摘要</h3>
              <p>只保留进入授信审批所需的业务背景，帮助判断为什么可以继续推进。</p>
            </div>
            <StatusBadge status={customer.businessStatus} tone="success" />
          </div>
          <div className="credit-readiness-list">
            {customer.readiness.map((item) => (
              <div className="credit-readiness-row" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.description}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="credit-conclusion-grid">
        <article className="workorder-panel credit-conclusion-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>审批结论</h3>
              <p>{credit.approvalOpinion}</p>
            </div>
            <StatusBadge status={credit.status} tone="success" />
          </div>
          <div className="credit-answer-grid">
            <div className="credit-answer-card">
              <span>是否允许进入项目立项</span>
              <strong>{credit.allowProjectSetup ? '允许' : '不允许'}</strong>
              <p>{credit.allowProjectSetupText}</p>
            </div>
            <div className="credit-answer-card">
              <span>是否需要补充材料</span>
              <strong>{credit.needSupplement ? '需要' : '不需要'}</strong>
              <p>{credit.supplementText}</p>
            </div>
          </div>
        </article>

        <article className="workorder-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>风险说明</h3>
              <p>聚焦业务推进风险，不展开复杂风控评分。</p>
            </div>
            <StatusBadge status={credit.riskLevel} tone="success" />
          </div>
          <div className="credit-risk-list">
            {riskNotes.map((risk) => (
              <div className="risk-item" key={risk.title}>
                <div>
                  <strong>{risk.title}</strong>
                  <p>{risk.description}</p>
                  <small>{risk.handling}</small>
                </div>
                <StatusBadge status={risk.status} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作" title="授信通过后怎么走" action={<StatusBadge status="不做真实审批流" tone="accent" />} />
        <div className="action-grid credit-action-grid">
          {nextActions.map((action) => (
            <NextActionCard key={action.title} action={action} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </section>
  );
}
