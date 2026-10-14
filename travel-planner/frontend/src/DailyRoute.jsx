import { useEffect, useRef, useState } from "react";
import { loadAMap, loadAMapPlugins } from "./amap.js";
import "./daily-route.css";

const routeModes = [
  { id: "driving", label: "驾车", plugin: "AMap.Driving", uriMode: "car" },
  { id: "transit", label: "公交/地铁", plugin: "AMap.Transfer", uriMode: "bus" },
  { id: "walking", label: "步行", plugin: "AMap.Walking", uriMode: "walk" },
  { id: "riding", label: "骑行", plugin: "AMap.Riding", uriMode: "ride" },
];

function formatDistance(distance) {
  if (!Number.isFinite(distance)) return "高德未提供";
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)} 公里` : `${Math.round(distance)} 米`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "高德未提供";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`;
}

function readCoordinate(location) {
  const longitude = typeof location?.getLng === "function" ? location.getLng() : location?.lng;
  const latitude = typeof location?.getLat === "function" ? location.getLat() : location?.lat;
  if (!Number.isFinite(Number(longitude)) || !Number.isFinite(Number(latitude))) return null;
  return { longitude: Number(longitude), latitude: Number(latitude) };
}

function navigationUrl(from, to, mode) {
  const origin = readCoordinate(from.location);
  const destination = readCoordinate(to.location);
  if (!origin || !destination) return "";

  const params = new URLSearchParams({
    from: `${origin.longitude},${origin.latitude},${from.item.name}`,
    to: `${destination.longitude},${destination.latitude},${to.item.name}`,
    mode: mode.uriMode,
    src: "lvyouxiangmu",
    callnative: "0",
  });
  return `https://uri.amap.com/navigation?${params.toString()}`;
}

function geocodeItem(geocoder, item) {
  const query = item.address?.trim() || item.name.trim();
  return new Promise((resolve) => {
    geocoder.getLocation(query, (status, result) => {
      const geocode = result?.geocodes?.find((candidate) => candidate.location);
      if (status === "complete" && result?.info === "OK" && geocode) {
        resolve({
          item,
          location: geocode.location,
          formattedAddress: geocode.formattedAddress || query,
        });
      } else {
        resolve({ item, error: "高德未能识别此地点，请补充更完整的地点或地址。" });
      }
    });
  });
}

function querySegment(AMap, mode, city, from, to) {
  return new Promise((resolve) => {
    const Service = AMap[mode.plugin.slice("AMap.".length)];
    const options = mode.id === "transit" ? { city, hideMarkers: true } : { hideMarkers: true };
    const service = new Service(options);

    service.search(from.location, to.location, (status, result) => {
      const route = mode.id === "transit" ? result?.plans?.[0] : result?.routes?.[0];
      if (status === "complete" && route) {
        resolve({
          from,
          to,
          distance: Number(route.distance ?? Number.NaN),
          duration: Number(route.time ?? Number.NaN),
          navigationUrl: navigationUrl(from, to, mode),
          error: "",
        });
      } else {
        resolve({
          from,
          to,
          error: "高德没有返回这两个地点之间的路线。",
        });
      }
    });
  });
}

function formatQueryTime(date) {
  return date.toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
}

