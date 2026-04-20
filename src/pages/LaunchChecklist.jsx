import { useState } from 'react';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Descriptions from 'antd/es/descriptions';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Statistic from 'antd/es/statistic';
import Table from 'antd/es/table';
import Tag from 'antd/es/tag';
import Typography from 'antd/es/typography';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { launchChecklistDetail } from '../data/mockData.js';

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
  page: { gap: 16 },
  cardBody: { padding: 18 },
  headerCard: { borderColor: '#dfe5ee' },
  decisionCard: { height: '100%', borderColor: '#fed7aa', background: '#fffaf2' },
  customerCard: { height: '100%' },
  metricCard: { width: '100%', height: '100%', minHeight: 138 },
  metricBody: { height: '100%', display: 'flex', flexDirection: 'column', gap: 10, padding: 18 },
  metricTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  metricMeta: { minHeight: 40, margin: 0 },
  tableCellStack: { width: '100%', minHeight: 50, justifyContent: 'center' },
  detailCard: { height: '100%' },
  detailBody: { minHeight: 136, display: 'grid', gap: 8, alignContent: 'start' },
  primaryActionWrap: { display: 'flex', justifyContent: 'flex-start', marginTop: 4 },
};

function resolveTone(status, tone) {
  if (tone) return toneMap[tone] || tone;
  if (['已通过', '已完成', '可推进', '正常'].includes(status)) return 'success';
  if (['执行中', '检查中'].includes(status)) return 'processing';
  if (['待检查', '待补资料', '待确认', '待授权'].includes(status)) return 'warning';
  if (['已阻塞', '已驳回', '已逾期', '不允许下一步'].includes(status)) return 'error';
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

function getGapText(check) {
  if (check.completed) return '暂无关键缺口';
  return check.evidence || check.nextAction;
}

export default function LaunchChecklist({ page, onNavigate }) {
  const { checks, conclusion, customer } = launchChecklistDetail;
  const [selectedCheckId, setSelectedCheckId] = useState(null);
  const selectedCheck = checks.find((check) => check.id === selectedCheckId);

  const summaryMetrics = [
    {
      title: '已完成',
      value: `${conclusion.completedCount} / ${conclusion.totalCount}`,
      status: '已通过',
      tone: 'success',
      meta: '店铺、账号、承接链路和归因准备已具备基础。',
    },
    {
      title: '未完成',
      value: `${conclusion.incompleteCount} 项`,
      status: '待补资料',
      tone: 'warning',
      meta: '集中在广告账户、广告授权和 Business Center 权限。',
    },
    {
      title: '阻塞',
      value: `${conclusion.blockingCount} 项`,
      status: '已阻塞',
      tone: 'danger',
      meta: '这些缺口会影响测试广告组配置和素材投放。',
    },
  ];

  const primaryAction = conclusion.allowNextStep
    ? {
        label: '进入账户与扣款授权',
        target: 'payment-authorization',
        icon: <ArrowRightOutlined />,
      }
    : {
        label: '返回客户准入',
        target: 'customer-admission',
        icon: <ArrowLeftOutlined />,
      };

  const columns = [
    {
      title: '检查项',
      dataIndex: 'title',
      width: 260,
      render: (_, check) => (
        <Space direction="vertical" size={4} style={rhythm.tableCellStack}>
          <Text strong>{check.title}</Text>
          <Text type="secondary">{check.group} / {check.owner}</Text>
        </Space>
      ),
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      width: 132,
      render: (_, check) => statusTag(check.status, check.tone),
    },
    {
      title: '是否阻塞',
      dataIndex: 'blocksLaunch',
      width: 132,
      render: (blocksLaunch) => statusTag(blocksLaunch ? '阻塞' : '不阻塞', blocksLaunch ? 'danger' : 'success'),
    },
    {
      title: '缺口说明',
      dataIndex: 'evidence',
      render: (_, check) => compactText(getGapText(check), 2),
    },
  ];

  return (
    <section className="page launch-page" style={rhythm.page}>
      <Card style={rhythm.headerCard} styles={{ body: rhythm.cardBody }}>
        <Space direction="vertical" size={8}>
          <Text type="secondary">客户准入 / {page.phase}</Text>
          <Title level={2} style={{ margin: 0 }}>
            {page.title}
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 780, margin: 0 }}>
            {page.objective}
          </Paragraph>
          <Space size={[8, 8]} wrap>
            <Tag color="processing">{page.priority}</Tag>
            <Tag color="processing">流程子页</Tag>
            {statusTag(conclusion.status)}
            <Tag>当前对象：{customer.name}</Tag>
          </Space>
        </Space>
      </Card>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} xl={16}>
          <Card title="总体结论" extra={statusTag(conclusion.status)} style={rhythm.decisionCard} styles={{ body: rhythm.cardBody }}>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <div>
                <Text type="secondary">启动判断</Text>
                <Title level={3} style={{ margin: '4px 0 0' }}>
                  {conclusion.nextStepLabel}
                </Title>
              </div>
              <Paragraph style={{ margin: 0 }}>{conclusion.summary}</Paragraph>
              <Text type="secondary">{conclusion.riskTip}</Text>
              <div style={rhythm.primaryActionWrap}>
                <Button type="primary" icon={primaryAction.icon} onClick={() => onNavigate?.(primaryAction.target)}>
                  {primaryAction.label}
                </Button>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="当前客户" style={rhythm.customerCard} styles={{ body: rhythm.cardBody }}>
            <Descriptions
              size="small"
              column={1}
              items={[
                { key: 'name', label: '客户', children: customer.name },
                { key: 'source', label: '来源', children: customer.source },
                { key: 'category', label: '品类 / 市场', children: customer.categoryMarket },
                { key: 'start', label: '目标启动日', children: customer.requestedStart },
                { key: 'goal', label: '服务目标', children: customer.serviceGoal },
                { key: 'owner', label: '负责人', children: customer.owner },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
        {summaryMetrics.map((metric) => (
          <Col xs={24} md={8} key={metric.title} style={{ display: 'flex' }}>
            <Card style={rhythm.metricCard} styles={{ body: rhythm.metricBody }}>
              <div style={rhythm.metricTop}>
                <Text type="secondary">{metric.title}</Text>
                {statusTag(metric.status, metric.tone)}
              </div>
              <Statistic value={metric.value} valueStyle={{ fontSize: 28, lineHeight: 1.2 }} />
              <Paragraph type="secondary" ellipsis={{ rows: 2, tooltip: metric.meta }} style={rhythm.metricMeta}>
                {metric.meta}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="分项明细"
        extra={<Text type="secondary">选择检查项查看详细说明</Text>}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={checks}
          pagination={false}
          scroll={{ x: 820 }}
          tableLayout="fixed"
          rowClassName={(check) => (check.id === selectedCheckId ? 'ant-table-row-selected' : '')}
          onRow={(check) => ({
            onClick: () => setSelectedCheckId(check.id),
            style: {
              cursor: 'pointer',
              background: check.id === selectedCheckId ? '#fff7ed' : undefined,
            },
          })}
        />
      </Card>

      {selectedCheck ? (
        <Card title={`详细说明：${selectedCheck.title}`} extra={statusTag(selectedCheck.status, selectedCheck.tone)}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size="small" title="当前依据" style={rhythm.detailCard} styles={{ body: rhythm.detailBody }}>
                {compactText(selectedCheck.evidence, 4)}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="对启动的影响" style={rhythm.detailCard} styles={{ body: rhythm.detailBody }}>
                {compactText(selectedCheck.impact, 4)}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="处理建议" style={rhythm.detailCard} styles={{ body: rhythm.detailBody }}>
                {compactText(selectedCheck.nextAction, 4)}
              </Card>
            </Col>
          </Row>
        </Card>
      ) : null}
    </section>
  );
}
