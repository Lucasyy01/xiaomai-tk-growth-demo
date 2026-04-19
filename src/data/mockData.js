export const demoSummary = {
  productName: '小麦云 TK 视频营销增长平台',
  subtitle: '品牌型卖家 TikTok 视频营销增长服务中台',
  activeClient: 'GlowLab Beauty',
  activeProject: 'TikTok US 素材测试与放量项目',
  owner: '增长交付组 / Mia',
};

export const projectSnapshot = {
  projectName: 'TikTok US 素材测试与放量项目',
  clientName: 'GlowLab Beauty',
  projectType: '品牌型卖家增长服务',
  currentStage: '执行中',
  owner: 'Mia Chen',
  cycle: '2026-04-01 至 2026-05-15',
  nextAction: '完成 3 条已通过素材的授权确认，并进入小预算测试。',
};

export const phaseSteps = ['待立项', '待执行', '执行中', '待授权', '待投放', '待回款', '已完成', '已暂停'];

export const shellMetrics = [
  {
    title: '客户状态',
    value: '可立项',
    status: '可立项',
    meta: '准入、启动准备、账户授权已具备基础条件',
  },
  {
    title: '授信额度',
    value: '¥300,000',
    status: '已通过',
    meta: '已用 ¥84,200，可用 ¥215,800',
  },
  {
    title: '素材资产',
    value: '18 条',
    status: '待授权',
    meta: '已授权 6，待测试 5，放量中 2',
  },
  {
    title: '账单回款',
    value: '¥42,800',
    status: '部分回款',
    meta: '最近一次自动扣款成功 ¥20,000',
  },
];

export const pageSkeletonItems = {
  'customer-admission': ['客户列表', '客户摘要', '推进建议', '发起启动前检查'],
  'launch-checklist': ['检查项列表', '检查结果摘要', '风险提示', '继续推进判断'],
  'payment-authorization': ['账户平台类型', '绑定状态', '授权状态', '最近一次授权结果'],
  'credit-approval': ['客户经营摘要', '授信参数', '风险说明', '审批结论'],
  'project-workorder': ['项目头部信息', '阶段推进区', '关键对象摘要', '风险与操作日志'],
  'creator-assets': ['达人合作 Tab', '素材资产 Tab', '授权状态', '测试与放量状态'],
  'billing-collection': ['账单汇总', '回款与核销', '自动扣款设置', '风险提醒'],
  'customer-portal': ['我的项目', '待确认内容', '本周期结果', '待支付账单'],
};

export const routeHints = {
  'creator-assets': '从项目工单页进入后查看达人合作与素材资产明细。',
  'billing-collection': '从项目工单页进入后查看平台应收、自动扣款和回款核销。',
  'customer-portal': '从项目工单页进入后预览客户参与确认与支付的轻门户。',
};
