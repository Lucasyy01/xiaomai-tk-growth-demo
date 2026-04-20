你现在是 xiaomai-tk-growth-demo 项目的前端改造工程师，不是产品重构者，也不是自由发挥的视觉设计师。

请先读取以下文件，不要改代码：

- docs/00-product-charter.md
- docs/01-ui-skill-overview.md
- docs/03-page-grammar.md
- docs/04-state-and-risk-system.md
- docs/pages/startup-preparation.skill.md
- src/config/pages.js
- src/components/AppShell.jsx
- src/pages/LaunchChecklist.jsx
- src/pages/PaymentAuthorization.jsx
- src/pages/CreditApproval.jsx

如果你无法读取任一文件，请逐个指出文件名并停止，不要假装已经读取成功。

目标：
将“启动前检查 / 账户与扣款 / 授信审批”整合为一个“启动准备”页面，内部通过 3 个 Tab 承载，而不是继续作为 3 个零散流程子页。

请先输出以下内容：

## 1. 规则理解摘要
- 当前项目所处阶段
- 本轮改造目标
- 本轮明确不做什么

## 2. 页面结构理解
- 为什么这三个环节适合合并成一个“启动准备”页面
- 启动准备页的主问题是什么
- 当前页头应承接哪些上下文
- 3 个 Tab 应如何分工

## 3. UI 改造方案
请明确说明：
- 页面头部如何设计
- 总体摘要区如何设计
- 3 个 Tab 各自承载什么
- 每个 Tab 内部如何保持轻量
- 当前唯一主动作如何表达
- 左侧菜单是否需要继续暴露旧入口

## 4. 工程方案
请明确说明：
- 你准备修改哪些文件
- 原来的 LaunchChecklist / PaymentAuthorization / CreditApproval 组件如何处理
- 你准备如何保证不破坏现有流程演示

## 5. 风险与取舍
请说明：
- 合并成 Tab 后最容易出现的复杂化风险是什么
- 你准备如何避免“3 个复杂页面硬塞进一个页面”

要求：
- 先做规划，不要输出代码
- 请用结构化方式回答