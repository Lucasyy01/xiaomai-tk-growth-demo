import { useMemo, useState } from 'react';
import Alert from 'antd/es/alert';
import Badge from 'antd/es/badge';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Descriptions from 'antd/es/descriptions';
import Empty from 'antd/es/empty';
import Progress from 'antd/es/progress';
import Row from 'antd/es/row';
import Segmented from 'antd/es/segmented';
import Space from 'antd/es/space';
import Statistic from 'antd/es/statistic';
import Table from 'antd/es/table';
import Tag from 'antd/es/tag';
import Typography from 'antd/es/typography';
import { ArrowRightOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { customerAdmissionDetail } from '../data/mockData.js';

const { Paragraph, Text, Title } = Typography;

const filterOrder = ['全部', '可推进', '待授信', '待评估', '待观察'];
const successStatuses = ['可推进', '已完成', '已通过', '正常'];

const toneMap = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  error: 'error',
  neutral: 'default',
  accent: 'processing',
  processing: 'processing',
};

const rhythm = {
  page: { gap: 16 },
  compactCardBody: { padding: 18 },
  compactAlert: { padding: '10px 12px' },
  metricCard: { width: '100%', height: '100%', minHeight: 166 },
  metricBody: { height: '100%', display: 'flex', flexDirection: 'column', gap: 10, padding: 18 },
  metricHeader: { minHeight: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  metricValue: { minHeight: 48, display: 'flex', alignItems: 'center' },
  metricMeta: { minHeight: 44, margin: 0 },
  tableCellStack: { width: '100%', minHeight: 54, justifyContent: 'center' },
  detailSection: { display: 'grid', gap: 8 },
};

function resolveTone(status, tone) {
  if (tone) return toneMap[tone] || tone;
  if (successStatuses.includes(status)) return 'success';
  if (['执行中', '检查中'].includes(status)) return 'processing';
  if (['待授信', '待授权', '待评估', '待确认', '待补资料', '待观察'].includes(status)) return 'warning';
  if (['已阻塞', '已失败', '已逾期', '不通过'].includes(status)) return 'error';
  return 'default';
}

function statusTag(status, tone) {
  const resolvedTone = resolveTone(status, tone);
  return <Tag color={resolvedTone === 'default' ? undefined : resolvedTone}>{status}</Tag>;
}

function getCustomerGaps(customer) {
  const dimensionGaps = customer.dimensions
    .filter((dimension) => resolveTone(dimension.status, dimension.tone) !== 'success')
    .map((dimension) => `${dimension.label}: ${dimension.value}`);

  if (dimensionGaps.length > 0) return dimensionGaps;
  if (customer.status !== '可推进') return [customer.status];
  return [];
}

function getRiskAlertType(customer, gaps) {
  if (customer.status === '可推进' && gaps.length === 0) return 'success';
  if (customer.status === '待观察') return 'info';
  return 'warning';
}

function getRiskMessage(customer, gaps) {
  if (customer.status === '可推进' && gaps.length === 0) return '当前可进入启动准备';
  if (customer.status === '待观察') return '当前建议保留观察';
  return `当前仍有 ${gaps.length || 1} 项缺口需要处理`;
}

function getPrimaryActionMeta(customer) {
  if (customer.status === '可推进') {
    return {
      reason: '当前客户已达到准入线，主动作是进入启动准备，统一核对启动前检查、账户与扣款、授信审批。',
      buttonText: '进入启动准备',
      disabled: false,
    };
  }

  if (customer.status === '待授信') {
    return {
      reason: '当前客户需要先在启动准备中补齐授权、账户和预算边界，再统一判断是否进入项目工单。',
      buttonText: '进入启动准备',
      disabled: false,
    };
  }

  if (customer.status === '待观察') {
    return {
      reason: '当前不建议进入后续流程，先保留观察，等待新品、内容差异点或测试窗口变得更清楚。',
      buttonText: '保留观察',
      disabled: true,
    };
  }

  return {
    reason: '当前还缺少足够判断依据，先进入启动准备查看前置缺口，再决定是否继续推进。',
    buttonText: '进入启动准备',
    disabled: !customer.target,
  };
}

function compactText(text, rows = 2) {
  return (
    <Paragraph ellipsis={{ rows, tooltip: text }} style={{ margin: 0 }}>
      {text}
    </Paragraph>
  );
}

export default function CustomerAdmission({ page, onNavigate }) {
  const { customers, summaryCards } = customerAdmissionDetail;
  const firstCustomer = customers[0];
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [selectedCustomerId, setSelectedCustomerId] = useState(firstCustomer?.id);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || firstCustomer;
  const selectedGaps = selectedCustomer ? getCustomerGaps(selectedCustomer) : [];
  const primaryAction = selectedCustomer ? getPrimaryActionMeta(selectedCustomer) : null;

  const filterOptions = useMemo(() => {
    return filterOrder.map((status) => ({
      label: `${status} ${status === '全部' ? customers.length : customers.filter((customer) => customer.status === status).length}`,
      value: status,
    }));
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (selectedStatus === '全部') return customers;
    return customers.filter((customer) => customer.status === selectedStatus);
  }, [customers, selectedStatus]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    const nextPool = value === '全部' ? customers : customers.filter((customer) => customer.status === value);

    if (nextPool.length > 0 && !nextPool.some((customer) => customer.id === selectedCustomerId)) {
      setSelectedCustomerId(nextPool[0].id);
    }
  };

  const openCustomerNextAction = (customer = selectedCustomer) => {
    if (customer && !getPrimaryActionMeta(customer).disabled && onNavigate) {
      onNavigate('startup-preparation');
    }
  };

  const columns = [
    {
      title: '客户 / 来源',
      dataIndex: 'name',
      width: 230,
      render: (_, customer) => (
        <Space direction="vertical" size={4} style={rhythm.tableCellStack}>
          <Text strong>{customer.name}</Text>
          <Text type="secondary">{customer.source} / {customer.owner}</Text>
          <Tag style={{ width: 'fit-content' }}>{customer.tags[0]}</Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 124,
      render: (_, customer) => (
        <Space direction="vertical" size={6} style={rhythm.tableCellStack}>
          {statusTag(customer.status, customer.statusTone)}
          <Text type="secondary">{customer.priority}</Text>
        </Space>
      ),
    },
    {
      title: '商机评分',
      dataIndex: 'score',
      width: 142,
      sorter: (a, b) => a.score - b.score,
      render: (score) => (
        <Space direction="vertical" size={6} style={rhythm.tableCellStack}>
          <Text strong>{score}</Text>
          <Progress percent={score} showInfo={false} strokeColor={score >= 78 ? '#1677ff' : '#faad14'} size="small" />
        </Space>
      ),
    },
    {
      title: '品类与市场',
      dataIndex: 'category',
      width: 160,
      render: (_, customer) => (
        <Space direction="vertical" size={4} style={rhythm.tableCellStack}>
          <Text>{customer.category}</Text>
          <Text type="secondary">{customer.market}</Text>
        </Space>
      ),
    },
    {
      title: '风险 / 缺口',
      dataIndex: 'dimensions',
      width: 200,
      render: (_, customer) => {
        const gaps = getCustomerGaps(customer);

        if (gaps.length === 0) {
          return (
            <Space direction="vertical" size={4} style={rhythm.tableCellStack}>
              <Badge status="success" text="暂无关键缺口" />
              <Text type="secondary">可进入下一步核对</Text>
            </Space>
          );
        }

        return (
          <Space direction="vertical" size={4} style={rhythm.tableCellStack}>
            <Badge status={customer.status === '待观察' ? 'default' : 'warning'} text={`${gaps.length} 项需关注`} />
            <Text type="secondary" ellipsis style={{ maxWidth: 170 }}>
              {gaps[0]}
            </Text>
          </Space>
        );
      },
    },
    {
      title: '判断依据',
      dataIndex: 'reason',
      ellipsis: true,
      render: (reason) => <Text ellipsis>{reason}</Text>,
    },
    {
      title: '建议动作',
      dataIndex: 'nextAction',
      width: 150,
      render: (nextAction) => <Text type="secondary">{nextAction}</Text>,
    },
  ];

  if (!selectedCustomer) {
    return (
      <section className="page customer-admission-page" style={rhythm.page}>
        <Empty description="暂无客户准入数据" />
      </section>
    );
  }

  return (
    <section className="page customer-admission-page" style={rhythm.page}>
      <Card styles={{ body: rhythm.compactCardBody }}>
        <Row gutter={[24, 16]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={8}>
              <Text type="secondary">{page.phase}</Text>
              <Title level={2} style={{ margin: 0 }}>
                {page.title}
              </Title>
              <Paragraph type="secondary" style={{ maxWidth: 760, margin: 0 }}>
                {page.objective}
              </Paragraph>
              <Space size={[8, 8]} wrap>
                <Tag color="processing">{page.priority}</Tag>
                <Tag color="processing">客户准入判断</Tag>
                {statusTag(page.status)}
                <Tag>当前对象：{selectedCustomer.name}</Tag>
              </Space>
            </Space>
          </Col>
          <Col>
            <Tag color="default">唯一主动作在右侧详情区</Tag>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} xl={6} key={card.title} style={{ display: 'flex' }}>
            <Card style={rhythm.metricCard} styles={{ body: rhythm.metricBody }}>
              <div style={rhythm.metricHeader}>
                <Text type="secondary">{card.title}</Text>
                {statusTag(card.status, card.tone)}
              </div>
              <div style={rhythm.metricValue}>
                <Statistic value={card.value} valueStyle={{ fontSize: 30, lineHeight: 1.2 }} />
              </div>
              <Paragraph type="secondary" ellipsis={{ rows: 2, tooltip: card.meta }} style={rhythm.metricMeta}>
                {card.meta}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} xl={16}>
          <Card
            title="待判断客户池"
            extra={
              <Segmented
                value={selectedStatus}
                options={filterOptions}
                onChange={handleStatusChange}
                aria-label="客户状态筛选"
              />
            }
            styles={{ body: { padding: 0 } }}
          >
            <Table
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={filteredCustomers}
              pagination={false}
              scroll={{ x: 1120 }}
              tableLayout="fixed"
              rowClassName={(customer) => (customer.id === selectedCustomer.id ? 'ant-table-row-selected' : '')}
              onRow={(customer) => ({
                onClick: () => setSelectedCustomerId(customer.id),
                style: {
                  cursor: 'pointer',
                  background: customer.id === selectedCustomer.id ? '#f0fdfa' : undefined,
                },
              })}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title={selectedCustomer.name}
            extra={statusTag(selectedCustomer.status, selectedCustomer.statusTone)}
            styles={{ body: rhythm.compactCardBody }}
          >
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <Alert
                showIcon
                type={getRiskAlertType(selectedCustomer, selectedGaps)}
                message={getRiskMessage(selectedCustomer, selectedGaps)}
                description={primaryAction.reason}
                style={rhythm.compactAlert}
              />

              <Descriptions
                size="small"
                column={1}
                items={[
                  { key: 'score', label: '商机评分', children: `${selectedCustomer.score} / 100` },
                  { key: 'priority', label: '优先级', children: selectedCustomer.priority },
                  { key: 'category', label: '品类市场', children: `${selectedCustomer.category} / ${selectedCustomer.market}` },
                  { key: 'owner', label: '负责人', children: selectedCustomer.owner },
                  { key: 'source', label: '来源', children: selectedCustomer.source },
                ]}
              />

              <div style={rhythm.detailSection}>
                <Text strong>风险摘要</Text>
                <Space size={[6, 6]} wrap>
                  {selectedCustomer.dimensions.map((dimension) => {
                    const tone = resolveTone(dimension.status, dimension.tone);
                    return (
                      <Tag key={dimension.label} color={tone === 'default' ? undefined : tone}>
                        {dimension.label}：{dimension.status}
                      </Tag>
                    );
                  })}
                </Space>
                <Text type="secondary">
                  {selectedGaps.length > 0 ? selectedGaps.join('；') : '当前关键维度未发现明显阻塞，可进入下一步核对。'}
                </Text>
              </div>

              <div style={rhythm.detailSection}>
                <Text strong>判断依据</Text>
                {compactText(selectedCustomer.reason, 2)}
                <Text type="secondary">{selectedCustomer.history}</Text>
              </div>

              <Space size={[6, 6]} wrap>
                {selectedCustomer.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>

              <Button type="primary" block icon={<ArrowRightOutlined />} disabled={primaryAction.disabled} onClick={() => openCustomerNextAction()}>
                {primaryAction.buttonText}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
