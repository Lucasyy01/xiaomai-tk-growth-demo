import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import {
  assetSummary,
  billingSummary,
  creatorSummary,
  executionTasks,
  phaseDetails,
  projectSnapshot,
  spendSummary,
  workorderCommandCenter,
  workorderBlockers,
  workorderLogs,
  workorderOverview,
  workorderRisks,
} from '../data/mockData.js';

const riskTaskStatuses = ['已超时', '已阻塞'];

function DetailMetric({ label, value }) {
  return (
    <div className="detail-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ActionCard({ action, onNavigate }) {
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
          <strong>{action.value}</strong>
        </div>
        <StatusBadge status={action.status} />
      </div>
      <p>{action.meta}</p>
      <div className="action-card__next">
        <span>下一步</span>
        <p>{action.nextStep}</p>
      </div>
      <div className="action-card__footer">
        <span>{action.owner}</span>
        <span>{action.due}</span>
        {action.actionLabel ? <strong>{action.actionLabel}</strong> : null}
      </div>
    </Component>
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

function WorkorderPanel({ title, description, status, actionLabel, onClick, children }) {
  const Component = onClick ? 'button' : 'article';

  return (
    <Component className={`workorder-panel${onClick ? ' workorder-panel--link' : ''}`} type={onClick ? 'button' : undefined} onClick={onClick}>
      <div className="workorder-panel__header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="workorder-panel__actions">
          {status ? <StatusBadge status={status} /> : null}
          {actionLabel ? <span>{actionLabel}</span> : null}
        </div>
      </div>
      {children}
    </Component>
  );
}

function TaskDrawer({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="task-drawer-backdrop" onClick={onClose}>
      <aside className="task-drawer" aria-label="任务详情" onClick={(event) => event.stopPropagation()}>
        <div className="task-drawer__header">
          <div>
            <span>执行任务详情</span>
            <h3>{task.type}</h3>
          </div>
          <button className="icon-button" type="button" aria-label="关闭任务详情" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="task-drawer__status">
          <StatusBadge status={task.status} />
          <StatusBadge status={task.priority} tone={task.priority === 'P0' ? 'danger' : 'accent'} />
          <span>{task.risk}</span>
        </div>

        <dl className="task-drawer__meta">
          <div>
            <dt>负责人</dt>
            <dd>{task.owner}</dd>
          </div>
          <div>
            <dt>截止时间</dt>
            <dd>{task.deadline}</dd>
          </div>
          <div>
            <dt>最近更新</dt>
            <dd>{task.lastUpdate}</dd>
          </div>
          <div>
            <dt>依赖项</dt>
            <dd>{task.dependency}</dd>
          </div>
        </dl>

        <div className="drawer-block">
          <span>当前进展</span>
          <p>{task.detail}</p>
        </div>
        <div className="drawer-block drawer-block--next">
          <span>下一步动作</span>
          <p>{task.nextStep}</p>
        </div>
      </aside>
    </div>
  );
}

export default function ProjectWorkorder({ page, onNavigate }) {
  const [selectedStage, setSelectedStage] = useState(projectSnapshot.currentStage);
  const [selectedTask, setSelectedTask] = useState(null);

  const selectedStageDetail = useMemo(() => {
    return phaseDetails.find((phase) => phase.stage === selectedStage) || phaseDetails.find((phase) => phase.stage === projectSnapshot.currentStage);
  }, [selectedStage]);

  const currentStageIndex = phaseDetails.findIndex((phase) => phase.stage === projectSnapshot.currentStage);
  const riskTaskCount = executionTasks.filter((task) => riskTaskStatuses.includes(task.status)).length;
  const primaryAction = workorderCommandCenter.primaryAction;

  return (
    <section className="page workorder-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status="中枢页" tone="accent" />
          <StatusBadge status={page.status} />
        </div>
      </header>

      <article className="central-hero workorder-hero workorder-command">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">项目总览 / 交付中枢</div>
            <StatusBadge status={projectSnapshot.healthStatus} tone="warning" />
          </div>
          <h2>{projectSnapshot.projectName}</h2>
          <p>{projectSnapshot.commandFocus}</p>
          <div className="primary-next-action">
            <div>
              <span>{primaryAction.title}</span>
              <strong>{primaryAction.value}</strong>
              <p>{primaryAction.meta}</p>
            </div>
            <StatusBadge status={primaryAction.status} />
          </div>
          <div className="hero-facts">
            <DetailMetric label="客户" value={projectSnapshot.clientName} />
            <DetailMetric label="项目类型" value={projectSnapshot.projectType} />
            <DetailMetric label="负责人" value={projectSnapshot.owner} />
            <DetailMetric label="项目周期" value={projectSnapshot.cycle} />
          </div>
        </div>
        <div className="workorder-hero__side">
          <StatusBadge status={projectSnapshot.currentStage} tone="accent" />
          <strong>{projectSnapshot.healthStatus}</strong>
          <span>{projectSnapshot.healthReason}</span>
          <button className="primary-action" type="button" onClick={() => onNavigate('customer-portal')}>
            客户视角预览
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four command-metric-grid" aria-label="项目中枢核心指标">
        {workorderCommandCenter.metrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} isCentral={metric.status === '已阻塞'} />
        ))}
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="阶段推进"
          title="从项目状态看下一步"
          action={<StatusBadge status={`当前阶段：${projectSnapshot.currentStage}`} tone="accent" />}
        />

        <article className="stage-strip stage-strip--interactive">
          {phaseDetails.map((phase, index) => {
            const isCurrent = phase.stage === projectSnapshot.currentStage;
            const isSelected = phase.stage === selectedStage;
            const isPast = currentStageIndex > index;

            return (
              <button
                key={phase.stage}
                className={`stage-node stage-node--button${isCurrent ? ' stage-node--active' : ''}${isSelected ? ' stage-node--selected' : ''}${
                  isPast ? ' stage-node--past' : ''
                }`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedStage(phase.stage)}
              >
                <span className="stage-node__index">{String(index + 1).padStart(2, '0')}</span>
                <span>{phase.stage}</span>
                {isCurrent ? <StatusBadge status="当前阶段" tone="accent" /> : null}
              </button>
            );
          })}
        </article>

        <article className="stage-advice">
          <div>
            <span>当前查看阶段</span>
            <strong>{selectedStageDetail.stage}</strong>
            <p>{selectedStageDetail.description}</p>
          </div>
          <div>
            <span>进入条件</span>
            <p>{selectedStageDetail.entryCondition}</p>
          </div>
          <div>
            <span>风险关注</span>
            <p>{selectedStageDetail.riskFocus}</p>
          </div>
          <div className="stage-advice__next">
            <span>下一步动作建议</span>
            <p>{selectedStageDetail.nextAction}</p>
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="动作中枢" title="现在最该处理的 3 件事" />
        <div className="action-grid">
          {workorderOverview.nextActions.map((action) => (
            <ActionCard key={action.title} action={action} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="客户与授信" title="客户、额度和风险摘要" />
        <div className="section-grid section-grid--four">
          <SummaryCard title="客户状态" value={workorderOverview.customer.status} status={workorderOverview.customer.status} meta={workorderOverview.customer.name} />
          <SummaryCard
            title="授信额度"
            value={workorderOverview.customer.totalCredit}
            status={workorderOverview.customer.creditStatus}
            meta={`已用 ${workorderOverview.customer.usedCredit}，可用 ${workorderOverview.customer.availableCredit}`}
          />
          <SummaryCard title="当前占额" value={workorderOverview.customer.creditUsage} status={spendSummary.status} tone="success" meta={spendSummary.limitWarning} />
          <SummaryCard title="风险状态" value={workorderOverview.customer.riskStatus} status="待授权" meta={`${riskTaskCount} 个关键任务需要关注`} />
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="执行任务"
          title="关键任务推进"
          action={<StatusBadge status={`${riskTaskCount} 项风险`} tone={riskTaskCount > 0 ? 'danger' : 'success'} />}
        />
        <div className="task-list">
          {executionTasks.map((task) => {
            const isRiskTask = riskTaskStatuses.includes(task.status);

            return (
              <button key={task.id} className={`task-card${isRiskTask ? ' task-card--risk' : ''}`} type="button" onClick={() => setSelectedTask(task)}>
                <div className="task-card__top">
                  <div>
                    <span>{task.type} / {task.priority}</span>
                    <strong>{task.owner}</strong>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div className="task-card__body">
                  <span>截止 {task.deadline}</span>
                  <p>{task.risk}</p>
                  <small>{task.nextStep}</small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="对象摘要" title="达人合作、素材、消耗和账单" />
        <div className="workorder-summary-grid">
          <WorkorderPanel
            title="达人合作摘要"
            description={creatorSummary.nextAction}
            status={creatorSummary.status}
            actionLabel="查看达人与素材"
            onClick={() => onNavigate('creator-assets')}
          >
            <div className="mini-metric-grid mini-metric-grid--four">
              {creatorSummary.metrics.map((metric) => (
                <DetailMetric key={metric.label} {...metric} />
              ))}
            </div>
          </WorkorderPanel>

          <WorkorderPanel
            title="素材资产摘要"
            description={assetSummary.nextAction}
            status={assetSummary.status}
            actionLabel="查看素材明细"
            onClick={() => onNavigate('creator-assets')}
          >
            <div className="mini-metric-grid mini-metric-grid--three">
              {assetSummary.metrics.map((metric) => (
                <DetailMetric key={metric.label} {...metric} />
              ))}
            </div>
            <p className="panel-note">{assetSummary.conversionNote}</p>
            <div className="asset-ladder">
              {assetSummary.ladder.map((item, index) => (
                <div className="asset-ladder__step" key={item.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </div>
              ))}
            </div>
          </WorkorderPanel>

          <WorkorderPanel title="消耗与占额摘要" description="只展示项目消耗和授信占额，不做复杂图表。" status={spendSummary.status}>
            <div className="mini-metric-grid mini-metric-grid--four">
              <DetailMetric label="今日消耗" value={spendSummary.todaySpend} />
              <DetailMetric label="累计消耗" value={spendSummary.totalSpend} />
              <DetailMetric label="当前占额" value={spendSummary.creditOccupancy} />
              <DetailMetric label="额度预警" value={spendSummary.limitWarning} />
            </div>
            <div className="quota-rail" style={{ '--usage': spendSummary.usagePercent }}>
              <span />
            </div>
            <p className="panel-note">{spendSummary.forecast}</p>
          </WorkorderPanel>

          <WorkorderPanel
            title="账单与回款摘要"
            description="体现平台应收、已收、待收和自动扣款授权状态。"
            status={billingSummary.status}
            actionLabel="查看账单"
            onClick={() => onNavigate('billing-collection')}
          >
            <div className="mini-metric-grid mini-metric-grid--three">
              <DetailMetric label="应收总额" value={billingSummary.receivable} />
              <DetailMetric label="已收金额" value={billingSummary.received} />
              <DetailMetric label="待收金额" value={billingSummary.pending} />
              <DetailMetric label="最近扣款" value={billingSummary.lastDeduction} />
              <DetailMetric label="扣款授权" value={billingSummary.autoDebitStatus} />
            </div>
            <p className="panel-note">{billingSummary.nextCollectionAction}</p>
          </WorkorderPanel>
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="日志与异常" title="最近更新和当前阻塞项" />
        <div className="workorder-bottom-grid">
          <article className="workorder-panel">
            <h3>最近更新日志</h3>
            <div className="event-list">
              {workorderLogs.map((log) => (
                <div className="event-item" key={`${log.time}-${log.title}`}>
                  <span>{log.time}</span>
                  <p>{log.title}</p>
                  <StatusBadge status={log.status} />
                </div>
              ))}
            </div>
          </article>

          <article className="workorder-panel workorder-panel--risk">
            <h3>风险事件</h3>
            <div className="risk-list">
              {workorderRisks.map((risk) => (
                <div className="risk-item" key={risk.title}>
                  <div>
                    <strong>{risk.title}</strong>
                    <p>{risk.description}</p>
                  </div>
                  <StatusBadge status={risk.status} />
                </div>
              ))}
            </div>
          </article>

          <article className="workorder-panel">
            <h3>当前阻塞项</h3>
            <ol className="blocker-list">
              {workorderBlockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
    </section>
  );
}
