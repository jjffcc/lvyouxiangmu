# 外部数据与网页能力核查

核查日期：2026-10-04（客户端日期）。方式：主线程与子agent查阅供应商、WebKit、Mozilla 官方资料；未申请账户或密钥，未付费，未实测接口、手机通知送达或离线运行。

## 有资料依据的能力及边界

| 能力 | 资料事实 | 对产品的影响及未确认项 |
| --- | --- | --- |
| 地点与路线 | 高德 JSAPI 文档包含地点搜索、驾车、步行及公交路线能力 | 可作为候选服务研究；全国覆盖、跨城衔接、实时班次、打车价格及实际可用性未验证。来源：[JSAPI 官方参考](https://a.amap.com/jsapi/static/doc/20230922/index.html) |
| 地图接入 | Web 服务需申请相应平台的 key | 原型不调用真实密钥；正式接入需核查实际 key、配额、密钥保护与费用。来源：[官方获取 Key 指南](https://lbs.amap.com/api/webservice/guide/create-project/get-key) |
| iOS 网页推送 | WebKit 说明 iOS/iPadOS 16.4 的主屏 Web App 支持 Web Push，需要用户直接操作申请权限 | 不把普通网页标签等同于可用通知；当前版本和实际设备需检测验证。来源：[WebKit 官方说明](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) |
| 后台推送 | Push API 配合 service worker 可处理页面未加载时的服务器推送 | 不能用页面计时器承诺关闭网页后可靠提醒；服务器链路及国内网络送达未实测。来源：[Mozilla Push API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) |
| 离线文本 | service worker 支持缓存和离线加载，正式环境需安全上下文；本机 localhost 可用于开发 | 必须提前成功保存界面必要资源和可离线内容，再验证断网读取；离线功能不是自动获得。来源：[Mozilla Service Worker 指南](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) |
| 缓存持久性 | 浏览器存储存在配额与清理规则 | 提示离线保存状态，不承诺永久保存；需要导出备份及实际设备验证。来源：[Mozilla 存储与清理说明](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) |
| 离线地图 | 高德服务协议未向本产品提供已经确认的瓦片离线保存许可 | 此功能保持待确认；不要把可调用地图 API 推导为可下载离线地图。来源：[高德服务协议](https://developer.amap.com/pages/terms/) |
| 天气预报 | Open-Meteo 普通预报默认 7 天，最多请求 16 天，不同模型时效不同；湿度、降水概率和降水量是不同字段 | 超出所选服务的预报范围不能显示成确定天气；数据适用时间与获取时间分别展示。来源：[官方天气文档](https://open-meteo.com/en/docs) |
| 天气使用条件 | Open-Meteo 免费 API 针对非商业使用，有请求限制且不提供正常运行保证；数据需要注明来源 | 个人项目不能自动等同于任何规模都永久免费；服务尚未选定，商业使用与成本需在接入前核查。来源：[官方使用条件与价格说明](https://open-meteo.com/en/pricing) |

## 核查未覆盖的部分

- AI 和 OCR 模型、费用、数据处理和响应质量尚未选择或验证。
- 酒店、票务及餐饮价格、余量、预订深链接未接入或实际验证。
- 外部账户连接与自动订单状态同步没有获得产品决策，不假定能自动取得。
- 登录、邀请、权限、跨设备同步和存储尚未实现。
- 日历导出的终端导入、事件更新和重复处理尚未验证。
- 以上是资料依据，具体功能是否承诺仍须产品决策和实际验证。

## 从资料形成、已获 Q23 至 Q26 接受的方向

1. 网页内展示提醒，配合日历导出；浏览器推送在支持并获许可时启用，不承诺必达。
2. 离线先提供成功保存的文本与摘要，显示版本和保存时间；离线地图单独核查。
3. 距出发较远时展示天气尚不可预报；准备室内外备选，接近出发后再更新。
4. 网页展示路线与交通概览，逐向导航可采用外部地图跳转；定位拒绝时支持手动起点。
