import { useMemo, useState } from 'react';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Table from 'antd/es/table';
import Tabs from 'antd/es/tabs';
import Tag from 'antd/es/tag';
import Typography from 'antd/es/typography';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { creditApprovalDetail, launchChecklistDetail, paymentAuthorizationDetail } from '../data/mockData.js';

const { Paragraph, Text, Title } = Typography;

const toneMap = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  error: 'error',
  accent: 'processing',
  processing: 'processing',
  neutral: 'default',
};

const rhythm = {
  page: { gap: 14 },
  headerBody: { padding: '14px 16px' },
  compactBody: { padding: 14 },
  moduleBody: { display: 'grid', gap: 10, minHeight: 150, padding: 14 },
  tabShellBody: { padding: '10px 14px 14px' },
  tabConclusionBody: { padding: 14 },
  tableBody: { padding: 0 },
  detailBody: { minHeight: 96, display: 'grid', gap: 6, alignContent: 'start', padding: 12 },
  rowCell: { minHeight: 42, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 },
  subtleBlock: {
    border: '1px solid #edf0f5',
    borderRadius: 8,
    padding: 10,
    background: '#fafbfc',
  },
};

function resolveTone(status, tone) {
  if (tone) return toneMap[tone] || tone;
  if (['已完成', '已通过', '可推进', '正常', '已绑定', '已授权', '可进入授信', '低风险', '可立项', '无硬阻塞'].includes(status)) {
    return 'success';
  }
  if (['执行中', '检查中'].includes(status)) return 'processing';
  if (['待检查', '待补资料', '待确认', '待授权', '待复核', '授权中', '存在需关注项'].includes(status)) return 'warning';
  if (['已阻塞', '已失败', '已逾期', '不通过', '暂不允许进入下一步'].includes(status)) return 'error';
  return 'default';
}

function statusTag(status, tone) {
  const resolvedTone = resolveTone(status, tone);
  return <Tag color={resolvedTone === 'default' ? undefined : resolvedTone}>{status}</Tag>;
}

function compactText(text, rows = 2) {
  return (
    <Paragraph ellipsis={{ rows, tooltip: text }} style={{ margin: 0 }}>
      {text}
    </Paragraph>
  );
}

function getCheckGapText(check) {
  if (check.completed) return '暂无关键缺口';
  return check.evidence || check.nextAction;
}

