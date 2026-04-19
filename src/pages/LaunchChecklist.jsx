import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { launchChecklistDetail } from '../data/mockData.js';

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

function resolveTone(status, tone) {
  if (tone) return tone;
  if (['已通过', '已完成', '可推进'].includes(status)) return 'success';
  if (['待检查', '检查中', '待补资料', '待确认'].includes(status)) return 'warning';
  if (['已阻塞', '已驳回', '不允许下一步'].includes(status)) return 'danger';
  return undefined;
}

function ActionCard({ action, onOpen }) {
  return (
    <button
      className={`action-card action-card--clickable launch-action-card${action.disabled ? ' launch-action-card--disabled' : ''}`}
      type="button"
      aria-disabled={action.disabled ? 'true' : undefined}
      onClick={() => onOpen(action)}
    >
      <div className="action-card__top">
        <div>
          <span>{action.title}</span>
          <strong>{action.owner}</strong>
        </div>
        <StatusBadge status={action.status} tone={resolveTone(action.status)} />
      </div>
      <p>{action.description}</p>
      <div className="action-card__next">
        <span>动作边界</span>
        <p>{action.detail}</p>
      </div>
      <div className="action-card__footer">
        <span>{action.due}</span>
        <strong>{action.actionLabel}</strong>
      </div>
    </button>
  );
}

