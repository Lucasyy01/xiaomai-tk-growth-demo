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

export const phaseDetails = [
  {
    stage: '待立项',
    description: '确认客户准入、启动检查、账户授权和授信结论是否具备立项条件。',
    nextAction: '核对项目目标、预算边界和交付周期，确认后创建工单。',
  },
  {
    stage: '待执行',
    description: '项目已创建，等待交付负责人拆解任务并分配脚本、达人、素材和投放动作。',
    nextAction: '完成任务拆解，明确负责人、截止时间和风险关注项。',
  },
  {
    stage: '执行中',
    description: '脚本、达人建联、视频交付、授权推进和投放准备正在并行推进。',
    nextAction: '优先处理素材授权阻塞，并把测试素材推进到小预算投放。',
  },
  {
    stage: '待授权',
    description: '内容交付已形成可用素材，等待品牌确认广告使用授权。',
    nextAction: '推动品牌法务确认授权周期、授权范围和可投放渠道。',
  },
  {
    stage: '待投放',
    description: '素材授权已完成，等待投放侧完成测试计划、预算拆分和账户配置。',
    nextAction: '启动小预算测试，观察素材前 24 小时表现。',
  },
  {
    stage: '待回款',
    description: '项目已形成平台应收，需要跟进自动扣款、回款确认和核销状态。',
    nextAction: '核对待收金额，确认自动扣款授权仍然有效。',
  },
  {
    stage: '已完成',
    description: '本周期投放、账单、回款和复盘动作已完成。',
    nextAction: '沉淀复盘结论，判断是否进入续投或新周期。',
  },
  {
    stage: '已暂停',
    description: '项目因风险、授权、回款或客户侧原因暂停推进。',
    nextAction: '定位暂停原因，明确恢复条件和责任人。',
  },
];

export const workorderOverview = {
  customer: {
    name: 'GlowLab Beauty',
    status: '可立项',
    creditStatus: '已通过',
    riskStatus: '关注授权',
    totalCredit: '¥300,000',
    usedCredit: '¥84,200',
    availableCredit: '¥215,800',
    creditUsage: '28.1%',
  },
  nextActions: [
    {
      title: '推进素材授权',
      value: '3 条待确认',
      status: '待授权',
      meta: '品牌法务需确认广告使用授权周期',
      target: 'creator-assets',
    },
    {
      title: '处理阻塞任务',
      value: '2 项风险',
      status: '已阻塞',
      meta: '视频交付超时、授权推进卡住',
    },
    {
      title: '跟进待收金额',
      value: '¥22,800',
      status: '部分回款',
      meta: '最近一次自动扣款成功，仍有待收',
      target: 'billing-collection',
    },
  ],
};