export default function DailyRoute({ trip, selectedDate, dayItems }) {
  const cities = [...new Set((trip.destinations ?? []).map((city) => city.trim()).filter(Boolean))];
  const [modeId, setModeId] = useState("");
  const [routeCity, setRouteCity] = useState(cities.length === 1 ? cities[0] : "");
  const [result, setResult] = useState({ signature: "", status: "idle", segments: [], missing: [], message: "", queryTime: "" });
  const requestIdRef = useRef(0);
  const mode = routeModes.find((candidate) => candidate.id === modeId);
  const signature = JSON.stringify([
    selectedDate,
    modeId,
    routeCity,
    dayItems.map((item) => [item.id, item.name, item.address]),
  ]);

  useEffect(() => {
    requestIdRef.current += 1;
    setResult({ signature, status: "idle", segments: [], missing: [], message: "", queryTime: "" });
  }, [signature]);

  async function searchRoutes() {
    if (!mode || !routeCity || dayItems.length < 2) return;
    const requestId = ++requestIdRef.current;
    const isCurrentRequest = () => requestIdRef.current === requestId;
    const queryTime = formatQueryTime(new Date());
    setResult({ signature, status: "loading", segments: [], missing: [], message: "", queryTime });

    try {
      const AMap = await loadAMap();
      await loadAMapPlugins(AMap, ["AMap.Geocoder", mode.plugin]);
      if (!isCurrentRequest()) return;

      const geocoder = new AMap.Geocoder({ city: routeCity });
      const points = await Promise.all(dayItems.map((item) => geocodeItem(geocoder, item)));
      if (!isCurrentRequest()) return;

      const missing = points.filter((point) => point.error);
      if (missing.length) {
        setResult({
          signature,
          status: "incomplete",
          segments: [],
          missing,
          message: "路线没有生成。请补充上面地点的地址后重新查询。",
          queryTime,
        });
        return;
      }

      const segments = await Promise.all(points.slice(1).map((to, index) => (
        querySegment(AMap, mode, routeCity, points[index], to)
      )));
      if (!isCurrentRequest()) return;

      setResult({
        signature,
        status: "complete",
        segments,
        missing: [],
        message: "",
        queryTime,
      });
    } catch (error) {
      if (!isCurrentRequest()) return;
      setResult({
        signature,
        status: "error",
        segments: [],
        missing: [],
        message: error?.message === "missing-key"
          ? "尚未配置高德 Web JS Key。请在 frontend/.env 中设置 VITE_AMAP_WEB_KEY。"
          : "高德路线查询失败，请检查配置或网络后重试。",
        queryTime,
      });
    }
  }

  const visibleResult = result.signature === signature ? result : null;
  const canSearch = Boolean(mode && routeCity && dayItems.length >= 2);

  return (
    <section className="daily-route-section" aria-labelledby="daily-route-title">
      <div className="section-head">
        <div>
          <h2 id="daily-route-title">当天路线参考</h2>
          <p>仅按当前日期已录入的地点及手工顺序查询；路线不会改写日程。</p>
        </div>
        <span className="daily-route-source">数据来源：高德开放平台</span>
      </div>

      <div className="daily-route-controls">
        <div className="daily-route-field">
          <label htmlFor="daily-route-mode">出行方式</label>
          <select id="daily-route-mode" className="select" value={modeId} onChange={(event) => setModeId(event.target.value)}>
            <option value="">请选择</option>
            {routeModes.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.label}</option>)}
          </select>
        </div>
        {cities.length > 1 ? (
          <div className="daily-route-field">
            <label htmlFor="daily-route-city">当天路线城市</label>
            <select id="daily-route-city" className="select" value={routeCity} onChange={(event) => setRouteCity(event.target.value)}>
              <option value="">请选择当天所在城市</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        ) : (
          <p className="daily-route-city-context">路线城市：{routeCity || "旅行目的地未填写"}</p>
        )}
        <button type="button" className="btn primary" disabled={!canSearch || visibleResult?.status === "loading"} onClick={searchRoutes}>
          {visibleResult?.status === "loading" ? "正在查询…" : visibleResult?.status === "complete" ? "重新查询路线" : "查询高德路线"}
        </button>
      </div>

      {dayItems.length < 2 && <p className="daily-route-feedback" role="status">当天至少需要两项地点，才能查询地点之间的路线。</p>}
      {dayItems.length >= 2 && !mode && <p className="daily-route-feedback">请选择出行方式后查询。</p>}
      {dayItems.length >= 2 && mode && !routeCity && <p className="daily-route-feedback">请选择当天路线城市后查询。</p>}

      {visibleResult?.status === "loading" && <p className="daily-route-feedback" role="status">正在识别当天地点并查询路线…</p>}
      {visibleResult?.status === "error" && <p className="daily-route-feedback is-error" role="alert">{visibleResult.message}</p>}
      {visibleResult?.status === "incomplete" && (
        <div className="daily-route-feedback is-error" role="alert">
          <p>{visibleResult.message}</p>
          <ul>
            {visibleResult.missing.map((point) => <li key={point.item.id}>{point.item.name}：{point.error}</li>)}
          </ul>
        </div>
      )}
      {visibleResult?.status === "complete" && (
        <div className="daily-route-results" aria-live="polite">
          <p className="daily-route-query-time">{mode.label} · 查询时间：{visibleResult.queryTime} · 动态参考，请出发前重新核实</p>
          {visibleResult.segments.map((segment, index) => (
            <article className="daily-route-segment" key={`${segment.from.item.id}-${segment.to.item.id}`}>
              <div className="daily-route-segment-heading">
                <strong>{segment.from.item.name} → {segment.to.item.name}</strong>
                <span>第 {index + 1} 段</span>
              </div>
              <p className="daily-route-resolved-address">高德识别：{segment.from.formattedAddress} → {segment.to.formattedAddress}</p>
              {segment.error ? (
                <p className="daily-route-feedback is-error" role="status">{segment.error}</p>
              ) : (
                <div className="daily-route-segment-details">
                  <span>距离：{formatDistance(segment.distance)}</span>
                  <span>预计耗时：{formatDuration(segment.duration)}</span>
                  {segment.navigationUrl && <a className="btn small" href={segment.navigationUrl} target="_blank" rel="noopener noreferrer">高德地图查看/导航</a>}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
