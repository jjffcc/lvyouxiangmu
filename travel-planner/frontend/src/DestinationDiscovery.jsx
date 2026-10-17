import { useState } from "react";
import DestinationMap from "./DestinationMap.jsx";
import { nationalDestinationCities, nationalDestinationFeatures } from "./destination-catalog.js";
import "./destination-discovery.css";

const categories = ["全部", "人文", "自然景观", "美食", "钓鱼", "地理特色", "其他"];

const destinationFeatures = [
  { id: "hangzhou-west-lake", name: "西湖 · 湖山与古迹", category: "自然景观", city: "杭州", description: "环湖步道、苏堤与湖畔园林，适合慢走和安排半日游。", season: "春秋", duration: "半天", cost: "免费区域为主", reference: "演示资料 · 需要旅行前核实", tone: "v1" },
  { id: "hangzhou-song-yujie", name: "南宋御街与河坊街", category: "人文", city: "杭州", description: "老城街巷与传统商铺集中，可结合附近小吃步行游览。", season: "全年", duration: "2–3 小时", cost: "按消费为准", reference: "演示资料 · 需要旅行前核实", tone: "v2" },
  { id: "hangzhou-longjing", name: "龙井茶园体验", category: "地理特色", city: "杭州", description: "茶山与村落相连，路线有坡度，建议预留休息时间。", season: "春秋", duration: "2–3 小时", cost: "待核实", reference: "演示资料 · 需要旅行前核实", tone: "v3" },
  { id: "hangzhou-qiandao-fishing", name: "千岛湖休闲垂钓", category: "钓鱼", city: "杭州", description: "不同水域和经营点的准入、开放及预约规则不同，出发前联系确认。", season: "以经营方公告为准", duration: "待核实", cost: "待核实", reference: "体验条件待核实", tone: "v2" },
  { id: "suzhou-pingjiang", name: "平江路历史街区", category: "人文", city: "苏州", description: "沿河街巷与传统建筑相邻，适合慢步体验，店铺信息出发前核实。", season: "春秋", duration: "2–3 小时", cost: "按消费为准", reference: "演示资料 · 需要旅行前核实", tone: "v2" },
  { id: "suzhou-humble-garden", name: "拙政园", category: "自然景观", city: "苏州", description: "古典园林示例，开放时间、预约与门票请以官方信息为准。", season: "春秋", duration: "半天", cost: "待核实", reference: "演示资料 · 需要旅行前核实", tone: "v1" },
  { id: "shanghai-bund", name: "外滩建筑群", category: "人文", city: "上海", description: "沿江历史建筑与城市景观示例，开放区域和活动情况需现场核实。", season: "全年", duration: "1–2 小时", cost: "免费区域为主", reference: "演示资料 · 需要旅行前核实", tone: "v1" },
];

const demoCities = ["杭州", "苏州", "上海"];

export default function DestinationDiscovery({ tripDestinations, trip, onToggleFavorite, onBrowseFood }) {
  const [city, setCity] = useState("杭州");
  const [category, setCategory] = useState("全部");
  const cities = [...new Set([...demoCities, ...nationalDestinationCities, ...tripDestinations])];
  const results = [...destinationFeatures, ...nationalDestinationFeatures].filter((item) => item.city === city && (category === "全部" || item.category === category));
  const favoriteIds = trip?.favoriteDestinationIds ?? [];

  return (
    <>
      <div className="page-intro">
        <div><div className="eyebrow">DESTINATION NOTES</div><h1>目的地发现</h1><p>先了解一座城市，再按兴趣浏览可用的特色资料。</p></div>
      </div>

      <div className="city-switchbar destination-city-form">
        <label htmlFor="discovery-city">选择浏览城市</label>
        <select
          id="discovery-city"
          className="destination-city-input"
          value={city}
          onChange={(event) => { setCity(event.target.value); setCategory("全部"); }}
        >
          {cities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <span>已整理 {nationalDestinationCities.length} 个热门城市及旅游目的地参考资料；切换只影响本页和地图查询，不会更改旅行档案或行程</span>
      </div>
      <p className="tiny destination-favorite-context">收藏归属：{trip ? `当前旅行「${trip.name}」` : "请先创建旅行档案"}</p>

      <div className="toolbar destination-category-list" aria-label="目的地特色分类">
        {categories.map((item) => (
          <button key={item} type="button" className={`chip${category === item ? " active" : ""}`} aria-pressed={category === item} onClick={() => item === "美食" ? onBrowseFood(city) : setCategory(item)}>{item}</button>
        ))}
      </div>

      {results.length ? (
        <div className="feature-list destination-feature-list">
          {results.map((item) => (
            <article className="card feature-card" key={`${item.city}-${item.name}`}>
              <div className={`feature-visual ${item.tone}`} aria-hidden="true"><span className="visual-icon">{item.category.slice(0, 1)}</span></div>
              <div className="feature-copy">
                <span className="sample-label">{item.category} · 演示资料</span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <div className="feature-meta">
                  <span>{item.season}</span><span>{item.duration}</span><span>{item.cost}</span>
                </div>
                <div className="feature-actions">
                  <a
                    className="btn small"
                    href={`https://uri.amap.com/search?keyword=${encodeURIComponent(item.name)}&city=${encodeURIComponent(city)}&view=map&src=lvyouxiangmu&callnative=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`在高德地图查看${item.name}`}
                  >地图查看</a>
                  <button type="button" className={`btn small${favoriteIds.includes(item.id) ? " soft" : ""}`} aria-pressed={favoriteIds.includes(item.id)} disabled={!trip} onClick={() => onToggleFavorite(item.id)}>
                    <span aria-hidden="true">{favoriteIds.includes(item.id) ? "★" : "☆"}</span> {favoriteIds.includes(item.id) ? "已收藏" : "收藏"}
                  </button>
                </div>
                <div className="tiny destination-reference">{item.reference}</div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty destination-empty-state">
          <strong>{city}暂无此分类的特色资料</strong>
          <span>当前没有可展示的内容，不会用虚构地点填充结果。</span>
          {category !== "全部" && <button type="button" className="btn small" onClick={() => setCategory("全部")}>查看全部分类</button>}
        </div>
      )}

      <div className="notice destination-notice">页面中的特色条目是演示参考资料；开放、预约、价格和体验条件请出发前核实。</div>

      <DestinationMap city={city} />
    </>
  );
}