export default function LaunchChecklist({ page, onNavigate }) {
  const { blockers, checks, conclusion, customer, nextActions, statusLegend, summaryCards } = launchChecklistDetail;
  const [selectedCheckId, setSelectedCheckId] = useState(blockers[0]?.checkId || checks[0].id);
  const [selectedAction, setSelectedAction] = useState(null);

  const completedChecks = useMemo(() => checks.filter((check) => check.completed), [checks]);
  const incompleteChecks = useMemo(() => checks.filter((check) => !check.completed), [checks]);
  const blockingChecks = useMemo(() => checks.filter((check) => check.blocksLaunch), [checks]);
  const selectedCheck = checks.find((check) => check.id === selectedCheckId) || checks[0];

  const openAction = (action) => {
    if (action.disabled) {
      setSelectedAction(action);
      return;
    }

    if (action.target && onNavigate) {
      onNavigate(action.target);
      return;
    }

    setSelectedAction(action);
  };

  const selectCheck = (checkId) => {
    setSelectedCheckId(checkId);
    setSelectedAction(null);
  };

  return (
    <section className="page launch-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status="项目启动清单" tone="accent" />
          <StatusBadge status={conclusion.status} tone={resolveTone(conclusion.status)} />
          <StatusBadge status={conclusion.allowNextStep ? '允许下一步' : '不允许下一步'} tone={conclusion.allowNextStep ? 'success' : 'danger'} />
        </div>
      </header>

      <article className="central-hero launch-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">客户启动前置检查</div>
            <StatusBadge status={customer.source} tone="accent" />
          </div>
          <h2>{customer.name}</h2>
          <p>{conclusion.summary}</p>
          <div className="launch-scope-note">本页只承接项目启动前的业务清单判断，不做真实提交、复杂表单或工单流转。</div>
          <div className="hero-facts">
            <DetailMetric label="品类 / 市场" value={customer.categoryMarket} />
            <DetailMetric label="目标启动日" value={customer.requestedStart} />
            <DetailMetric label="服务目标" value={customer.serviceGoal} />
            <DetailMetric label="负责人" value={customer.owner} />
          </div>
        </div>

        <div className="workorder-hero__side launch-hero__side">
          <StatusBadge status={conclusion.allowNextStepText} tone={conclusion.allowNextStep ? 'success' : 'danger'} />
          <strong>{conclusion.allowNextStep ? '允许继续' : '不能继续'}</strong>
          <span>{conclusion.riskTip}</span>
          <div className="drawer-block drawer-block--next launch-hero__next">
            <span>建议动作</span>
            <p>{conclusion.nextStepLabel}</p>
          </div>
        </div>
      </article>

      <section className="section-grid section-grid--four launch-summary-grid" aria-label="启动前检查摘要">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="状态含义"
          title="检查结论只保留启动所需的五类状态"
          action={<StatusBadge status={`${conclusion.completedCount}/${conclusion.totalCount} 已完成`} tone="accent" />}
        />
        <div className="launch-status-strip">
          {statusLegend.map((item) => (
            <article className="launch-status-card" key={item.status}>
              <StatusBadge status={item.status} tone={item.tone} />
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="检查项列表"
          title="完成、未完成和阻塞项一屏看清"
          action={<StatusBadge status={`${blockingChecks.length} 项阻塞`} tone="danger" />}
        />
        <div className="launch-check-layout">
          <div className="launch-check-table" role="table" aria-label="启动前检查项">
            <div className="launch-check-row launch-check-row--head" role="row">
              <span>检查事项</span>
              <span>状态</span>
              <span>完成情况</span>
              <span>是否阻塞</span>
              <span>业务影响</span>
            </div>

            {checks.map((check) => {
              const isSelected = check.id === selectedCheck.id;
              return (
                <button
                  className={`launch-check-row launch-check-row--button${check.completed ? ' launch-check-row--done' : ''}${
                    check.blocksLaunch ? ' launch-check-row--blocked' : ''
                  }${isSelected ? ' launch-check-row--selected' : ''}`}
                  type="button"
                  role="row"
                  aria-pressed={isSelected}
                  key={check.id}
                  onClick={() => selectCheck(check.id)}
                >
                  <span className="launch-check-row__main">
                    <strong>{check.title}</strong>
                    <small>{check.group} / {check.owner}</small>
                  </span>
                  <span>
                    <StatusBadge status={check.status} tone={resolveTone(check.status, check.tone)} />
                  </span>
                  <span>
                    <StatusBadge status={check.completed ? '已完成' : '未完成'} tone={check.completed ? 'success' : 'warning'} />
                  </span>
                  <span>
                    <StatusBadge status={check.blocksLaunch ? '阻塞继续' : '不阻塞'} tone={check.blocksLaunch ? 'danger' : 'success'} />
                  </span>
                  <span className="launch-check-row__impact">{check.impact}</span>
                </button>
              );
            })}
          </div>

          <aside className="workorder-panel launch-detail-panel" aria-label="当前检查项说明">
            <div className="workorder-panel__header">
              <div>
                <h3>{selectedCheck.title}</h3>
                <p>{selectedCheck.description}</p>
              </div>
              <StatusBadge status={selectedCheck.status} tone={resolveTone(selectedCheck.status, selectedCheck.tone)} />
            </div>
            <div className="drawer-block">
              <span>当前依据</span>
              <p>{selectedCheck.evidence}</p>
            </div>
            <div className={`drawer-block ${selectedCheck.blocksLaunch ? 'launch-detail-panel__blocked' : 'drawer-block--next'}`}>
              <span>对启动的影响</span>
              <p>{selectedCheck.impact}</p>
            </div>
            <div className="drawer-block drawer-block--next">
              <span>当前建议动作</span>
              <p>{selectedCheck.nextAction}</p>
            </div>
            <div className="launch-detail-meta">
              <span>{selectedCheck.owner}</span>
              <strong>{selectedCheck.lastUpdate}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="launch-result-grid">
        <article className="workorder-panel">
          <div className="workorder-panel__header">
            <div>
              <h3>已完成事项</h3>
              <p>这些事项已经具备启动基础，不阻塞本轮继续判断。</p>
            </div>
            <StatusBadge status={`${completedChecks.length} 项`} tone="success" />
          </div>
          <div className="launch-mini-list">
            {completedChecks.map((check) => (
              <button key={check.id} className="launch-mini-item" type="button" onClick={() => selectCheck(check.id)}>
                <span>
                  <strong>{check.title}</strong>
                  <small>{check.nextAction}</small>
                </span>
                <StatusBadge status={check.status} tone="success" />
              </button>
            ))}
          </div>
        </article>

        <article className="workorder-panel launch-panel-risk">
          <div className="workorder-panel__header">
            <div>
              <h3>未完成事项</h3>
              <p>未完成不等于全部阻塞，但当前 3 项都会影响正式启动。</p>
            </div>
            <StatusBadge status={`${incompleteChecks.length} 项`} tone="warning" />
          </div>
          <div className="launch-mini-list">
            {incompleteChecks.map((check) => (
              <button key={check.id} className="launch-mini-item launch-mini-item--risk" type="button" onClick={() => selectCheck(check.id)}>
                <span>
                  <strong>{check.title}</strong>
                  <small>{check.impact}</small>
                </span>
                <StatusBadge status={check.blocksLaunch ? '阻塞继续' : check.status} tone={check.blocksLaunch ? 'danger' : resolveTone(check.status)} />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="阻塞原因区" title="哪些未完成会卡住继续推进" action={<StatusBadge status="没准备好就不能往下走" tone="danger" />} />
        <div className="launch-blocker-grid">
          {blockers.map((blocker) => (
            <button key={blocker.title} className="workorder-panel launch-blocker-card" type="button" onClick={() => selectCheck(blocker.checkId)}>
              <div className="workorder-panel__header">
                <div>
                  <h3>{blocker.title}</h3>
                  <p>{blocker.impact}</p>
                </div>
                <StatusBadge status={blocker.status} tone={resolveTone(blocker.status)} />
              </div>
              <div className="drawer-block launch-detail-panel__blocked">
                <span>当前建议动作</span>
                <p>{blocker.suggestion}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作区" title="先补齐启动条件，再进入后续页面" action={<StatusBadge status="不做真实提交" tone="accent" />} />
        <div className="action-grid launch-action-grid">
          {nextActions.map((action) => (
            <ActionCard key={action.title} action={action} onOpen={openAction} />
          ))}
        </div>
      </section>

      {selectedAction ? (
        <article className="customer-admission-action-note launch-action-note">
          <div>
            <span>当前动作说明</span>
            <strong>{selectedAction.title}</strong>
            <p>{selectedAction.detail}</p>
          </div>
          <StatusBadge status={selectedAction.status} tone={resolveTone(selectedAction.status)} />
        </article>
      ) : null}
    </section>
  );
}
