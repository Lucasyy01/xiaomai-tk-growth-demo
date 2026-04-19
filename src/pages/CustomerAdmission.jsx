import { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import { customerAdmissionDetail } from '../data/mockData.js';

const filterOrder = ['全部', '可推进', '待授信', '待评估', '待观察'];

function resolveTone(status, tone) {
  if (tone) return tone;
  if (status === '可推进') return 'success';
  if (['待授信', '待授权', '待评估', '待确认', '待补资料'].includes(status)) return 'warning';
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

export default function CustomerAdmission({ page, onNavigate }) {
  const { customers, hero, nextActions, summaryCards } = customerAdmissionDetail;
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  const [selectedAction, setSelectedAction] = useState(null);

  const filterOptions = useMemo(() => {
    return filterOrder.map((status) => ({
      label: status,
      count: status === '全部' ? customers.length : customers.filter((customer) => customer.status === status).length,
    }));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (selectedStatus === '全部') return customers;
    return customers.filter((customer) => customer.status === selectedStatus);
  }, [customers, selectedStatus]);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || customers[0];

  const openAction = (action) => {
    if (action.target && onNavigate) {
      onNavigate(action.target);
      return;
    }

    setSelectedAction(action);
  };

  const openCustomerNextAction = () => {
    if (selectedCustomer.target && onNavigate) {
      onNavigate(selectedCustomer.target);
      return;
    }

    setSelectedAction({
      title: selectedCustomer.nextAction,
      status: selectedCustomer.status,
      owner: selectedCustomer.owner,
      due: '按当前准入结论',
      description: selectedCustomer.judgement,
      detail: selectedCustomer.actionDetail,
      actionLabel: '查看说明',
    });
  };

  return (
    <section className="page customer-admission-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1>{page.title}</h1>
          <p>{page.objective}</p>
        </div>
        <div className="page-header__badges">
          <StatusBadge status={page.priority} tone="accent" />
          <StatusBadge status="商机筛选" tone="accent" />
          <StatusBadge status={page.status} />
        </div>
      </header>

      <article className="central-hero customer-admission-hero">
        <div className="workorder-hero__main">
          <div className="command-kicker">
            <div className="eyebrow">{hero.label}</div>
            <StatusBadge status={hero.mainNextAction.status} tone="success" />
          </div>
          <h2>{hero.headline}</h2>
          <p>{hero.description}</p>
          <div className="customer-admission-scope-note">{hero.scopeNote}</div>
          <div className="hero-facts">
            {hero.metrics.map((metric) => (
              <DetailMetric key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        <div className="workorder-hero__side customer-admission-hero__side">
          <StatusBadge status={hero.mainNextAction.status} tone="success" />
          <strong>{hero.mainNextAction.title}</strong>
          <span>{hero.mainNextAction.description}</span>
          <div className="drawer-block drawer-block--next customer-admission-hero__next">
            <span>下一步</span>
            <p>{hero.mainNextAction.nextStep}</p>
          </div>
          <button className="primary-action" type="button" onClick={() => onNavigate?.('launch-checklist')}>
            发起启动前检查
          </button>
        </div>
      </article>

      <section className="section-grid section-grid--four customer-admission-summary-grid" aria-label="客户准入摘要">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            status={card.status}
            tone={card.tone}
            meta={card.meta}
            isCentral={card.status === '可推进'}
          />
        ))}
      </section>

      <section className="workorder-section">
        <SectionHeading
          eyebrow="客户池筛选"
          title="谁值得推进、为什么、下一步做什么"
          action={<StatusBadge status={`${filteredCustomers.length} 家`} tone={selectedStatus === '可推进' ? 'success' : 'accent'} />}
        />

        <div className="customer-admission-filter-bar" aria-label="客户状态筛选">
          {filterOptions.map((filter) => (
            <button
              key={filter.label}
              className={`text-action customer-admission-filter${selectedStatus === filter.label ? ' customer-admission-filter--active' : ''}`}
              type="button"
              aria-pressed={selectedStatus === filter.label}
              onClick={() => setSelectedStatus(filter.label)}
            >
              {filter.label}
              <span>{filter.count}</span>
            </button>
          ))}
        </div>

        <div className="customer-admission-board">
          <div className="customer-admission-table" role="table" aria-label="客户准入队列">
            <div className="customer-admission-row customer-admission-row--head" role="row">
              <span>客户 / 来源</span>
              <span>品类与市场</span>
              <span>状态</span>
              <span>商机评分</span>
              <span>为什么值得推进</span>
              <span>下一步</span>
            </div>

            {filteredCustomers.map((customer) => {
              const isSelected = customer.id === selectedCustomer.id;
              const isPriority = customer.status === '可推进';

              return (
                <button
                  key={customer.id}
                  className={`customer-admission-row customer-admission-row--button${isPriority ? ' customer-admission-row--priority' : ''}${
                    isSelected ? ' customer-admission-row--selected' : ''
                  }`}
                  type="button"
                  role="row"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <span className="customer-admission-row__main">
                    <strong>{customer.name}</strong>
                    <small>{customer.source} / {customer.owner}</small>
                  </span>
                  <span>
                    {customer.category}
                    <small>{customer.market}</small>
                  </span>
                  <span>
                    <StatusBadge status={customer.status} tone={resolveTone(customer.status, customer.statusTone)} />
                  </span>
                  <span className="customer-admission-score">
                    <b>{customer.score}</b>
                    <span className="customer-admission-score__bar" style={{ '--score': `${customer.score}%` }}>
                      <i />
                    </span>
                  </span>
                  <span className="customer-admission-row__reason">{customer.reason}</span>
                  <span className="customer-admission-row__action">{customer.nextAction}</span>
                </button>
              );
            })}
          </div>

          <aside className="workorder-panel customer-admission-profile" aria-label="客户摘要">
            <div className="workorder-panel__header">
              <div>
                <h3>{selectedCustomer.name}</h3>
                <p>{selectedCustomer.summary}</p>
              </div>
              <StatusBadge status={selectedCustomer.status} tone={resolveTone(selectedCustomer.status, selectedCustomer.statusTone)} />
            </div>

            <div className="customer-admission-profile__score">
              <div>
                <span>商机评分</span>
                <strong>{selectedCustomer.score}</strong>
              </div>
              <p>{selectedCustomer.judgement}</p>
            </div>

            <div className="customer-admission-tag-list">
              {selectedCustomer.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="customer-admission-signal-grid">
              {selectedCustomer.dimensions.map((dimension) => (
                <div className="customer-admission-signal" key={dimension.label}>
                  <span>{dimension.label}</span>
                  <strong>{dimension.value}</strong>
                  <StatusBadge status={dimension.status} tone={dimension.tone} />
                </div>
              ))}
            </div>

            <div className="drawer-block">
              <span>历史合作轻量摘要</span>
              <p>{selectedCustomer.history}</p>
            </div>

            <div className="drawer-block drawer-block--next">
              <span>当前建议动作</span>
              <p>{selectedCustomer.actionDetail}</p>
            </div>

            <button className="primary-action customer-admission-profile__action" type="button" onClick={openCustomerNextAction}>
              {selectedCustomer.nextAction}
            </button>
          </aside>
        </div>
      </section>

      <section className="workorder-section">
        <SectionHeading eyebrow="下一步动作区" title="让准入结论进入后续流程" action={<StatusBadge status="演示入口" tone="accent" />} />
        <div className="action-grid customer-admission-action-grid">
          {nextActions.map((action) => (
            <button key={action.title} className="action-card action-card--clickable customer-admission-action-card" type="button" onClick={() => openAction(action)}>
              <div className="action-card__top">
                <div>
                  <span>{action.title}</span>
                  <strong>{action.owner}</strong>
                </div>
                <StatusBadge status={action.status} tone={resolveTone(action.status)} />
              </div>
              <p>{action.description}</p>
              <div className="action-card__next">
                <span>边界说明</span>
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

      {selectedAction ? (
        <article className="customer-admission-action-note">
          <div>
            <span>本页轻量动作说明</span>
            <strong>{selectedAction.title}</strong>
            <p>{selectedAction.detail}</p>
          </div>
          <StatusBadge status={selectedAction.status} tone={resolveTone(selectedAction.status)} />
        </article>
      ) : null}
    </section>
  );
}