export const executionTasks = [
  {
    id: 'script',
    type: '脚本',
    owner: 'Nora',
    deadline: '04-20 18:00',
    status: '待审核',
    risk: '脚本二稿待品牌确认',
    detail: '3 条产品卖点脚本已完成二稿，等待品牌侧确认是否保留对比型开头。',
    nextStep: '今天内确认脚本口径，避免影响达人拍摄排期。',
    dependency: '依赖品牌内容审核反馈',
  },
  {
    id: 'creator-outreach',
    type: '达人建联',
    owner: 'Leo',
    deadline: '04-22 20:00',
    status: '进行中',
    risk: '3 位重点达人未回复',
    detail: '已触达 18 位美妆垂类达人，其中 7 位有明确档期，3 位重点达人仍未回复。',
    nextStep: '补充 5 位备选达人，并对重点达人发起二次触达。',
    dependency: '依赖达人回复和样品寄送确认',
  },
  {
    id: 'video-delivery',
    type: '视频交付',
    owner: 'Ivy',
    deadline: '04-19 18:00',
    status: '已超时',
    risk: '2 条视频晚于计划 1 天',
    detail: '原计划今天完成 5 条视频交付，目前已收 3 条，剩余 2 条受拍摄档期影响延迟。',
    nextStep: '确认新交付时间，并判断是否启用备选达人素材。',
    dependency: '依赖达人补拍和交付文件上传',
  },
  {
    id: 'authorization',
    type: '授权推进',
    owner: 'Mia',
    deadline: '04-21 12:00',
    status: '已阻塞',
    risk: '品牌法务未确认授权周期',
    detail: '3 条已通过素材尚未取得广告使用授权，当前无法进入小预算测试。',
    nextStep: '推动品牌法务确认 90 天广告使用授权，并同步授权范围。',
    dependency: '依赖客户法务确认',
  },
  {
    id: 'ad-launch',
    type: '投放',
    owner: 'Ken',
    deadline: '04-24 10:00',
    status: '待开始',
    risk: '等待授权后进入测试',
    detail: '投放计划已配置 2 个测试广告组，预算等待素材授权后释放。',
    nextStep: '授权完成后启动小预算测试，首日控制消耗不超过 ¥8,000。',
    dependency: '依赖素材授权状态',
  },
  {
    id: 'collection',
    type: '回款跟进',
    owner: 'Finance / Yun',
    deadline: '04-26 16:00',
    status: '部分回款',
    risk: '待收 ¥22,800',
    detail: '本周期平台应收 ¥42,800，已通过自动扣款回收 ¥20,000。',
    nextStep: '在投放消耗继续占额前，提醒客户确认待收金额。',
    dependency: '依赖客户账户余额和扣款授权有效性',
  },
];

export const creatorSummary = {
  status: '待授权',
  nextAction: '优先跟进待授权合作单，避免素材卡在可投放前一步。',
  metrics: [
    { label: '待回复数', value: '3' },
    { label: '待寄样数', value: '2' },
    { label: '待交付数', value: '4' },
    { label: '待授权数', value: '5' },
  ],
};

export const assetSummary = {
  status: '待授权',
  nextAction: '把已通过素材推进到已授权，再进入待测试和放量判断。',
  metrics: [
    { label: '总素材数', value: '18' },
    { label: '已授权数', value: '6' },
    { label: '待测试数', value: '5' },
    { label: '测试通过数', value: '3' },
    { label: '放量中数', value: '2' },
    { label: '不建议复投数', value: '1' },
  ],
  ladder: [
    '已通过：内容质量达标',
    '已授权：允许广告使用',
    '可放量：测试通过并进入预算放大',
  ],
};

export const spendSummary = {
  status: '额度安全',
  todaySpend: '¥6,420',
  totalSpend: '¥84,200',
  creditOccupancy: '28.1%',
  limitWarning: '暂无额度预警',
};

export const billingSummary = {
  status: '部分回款',
  receivable: '¥42,800',
  received: '¥20,000',
  pending: '¥22,800',
  lastDeduction: '成功 ¥20,000 / 04-18 10:26',
  autoDebitStatus: '已授权',
};

export const workorderLogs = [
  { time: '今天 10:30', title: 'Mia 更新项目阶段为执行中', status: '操作日志' },
  { time: '今天 09:20', title: 'Ivy 标记 2 条视频交付超时', status: '已超时' },
  { time: '昨天 18:40', title: 'Finance 记录自动扣款成功 ¥20,000', status: '已授权' },
  { time: '昨天 16:05', title: '品牌法务反馈需补充授权周期说明', status: '已阻塞' },
];

export const workorderRisks = [
  {
    title: '授权推进阻塞',
    status: '已阻塞',
    description: '3 条已通过素材尚未获得广告使用授权，影响小预算测试启动。',
  },
  {
    title: '视频交付超时',
    status: '已超时',
    description: '2 条达人视频晚于原计划 1 天，需要确认新交付时间。',
  },
  {
    title: '待收金额占用额度',
    status: '部分回款',
    description: '待收 ¥22,800 会继续占用授信额度，需要在放量前跟进。',
  },
];

export const workorderBlockers = [
  '品牌法务未确认 UGC 素材广告使用授权周期',
  '2 条达人视频尚未完成最终交付',
  '待收金额 ¥22,800 需要在进入放量前明确回款安排',
];

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
