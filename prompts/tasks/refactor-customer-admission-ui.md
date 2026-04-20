请读取以下文件，并严格基于这些规则改造页面：

- docs/00-product-charter.md
- docs/01-ui-skill-overview.md
- docs/03-page-grammar.md
- docs/04-state-and-risk-system.md
- docs/pages/customer-admission.skill.md

目标：
对 `src/pages/CustomerAdmission.jsx` 做第一轮 UI 结构化优化，使其更像成熟 SaaS 后台，而不是 demo 原型。

要求：
1. 保留当前页面的核心业务含义
2. 不要把页面改成营销页、大屏或过度装饰风格
3. 使用 antd 组件优先替换当前自定义卡片、标签、列表和详情结构
4. 页面要更突出：
   - 当前状态
   - 商机评分 / 优先级
   - 风险 / 缺口
   - 下一步动作
5. 主列表优先使用 Table
6. 详情区优先使用 Card / Descriptions / Alert / Tag
7. 尽量减少对旧 styles.css 的依赖
8. 不要一次性深改业务逻辑，当前阶段重点是 UI 结构成熟化
9. 输出完整可运行代码
10. 最后说明：
   - 改了哪些组件
   - 哪些旧 class 可以删
   - 为什么这版更像成熟 SaaS
