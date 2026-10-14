# 国内旅游规划产品

当前阶段：纯静态双击版继续作为视觉与通用交互参考；真实产品代码从 `frontend/`（React + Vite）和 `backend/`（Next.js API）启动。高德开放平台尚未接入。此目录是独立的旅游产品上下文，保留上层原有电商文档。

## 阅读入口

- [旅游规划产品总需求文档](./docs/specs/旅游规划产品总需求文档.md)：独立汇总全部用户修改、功能页面、规则、原型和验收要求，建议从此阅读。
- [旧版完整方案原型](./prototype/README.md)：保留较早的 18 类页面；当前首版请使用下方六模块静态网站。
- [第一版静态交互网站](./prototype/v1/index.html)：按总需求文档六个模块制作，可本地交互并保存到当前浏览器。
- [React + Vite 前端](./frontend/) 与 [Next.js API](./backend/)：真实功能实现入口。
- [共同理解与交付确认](./docs/shared-understanding.md)：整体审阅入口及补充默认规则。
- [完整产品方案](./docs/product-plan-draft.md)：21 个功能模块、18 类页面和主要流程。
- [目的地特色页面](./docs/destination-profile.md)：人文、自然、美食、钓鱼、地理与行程联动。
- [原型交付方案](./docs/prototype-brief.md)：制作安排与真实接入边界。
- [验收场景](./docs/acceptance-scenarios.md)：未来验证要求，当前不是测试结果。
- [产品讨论记录](./docs/product-brief.md)：已接受的各轮决定。
- [设计决策树](./docs/design-tree.md)：决策依赖与当前前沿。
- [外部能力核查](./docs/data-feasibility.md)：官方资料与未验证能力。
- [领域术语](./GLOSSARY.md)：统一的产品语言。
- [预订与支付边界](./docs/adr/0001-external-booking-no-payments.md)：外部预订、导入管理、禁止支付。

## 真实功能开发

在此目录运行 `npm install` 安装前端与 API 依赖。先将 `backend/.env.example` 复制为 `backend/.env`，填写 PostgreSQL 连接地址，然后按文件名顺序将 `backend/db/migrations/` 中的 SQL 文件应用到该数据库。

分别启动 `npm run dev:api` 和 `npm run dev:frontend`；前端开发服务器会把 `/api` 请求转发到本地 Next.js API。纯静态原型仍通过 `prototype/v1/index.html` 单独打开。
