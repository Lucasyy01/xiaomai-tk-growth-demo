import { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Descriptions, Drawer, Row, Space, Steps, Table, Tooltip, Typography } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, FlagOutlined } from '@ant-design/icons';
import StatusBadge from '../components/StatusBadge.jsx';
import {
  assetSummary,
  billingSummary,
  creatorSummary,
  executionTasks,
  phaseDetails,
  projectSnapshot,
  spendSummary,
  workorderCommandCenter,
  workorderOverview,
  workorderRisks,
} from '../data/mockData.js';

const { Paragraph, Text, Title } = Typography;

const riskTaskStatuses = ['已超时', '已阻塞'];

function findMetric(metrics, label) {
  return metrics.find((metric) => metric.label === label)?.value || '-';
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {description ? (
          <p style={{ margin: '4px 0 0', maxWidth: 720, color: '#64748b' }}>
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <Space direction="vertical" size={2}>
      <Text type="secondary">{label}</Text>
      <Text strong>{value}</Text>
    </Space>
  );
}

function EllipsisText({ value, width = 260 }) {
  return (
    <Tooltip title={value}>
      <Text ellipsis style={{ display: 'block', maxWidth: width }}>
        {value}
      </Text>
    </Tooltip>
  );
}

function ConstraintCard({ title, status, tone, conclusion, metrics, note }) {
  return (
    <Card style={{ height: '100%', width: '100%' }} styles={{ body: { padding: 20 } }}>
      <div
        style={{
          minHeight: 250,
          display: 'grid',
          gridTemplateRows: '32px 52px 78px 44px',
          rowGap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text strong>{title}</Text>
          <StatusBadge status={status} tone={tone} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Text
            strong
            style={{
              fontSize: 16,
              lineHeight: '24px',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {conclusion}
          </Text>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                minWidth: 0,
                border: '1px solid #f1f5f9',
                borderRadius: 8,
                background: '#f8fafc',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Text type="secondary">{metric.label}</Text>
              <Text strong style={{ fontSize: 16, lineHeight: '22px' }}>
                {metric.value}
              </Text>
            </div>
          ))}
        </div>
        <Text
          type="secondary"
          style={{
            alignSelf: 'start',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {note}
        </Text>
      </div>
    </Card>
  );
}

export default function ProjectWorkorder({ page, onNavigate }) {
  const [selectedTask, setSelectedTask] = useState(null);

  const currentStageIndex = phaseDetails.findIndex((phase) => phase.stage === projectSnapshot.currentStage);
  const safeCurrentStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const sortedTasks = useMemo(() => {
    return [...executionTasks].sort((left, right) => {
      const leftRisk = riskTaskStatuses.includes(left.status) ? 0 : 1;
      const rightRisk = riskTaskStatuses.includes(right.status) ? 0 : 1;
      if (leftRisk !== rightRisk) return leftRisk - rightRisk;
      if (left.priority !== right.priority) return left.priority === 'P0' ? -1 : 1;
      return left.deadline.localeCompare(right.deadline);
    });
  }, []);

  const riskTasks = executionTasks.filter((task) => riskTaskStatuses.includes(task.status));
  const primaryAction = workorderCommandCenter.primaryAction;
  const mainRisk = workorderRisks[0];

  const stageItems = phaseDetails.map((phase, index) => ({
    title: phase.stage,
    status: index < safeCurrentStageIndex ? 'finish' : index === safeCurrentStageIndex ? 'process' : 'wait',
  }));

  const contentSteps = [
    {
      title: '达人合作',
      status: 'process',
      description: `${findMetric(creatorSummary.metrics, '待交付数')} 待交付`,
    },
    {
      title: '素材产出',
      status: 'finish',
      description: `${findMetric(assetSummary.metrics, '已通过数')} 已通过`,
    },
    {
      title: '授权确认',
      status: 'error',
      description: '当前卡点',
    },
    {
      title: '小预算测试',
      status: 'wait',
      description: `${findMetric(assetSummary.metrics, '待测试数')} 待测试`,
    },
    {
      title: '放量判断',
      status: 'wait',
      description: `${findMetric(assetSummary.metrics, '放量中数')} 放量中`,
    },
  ];

  const taskColumns = [
    {
      title: '任务',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      fixed: 'left',
      render: (value, task) => (
        <Space direction="vertical" size={2}>
          <Text strong>{value}</Text>
          <Text type={riskTaskStatuses.includes(task.status) ? 'danger' : 'secondary'}>{task.risk}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => <StatusBadge status={status} tone={riskTaskStatuses.includes(status) ? 'danger' : undefined} />,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (priority) => <StatusBadge status={priority} tone={priority === 'P0' ? 'danger' : 'accent'} />,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 120,
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
    },
    {
      title: '依赖项',
      dataIndex: 'dependency',
      key: 'dependency',
      width: 240,
      render: (value) => <EllipsisText value={value} width={220} />,
    },
    {
      title: '下一步动作',
      dataIndex: 'nextStep',
      key: 'nextStep',
      render: (value) => <EllipsisText value={value} width={320} />,
    },
  ];

  return (
    <section className="page workorder-page">
      <header className="page-header" style={{ paddingBottom: 16 }}>
        <div>
          <div className="eyebrow">{page.phase}</div>
          <h1 style={{ marginBottom: 6 }}>{page.title}</h1>
          <p style={{ marginBottom: 10 }}>{projectSnapshot.projectName}</p>
          <Space wrap size={[8, 8]}>
            <StatusBadge status={projectSnapshot.currentStage} tone="accent" />
            <StatusBadge status={projectSnapshot.healthStatus} tone="warning" />
            <StatusBadge status={`负责人：${projectSnapshot.owner}`} tone="neutral" />
            <StatusBadge status={`客户：${projectSnapshot.clientName}`} tone="neutral" />
          </Space>
        </div>
        <Space wrap className="page-header__badges" style={{ alignSelf: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => onNavigate('startup-preparation')}>
            返回启动准备
          </Button>
          <Button icon={<EyeOutlined />} type="text" onClick={() => onNavigate('customer-portal')}>
            客户视角预览
          </Button>
          <Button type="primary" icon={<FlagOutlined />} onClick={() => onNavigate('creator-assets')}>
            推进授权并开测
          </Button>
        </Space>
      </header>

      <section className="workorder-section" aria-label="项目总览" style={{ marginTop: 0 }}>
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={16} style={{ display: 'flex' }}>
            <Card
              style={{
                width: '100%',
                borderColor: '#bfdbfe',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                <Space align="start" style={{ width: '100%', justifyContent: 'space-between', gap: 16 }}>
                  <Space direction="vertical" size={4}>
                    <div className="eyebrow">先看这里 / 当前判断</div>
                    <Title level={2} style={{ margin: 0 }}>
                      能继续推，但先清素材授权
                    </Title>
                    <Text type="secondary">当前不是全面停摆；执行任务可以继续盯，但小预算测试必须等授权确认。</Text>
                  </Space>
                  <StatusBadge status={projectSnapshot.healthStatus} tone="warning" />
                </Space>

                <Alert
                  message={`唯一强提醒：${mainRisk.title}`}
                  description="已通过素材还不能直接投放，先确认广告使用授权周期和投放渠道。"
                  type="warning"
                  showIcon
                  style={{ paddingBlock: 10 }}
                />

                <Row gutter={[12, 12]}>
                  <Col xs={12} md={6}>
                    <Field label="项目状态" value={projectSnapshot.currentStage} />
                  </Col>
                  <Col xs={12} md={6}>
                    <Field label="负责人" value={projectSnapshot.owner} />
                  </Col>
                  <Col xs={12} md={6}>
                    <Field label="最大卡点" value={mainRisk.title} />
                  </Col>
                  <Col xs={12} md={6}>
                    <Field label="最重要动作" value={primaryAction.value} />
                  </Col>
                </Row>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, background: '#f8fafc' }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Text type="secondary">阶段辅助：当前处于 {projectSnapshot.currentStage}，不抢主判断。</Text>
                    <Steps size="small" current={safeCurrentStageIndex} items={stageItems} />
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8} style={{ display: 'flex' }}>
            <Card
              title="下一步动作"
              extra={<StatusBadge status={primaryAction.status} tone="warning" />}
              style={{ width: '100%' }}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ minHeight: 230, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Title level={3} style={{ margin: 0 }}>
                  {primaryAction.value}
                </Title>
                <Paragraph style={{ marginBottom: 0 }}>{primaryAction.meta}</Paragraph>
                <Text type="secondary">动作目的：解除测试前置卡点，让小预算测试具备启动条件。</Text>
                <div style={{ marginTop: 'auto' }}>
                  <Text type="secondary">关联页面：达人合作与素材资产</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="workorder-section" aria-label="执行推进">
        <SectionHeading
          eyebrow="模块 2 / 执行视角"
          title="谁在推进什么"
          description="只看内部执行责任：任务、负责人、状态和下一步；能不能开测不在这里下结论。"
          action={<StatusBadge status={`${riskTasks.length} 项需盯`} tone={riskTasks.length > 0 ? 'danger' : 'success'} />}
        />
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="id"
            size="small"
            columns={taskColumns}
            dataSource={sortedTasks}
            pagination={false}
            scroll={{ x: 1120 }}
            onRow={(task) => ({
              onClick: () => setSelectedTask(task),
              style: { cursor: 'pointer' },
            })}
          />
        </Card>
      </section>

      <section className="workorder-section" aria-label="内容与测试">
        <SectionHeading
          eyebrow="模块 3 / 测试准备视角"
          title="现在能不能开测"
          description="只看测试前置条件：达人、素材、授权和测试入口；不讨论任务逾期和回款。"
          action={<StatusBadge status={assetSummary.status} tone="warning" />}
        />
        <Card>
          <Row gutter={[20, 16]} align="stretch">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong>结论：暂不能开测。素材供给已形成，缺口在广告使用授权。</Text>
                  <StatusBadge status="待授权" tone="warning" />
                </Space>
                <Steps size="small" items={contentSteps} />
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <div
                style={{
                  height: '100%',
                  minHeight: 132,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: '#fafafa',
                }}
              >
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Field label="达人交付" value={creatorSummary.status} />
                  </Col>
                  <Col span={12}>
                    <Field label="授权状态" value={assetSummary.status} />
                  </Col>
                  <Col span={12}>
                    <Field label="测试入口" value="待授权" />
                  </Col>
                  <Col span={12}>
                    <Field label="可放量素材" value={findMetric(assetSummary.metrics, '放量中数')} />
                  </Col>
                </Row>
                <Text type="secondary" style={{ marginTop: 'auto' }}>
                  {assetSummary.nextAction}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </section>

      <section className="workorder-section" aria-label="风险与约束">
        <SectionHeading
          eyebrow="模块 4 / 经营约束视角"
          title="钱、额度、回款有没有拖后腿"
          description="只看经营条件是否会拖住项目：授信、占额、回款、扣款授权；不重复执行卡点。"
          action={<StatusBadge status={workorderOverview.customer.creditStatus} tone="success" />}
        />
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={8} style={{ display: 'flex' }}>
            <ConstraintCard
              title="授信状态"
              status={workorderOverview.customer.creditStatus}
              tone="success"
              conclusion="授信可用，允许继续推进"
              metrics={[
                { label: '授信额度', value: workorderOverview.customer.totalCredit },
                { label: '可用额度', value: workorderOverview.customer.availableCredit },
              ]}
              note="额度足够开测；放量前复核占额。"
            />
          </Col>
          <Col xs={24} lg={8} style={{ display: 'flex' }}>
            <ConstraintCard
              title="预算与占额"
              status={spendSummary.status}
              tone="success"
              conclusion="占额压力可控"
              metrics={[
                { label: '当前占额', value: workorderOverview.customer.creditUsage },
                { label: '累计消耗', value: spendSummary.totalSpend },
              ]}
              note="当前节奏安全，暂不触发额度预警。"
            />
          </Col>
          <Col xs={24} lg={8} style={{ display: 'flex' }}>
            <ConstraintCard
              title="回款与扣款"
              status={billingSummary.status}
              tone="warning"
              conclusion="待收需放量前确认"
              metrics={[
                { label: '待收金额', value: billingSummary.pending },
                { label: '扣款授权', value: billingSummary.autoDebitStatus },
              ]}
              note="放量前确认余额与扣款授权。"
            />
          </Col>
        </Row>
      </section>

      <Drawer title="执行任务详情" width={460} open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)}>
        {selectedTask ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Space wrap>
              <StatusBadge status={selectedTask.status} tone={riskTaskStatuses.includes(selectedTask.status) ? 'danger' : undefined} />
              <StatusBadge status={selectedTask.priority} tone={selectedTask.priority === 'P0' ? 'danger' : 'accent'} />
            </Space>
            <Title level={3} style={{ margin: 0 }}>
              {selectedTask.type}
            </Title>
            <Descriptions
              column={1}
              bordered
              size="small"
              items={[
                { key: 'owner', label: '负责人', children: selectedTask.owner },
                { key: 'deadline', label: '截止时间', children: selectedTask.deadline },
                { key: 'lastUpdate', label: '最近更新', children: selectedTask.lastUpdate },
                { key: 'dependency', label: '依赖项', children: selectedTask.dependency },
              ]}
            />
            <Card size="small" title="当前进展">
              <Paragraph style={{ marginBottom: 0 }}>{selectedTask.detail}</Paragraph>
            </Card>
            <Card size="small" title="下一步动作">
              <Paragraph style={{ marginBottom: 0 }}>{selectedTask.nextStep}</Paragraph>
            </Card>
          </Space>
        ) : null}
      </Drawer>
    </section>
  );
}
