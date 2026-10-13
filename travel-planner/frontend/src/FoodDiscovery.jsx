import { useEffect, useRef, useState } from "react";
import { loadAMap, loadAMapPlugins } from "./amap.js";
import "./food-discovery.css";

function formatQueryTime(date) {
  return date.toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
}

function getAddress(address) {
  if (Array.isArray(address)) return address.join("");
  return typeof address === "string" ? address : "";
}

function getPlaceLocation(poi) {
  return [poi.pname, poi.cityname, poi.adname, getAddress(poi.address)]
    .filter((value) => typeof value === "string" && value.trim())
    .join("");
}

export default function FoodDiscovery({ tripDestinations, trip, canFavorite = true, onToggleFavorite }) {
  const initialCity = trip?.destinations?.[0] || "杭州";
  const [city, setCity] = useState(initialCity);
  const [cityInput, setCityInput] = useState(initialCity);
  const [amap, setAMap] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [places, setPlaces] = useState([]);
  const [searchState, setSearchState] = useState("loading");
  const [queryTime, setQueryTime] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [mapMessage, setMapMessage] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    let disposed = false;

    loadAMap()
      .then(async (AMap) => {
        await loadAMapPlugins(AMap, ["AMap.PlaceSearch"]);
        if (!disposed) setAMap(AMap);
      })
      .catch((error) => {
        if (disposed) return;
        setLoadError(error.message === "missing-key"
          ? "尚未配置高德 Web JS Key。请在 frontend/.env 中设置 VITE_AMAP_WEB_KEY。"
          : "高德美食查询未能加载，请检查 Key 配置或网络后重试。");
      });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!amap || !city) return undefined;

    const requestId = ++requestIdRef.current;
    setSearchState("loading");
    setPlaces([]);
    setQueryTime(formatQueryTime(new Date()));

    try {
      const placeSearch = new amap.PlaceSearch({
        pageSize: 20,
        pageIndex: 1,
        city,
        citylimit: true,
        extensions: "all",
      });
      placeSearch.setType("餐饮服务");
      placeSearch.search("餐饮", (status, result) => {
        if (requestId !== requestIdRef.current) return;
        if (status === "complete" && result?.info === "OK") {
          const nextPlaces = result.poiList?.pois ?? [];
          setPlaces(nextPlaces);
          setSearchState(nextPlaces.length ? "results" : "empty");
        } else if (status === "no_data" || result?.info === "NO_DATA") {
          setPlaces([]);
          setSearchState("empty");
        } else {
          setSearchState("error");
        }
      });
    } catch {
      setSearchState("error");
    }

    return () => {
      if (requestId === requestIdRef.current) requestIdRef.current += 1;
    };
  }, [amap, city, retryCount]);

  function submitCity(event) {
    event.preventDefault();
    const nextCity = cityInput.trim();
    if (!nextCity) return;
    setCityInput(nextCity);
    setMapMessage("");
    if (nextCity === city) setRetryCount((count) => count + 1);
    else setCity(nextCity);
  }

  const citySuggestions = [...new Set(tripDestinations.filter(Boolean))];
  const favoriteFoodPoiIds = trip?.favoriteFoodPoiIds ?? [];

  return (
    <>
      <div className="page-intro">
        <div><div className="eyebrow">TASTE THE CITY</div><h1>当地美食</h1><p>按浏览城市查询高德返回的餐饮地点，店铺信息请以出发前核实为准。</p></div>
      </div>

      <form className="city-switchbar food-city-form" onSubmit={submitCity}>
        <label htmlFor="food-city">美食浏览城市</label>
        <input
          id="food-city"
          className="food-city-input"
          list="food-city-suggestions"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          placeholder="输入国内城市"
          required
        />
        <datalist id="food-city-suggestions">
          {citySuggestions.map((item) => <option key={item} value={item} />)}
        </datalist>
        <button type="submit" className="btn small">切换城市</button>
        <span>仅改变本页查询，不会修改旅行目的地或行程</span>
      </form>
      <p className="tiny food-favorite-context">收藏归属：{trip ? `当前旅行「${trip.name}」` : "请先创建旅行档案"}</p>

      <section className="food-results-section" aria-labelledby="food-results-title">
        <div className="section-head food-results-heading">
          <div><h2 id="food-results-title">{city} · 餐饮地点</h2><p>查询关键词：餐饮</p></div>
          <div className="food-source-meta"><span>数据来源：高德开放平台</span><span>{queryTime ? `查询时间：${queryTime}` : "等待查询"}</span></div>
        </div>

        {loadError ? (
          <div className="empty food-query-state" role="status">{loadError}</div>
        ) : searchState === "loading" ? (
          <div className="empty food-query-state" role="status">正在查询{city}的高德餐饮地点…</div>
        ) : searchState === "error" ? (
          <div className="empty food-query-state" role="alert">
            <strong>高德餐饮查询失败</strong>
            <span>请稍后重试；当前没有可展示的查询结果。</span>
            <button type="button" className="btn small" onClick={() => setRetryCount((count) => count + 1)}>重新查询</button>
          </div>
        ) : searchState === "empty" ? (
          <div className="empty food-query-state" role="status">
            <strong>高德暂未返回{city}的餐饮地点</strong>
            <span>可以检查城市名称或稍后重新查询。</span>
            <button type="button" className="btn small" onClick={() => setRetryCount((count) => count + 1)}>重新查询</button>
          </div>
        ) : (
          <div className="food-place-list" aria-live="polite">
            {places.map((poi, index) => {
              const placeName = typeof poi.name === "string" ? poi.name.trim() : "";
              const location = getPlaceLocation(poi);
              const poiId = typeof poi.id === "string" ? poi.id.trim() : "";
              const isFavorite = poiId && favoriteFoodPoiIds.includes(poiId);
              const mapSearchHref = placeName
                ? `https://uri.amap.com/search?keyword=${encodeURIComponent(placeName)}&city=${encodeURIComponent(city)}&view=map&src=lvyouxiangmu&callnative=0`
                : "";
              return (
                <article className="card food-place-card" key={poi.id || `${poi.name || "餐饮地点"}-${index}`}>
                  <span className="sample-label">高德餐饮 POI</span>
                  <h3>{placeName || "高德未提供店铺名称"}</h3>
                  {poi.type && <p className="food-place-type">{poi.type}</p>}
                  <p className={`food-place-location${location ? "" : " unavailable"}`}>
                    {location || "高德未返回地点信息"}
                  </p>
                  <div className="food-place-actions">
                    {mapSearchHref ? (
                      <a
                        className="btn small"
                        href={mapSearchHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`在高德地图搜索${placeName}，城市：${city}`}
                        onClick={() => setMapMessage(`已在新标签打开高德地图搜索“${placeName} · ${city}”。若页面未打开，请使用当前卡片中的店铺名称和地点信息自行搜索。`)}
                      >高德地图搜索</a>
                    ) : <span className="tiny">高德未提供店铺名称，无法发起地图搜索。</span>}
                    <button
                      type="button"
                      className={`btn small${isFavorite ? " soft" : ""}`}
                      aria-pressed={Boolean(isFavorite)}
                      disabled={!trip || !canFavorite || !poiId}
                      onClick={() => onToggleFavorite(poiId)}
                    >{isFavorite ? "已收藏" : "收藏"}</button>
                    {!poiId && <span className="tiny">高德未提供地点标识，无法收藏。</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {mapMessage && <p className="food-map-feedback" role="status">{mapMessage}</p>}
        <div className="notice food-results-notice">营业状态、价格和菜单等信息可能变化，请以高德或商家当前信息为准；本页不会保存高德返回的店铺资料。地图搜索在新标签打开，如无法打开，请使用店铺名称和地点信息自行核实；跳转不代表预订或购买。</div>
      </section>
    </>
  );
}
