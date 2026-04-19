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

      <article className="central-hero workorder-hero">
        <div className="workorder-hero__main">
          <div className="eyebrow">项目总览</div>
          <h2>{projectSnapshot.projectName}</h2>
          <p>{projectSnapshot.nextAction}</p>
          <div className="hero-facts">
            <DetailMetric label="客户" value={projectSnapshot.clientName} />
            <DetailMetric label="项目类型" value={projectSnapshot.projectType} />
            <DetailMetric label="负责人" value={projectSnapshot.owner} />
            <DetailMetric label="项目周期" value={projectSnapshot.cycle} />
          </div>
        </div>
        <div className="workorder-hero__side">
          <StatusBadge status={projectSnapshot.currentStage} tone="accent" />
          <strong>下一步最关键</strong>
          <span>授权确认后进入小预算测试</span>
          <button className="primary-action" type="button" onClick={() => onNavigate('customer-portal')}>
            客户视角预览
          </button>
        </div>
      </article>

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
            <span>下一步动作建议</span>
            <p>{selectedStageDetail.nextAction}</p>
          </div>
        </article>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="动作中枢" title="现在最该处理的 3 件事" />
        <div className="section-grid section-grid--three">
          {workorderOverview.nextActions.map((action) => (
            <SummaryCard
              key={action.title}
              title={action.title}
              value={action.value}
              status={action.status}
              meta={action.meta}
              onClick={action.target ? () => onNavigate(action.target) : undefined}
            />
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
                    <span>{task.type}</span>
                    <strong>{task.owner}</strong>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div className="task-card__body">
                  <span>截止 {task.deadline}</span>
                  <p>{task.risk}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="对象摘要" title="达人合作、素材、消耗和账单" />
        <div className="workorder-summary-grid">
          <article className="workorder-panel">
            <div className="workorder-panel__header">
              <div>
                <h3>达人合作摘要</h3>
                <p>{creatorSummary.nextAction}</p>
              </div>
              <button className="text-action" type="button" onClick={() => onNavigate('creator-assets')}>
                查看
              </button>
            </div>
            <StatusBadge status={creatorSummary.status} />
            <div className="mini-metric-grid mini-metric-grid--four">
              {creatorSummary.metrics.map((metric) => (
                <DetailMetric key={metric.label} {...metric} />
              ))}
            </div>
          </article>

          <article className="workorder-panel">
            <div className="workorder-panel__header">
              <div>
                <h3>素材资产摘要</h3>
                <p>{assetSummary.nextAction}</p>
              </div>
              <button className="text-action" type="button" onClick={() => onNavigate('creator-assets')}>
                查看
              </button>
            </div>
            <StatusBadge status={assetSummary.status} />
            <div className="mini-metric-grid mini-metric-grid--three">
              {assetSummary.metrics.map((metric) => (
                <DetailMetric key={metric.label} {...metric} />
              ))}
            </div>
            <div className="asset-ladder">
              {assetSummary.ladder.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>

          <article className="workorder-panel">
            <div className="workorder-panel__header">
              <div>
                <h3>消耗与占额摘要</h3>
                <p>只展示项目消耗和授信占额，不做复杂图表。</p>
              </div>
              <StatusBadge status={spendSummary.status} tone="success" />
            </div>
            <div className="mini-metric-grid mini-metric-grid--four">
              <DetailMetric label="今日消耗" value={spendSummary.todaySpend} />
              <DetailMetric label="累计消耗" value={spendSummary.totalSpend} />
              <DetailMetric label="当前占额" value={spendSummary.creditOccupancy} />
              <DetailMetric label="额度预警" value={spendSummary.limitWarning} />
            </div>
          </article>

          <article className="workorder-panel">
            <div className="workorder-panel__header">
              <div>
                <h3>账单与回款摘要</h3>
                <p>体现平台应收、已收、待收和自动扣款授权状态。</p>
              </div>
              <button className="text-action" type="button" onClick={() => onNavigate('billing-collection')}>
                查看
              </button>
            </div>
            <StatusBadge status={billingSummary.status} />
            <div className="mini-metric-grid mini-metric-grid--three">
              <DetailMetric label="应收总额" value={billingSummary.receivable} />
              <DetailMetric label="已收金额" value={billingSummary.received} />
              <DetailMetric label="待收金额" value={billingSummary.pending} />
              <DetailMetric label="最近扣款" value={billingSummary.lastDeduction} />
              <DetailMetric label="扣款授权" value={billingSummary.autoDebitStatus} />
            </div>
          </article>
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