function ModuleStatusCard({ module }) {
  return (
    <Card
      size="small"
      style={{
        width: '100%',
        height: '100%',
        borderColor: module.hasConcern ? '#ffd591' : '#edf0f5',
        background: module.hasConcern ? '#fffaf2' : '#fff',
      }}
      styles={{ body: rhythm.moduleBody }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <Text type="secondary">准备模块</Text>
          <div>
            <Text strong>{module.title}</Text>
          </div>
        </div>
        {statusTag(module.status, module.tone)}
      </div>
      {compactText(module.judgement, 2)}
      <div style={rhythm.subtleBlock}>
        <Text type="secondary">需要关注</Text>
        <div style={{ marginTop: 4 }}>{compactText(module.concern, 2)}</div>
      </div>
    </Card>
  );
}

function TabConclusion({ title, status, tone, description, actionLabel, onAction }) {
  return (
    <Card size="small" styles={{ body: rhythm.tabConclusionBody }}>
      <Row gutter={[16, 12]} align="middle">
        <Col xs={24} lg={17}>
          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            <Space size={[8, 8]} wrap>
              <Text type="secondary">{title}</Text>
              {statusTag(status, tone)}
            </Space>
            {compactText(description, 2)}
          </Space>
        </Col>
        <Col xs={24} lg={7}>
          <div style={rhythm.subtleBlock}>
            <Text type="secondary">本模块建议动作</Text>
            <div style={{ marginTop: 8 }}>
              <Button size="small" onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <Card size="small" title="当前选中项说明" styles={{ body: rhythm.compactBody }}>
        <Text type="secondary">选择一条分项明细后查看依据、影响和处理建议。</Text>
      </Card>
    );
  }

  return (
    <Card
      size="small"
      title={`当前选中项说明：${selectedItem.title}`}
      extra={statusTag(selectedItem.status, selectedItem.tone)}
      styles={{ body: rhythm.compactBody }}
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={8}>
          <Card size="small" title="当前依据" styles={{ body: rhythm.detailBody }}>
            {compactText(selectedItem.evidence, 4)}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small" title="影响" styles={{ body: rhythm.detailBody }}>
            {compactText(selectedItem.impact, 4)}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card size="small" title="建议动作" styles={{ body: rhythm.detailBody }}>
            {compactText(selectedItem.nextAction, 4)}
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default function StartupPreparation({ page, onNavigate }) {
  const { checks, conclusion, customer } = launchChecklistDetail;
  const { account, authorization, decision, project } = paymentAuthorizationDetail;
  const { credit } = creditApprovalDetail;
  const [activeTab, setActiveTab] = useState('launch');
  const [selectedLaunchId, setSelectedLaunchId] = useState(checks[0]?.id);
  const [selectedPaymentId, setSelectedPaymentId] = useState('account');
  const [selectedCreditId, setSelectedCreditId] = useState('conclusion');

  const selectedLaunch = checks.find((check) => check.id === selectedLaunchId);

  const paymentItems = useMemo(() => [
    {
      id: 'account',
      title: '回款账户绑定',
      status: account.bindingStatus,
      tone: 'success',
      blocked: false,
      owner: '财务协同',
      evidence: `${account.platform} / ${account.accountMasked} / ${account.lastValidationShort}`,
      impact: account.description,
      nextAction: account.nextStep,
    },
    {
      id: 'authorization',
      title: '自动扣款授权',
      status: authorization.authorizationStatus,
      tone: 'success',
      blocked: false,
      owner: '财务协同',
      evidence: `${authorization.scope} / ${authorization.lastResultShort}`,
      impact: authorization.notTikTokNote,
      nextAction: authorization.nextStep,
    },
    {
      id: 'decision',
      title: '账户与扣款判断',
      status: decision.status,
      tone: 'success',
      blocked: !decision.allowCreditApproval,
      owner: '客户成功 / 财务',
      evidence: decision.reason,
      impact: decision.scopeNote,
      nextAction: decision.nextStep,
    },
  ], [account, authorization, decision]);

  const creditItems = useMemo(() => [
    {
      id: 'conclusion',
      title: '审批结论',
      status: credit.status,
      tone: 'success',
      blocked: !credit.allowProjectSetup,
      owner: '业务负责人',
      evidence: credit.approvalOpinion,
      impact: credit.allowProjectSetupText,
      nextAction: '授信通过后进入项目工单，后续消耗占额和应收在工单内继续跟进。',
    },
    {
      id: 'quota',
      title: '额度配置',
      status: '可立项',
      tone: 'success',
      blocked: false,
      owner: '业务负责人',
      evidence: `总额度 ${credit.totalCredit}，可用额度 ${credit.availableCredit}，已用额度 ${credit.usedCredit}`,
      impact: '可用额度足够支持本轮小预算素材测试。',
      nextAction: '立项后按项目消耗占额继续复核额度。',
    },
    {
      id: 'risk',
      title: '账期与风险',
      status: credit.riskLevel,
      tone: 'success',
      blocked: false,
      owner: '交付负责人',
      evidence: `账期 ${credit.accountPeriod}，保证金比例 ${credit.depositRatio}，日消耗上限 ${credit.dailySpendLimit}`,
      impact: credit.parameterNote,
      nextAction: '放量前复核回款与素材授权状态。',
    },
  ], [credit]);

  const selectedPayment = paymentItems.find((item) => item.id === selectedPaymentId);
  const selectedCredit = creditItems.find((item) => item.id === selectedCreditId);
  const firstBlockingCheck = checks.find((check) => check.blocksLaunch) || checks.find((check) => !check.completed) || checks[0];

  const moduleCards = [
    {
      title: '启动前检查',
      status: conclusion.status,
      tone: conclusion.blockingCount > 0 ? 'danger' : 'success',
      judgement: conclusion.nextStepLabel,
      concern: conclusion.blockingCount > 0 ? `${conclusion.blockingCount} 项缺口会影响启动准备，优先核对广告账户、授权材料和 Business Center 权限。` : '暂无关键缺口，保持基础资产可用即可。',
      hasConcern: conclusion.blockingCount > 0,
    },
    {
      title: '账户与扣款',
      status: decision.status,
      tone: 'success',
      judgement: '回款账户与自动扣款授权状态可用。',
      concern: decision.blockingReason === '无硬阻塞' ? project.scopeNote : decision.blockingReason,
      hasConcern: decision.blockingReason !== '无硬阻塞',
    },
    {
      title: '授信审批',
      status: credit.status,
      tone: 'success',
      judgement: credit.approvalConclusion,
      concern: `可用额度 ${credit.availableCredit}，风险等级 ${credit.riskLevel}；放量前复核回款和素材授权状态。`,
      hasConcern: !credit.allowProjectSetup,
    },
  ];

  const launchColumns = [
    {
      title: '分项',
      dataIndex: 'title',
      width: 240,
      render: (_, check) => (
        <div style={rhythm.rowCell}>
          <Text strong>{check.title}</Text>
          <Text type="secondary">{check.group} / {check.owner}</Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (_, check) => statusTag(check.status, check.tone),
    },
    {
      title: '是否阻塞',
      dataIndex: 'blocksLaunch',
      width: 120,
      render: (blocksLaunch) => statusTag(blocksLaunch ? '阻塞' : '不阻塞', blocksLaunch ? 'danger' : 'success'),
    },
    {
      title: '说明',
      dataIndex: 'evidence',
      render: (_, check) => compactText(getCheckGapText(check), 2),
    },
  ];

  const lightweightColumns = [
    {
      title: '分项',
      dataIndex: 'title',
      width: 240,
      render: (_, item) => (
        <div style={rhythm.rowCell}>
          <Text strong>{item.title}</Text>
          <Text type="secondary">{item.owner}</Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (_, item) => statusTag(item.status, item.tone),
    },
    {
      title: '是否阻塞',
      dataIndex: 'blocked',
      width: 120,
      render: (blocked) => statusTag(blocked ? '阻塞' : '不阻塞', blocked ? 'danger' : 'success'),
    },
    {
      title: '说明',
      dataIndex: 'evidence',
      render: (evidence) => compactText(evidence, 2),
    },
  ];

  const tableRowStyle = (isSelected) => ({
    cursor: 'pointer',
    background: isSelected ? '#f5f8ff' : undefined,
  });

  const tabItems = [
    {
      key: 'launch',
      label: '启动前检查',
      children: (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <TabConclusion
            title="启动前检查结论"
            status={conclusion.status}
            tone={conclusion.blockingCount > 0 ? 'danger' : 'success'}
            description={conclusion.summary}
            actionLabel="定位需关注项"
            onAction={() => setSelectedLaunchId(firstBlockingCheck?.id)}
          />
          <Card size="small" title="分项明细" styles={{ body: rhythm.tableBody }}>
            <Table
              rowKey="id"
              size="small"
              columns={launchColumns}
              dataSource={checks}
              pagination={false}
              scroll={{ x: 780 }}
              tableLayout="fixed"
              rowClassName={(check) => (check.id === selectedLaunchId ? 'ant-table-row-selected' : '')}
              onRow={(check) => ({
                onClick: () => setSelectedLaunchId(check.id),
                style: tableRowStyle(check.id === selectedLaunchId),
              })}
            />
          </Card>
          <DetailPanel
            selectedItem={
              selectedLaunch
                ? {
                    title: selectedLaunch.title,
                    status: selectedLaunch.status,
                    tone: selectedLaunch.tone,
                    evidence: selectedLaunch.evidence,
                    impact: selectedLaunch.impact,
                    nextAction: selectedLaunch.nextAction,
                  }
                : null
            }
          />
        </Space>
      ),
    },
    {
      key: 'payment',
      label: '账户与扣款',
      children: (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <TabConclusion
            title="账户与扣款结论"
            status={decision.status}
            tone="success"
            description={decision.reason}
            actionLabel="查看授权边界"
            onAction={() => setSelectedPaymentId('authorization')}
          />
          <Card size="small" title="分项明细" styles={{ body: rhythm.tableBody }}>
            <Table
              rowKey="id"
              size="small"
              columns={lightweightColumns}
              dataSource={paymentItems}
              pagination={false}
              scroll={{ x: 780 }}
              tableLayout="fixed"
              rowClassName={(item) => (item.id === selectedPaymentId ? 'ant-table-row-selected' : '')}
              onRow={(item) => ({
                onClick: () => setSelectedPaymentId(item.id),
                style: tableRowStyle(item.id === selectedPaymentId),
              })}
            />
          </Card>
          <DetailPanel selectedItem={selectedPayment} />
        </Space>
      ),
    },
    {
      key: 'credit',
      label: '授信审批',
      children: (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <TabConclusion
            title="授信审批结论"
            status={credit.status}
            tone="success"
            description={credit.approvalOpinion}
            actionLabel="查看额度配置"
            onAction={() => setSelectedCreditId('quota')}
          />
          <Card size="small" title="分项明细" styles={{ body: rhythm.tableBody }}>
            <Table
              rowKey="id"
              size="small"
              columns={lightweightColumns}
              dataSource={creditItems}
              pagination={false}
              scroll={{ x: 780 }}
              tableLayout="fixed"
              rowClassName={(item) => (item.id === selectedCreditId ? 'ant-table-row-selected' : '')}
              onRow={(item) => ({
                onClick: () => setSelectedCreditId(item.id),
                style: tableRowStyle(item.id === selectedCreditId),
              })}
            />
          </Card>
          <DetailPanel selectedItem={selectedCredit} />
        </Space>
      ),
    },
  ];

  return (
    <section className="page startup-preparation-page" style={rhythm.page}>
      <Card style={{ borderColor: '#dfe5ee' }} styles={{ body: rhythm.headerBody }}>
        <Row gutter={[16, 12]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={5}>
              <Text type="secondary">客户准入 / {page.phase}</Text>
              <Title level={3} style={{ margin: 0 }}>
                {page.title}
              </Title>
              <Space size={[8, 8]} wrap>
                <Tag>当前客户：{customer.name}</Tag>
                {statusTag(conclusion.blockingCount > 0 ? '存在需关注项' : '准备信息可用', conclusion.blockingCount > 0 ? 'warning' : 'success')}
                <Tag>并列准备模块：3 项</Tag>
              </Space>
            </Space>
          </Col>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={() => onNavigate?.('customer-admission')}>
              返回客户准入
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[12, 12]} align="stretch">
        {moduleCards.map((module) => (
          <Col xs={24} md={8} key={module.title} style={{ display: 'flex' }}>
            <ModuleStatusCard module={module} />
          </Col>
        ))}
      </Row>

      <Card title="准备模块详情" styles={{ body: rhythm.tabShellBody }}>
        <Tabs size="small" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </section>
  );
}
