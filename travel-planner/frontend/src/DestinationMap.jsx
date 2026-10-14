import { useEffect, useRef, useState } from "react";
import { loadAMap, loadAMapPlugins } from "./amap.js";
import "./destination-map.css";

function formatQueryTime(date) {
  return date.toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });
}

function getAddress(address) {
  if (Array.isArray(address)) return address.join("");
  return typeof address === "string" ? address : "";
}

export default function DestinationMap({ city }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const amapRef = useRef(null);
  const placeSearchRef = useRef(null);
  const lastQueryRef = useRef("");
  const searchIdRef = useRef(0);
  const cityLookupIdRef = useRef(0);
  const hasSearchResultsRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [searchState, setSearchState] = useState("idle");
  const [queryTime, setQueryTime] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let disposed = false;
    let map;

    loadAMap()
      .then(async (AMap) => {
        await loadAMapPlugins(AMap, ["AMap.PlaceSearch", "AMap.Geocoder", "AMap.Geolocation"]);
        if (disposed || !containerRef.current) return;

        amapRef.current = AMap;
        map = new AMap.Map(containerRef.current, { viewMode: "2D", zoom: 11 });
        mapRef.current = map;
        setMapReady(true);
      })
      .catch((error) => {
        if (disposed) return;
        setMapError(error.message === "missing-key"
          ? "尚未配置高德 Web JS Key。请在 frontend/.env 中设置 VITE_AMAP_WEB_KEY。"
          : "高德地图加载失败，请检查 Key 配置或网络后重试。");
      });

    return () => {
      disposed = true;
      map?.destroy();
      mapRef.current = null;
      placeSearchRef.current = null;
      amapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !amapRef.current || !city) return;

    const requestId = ++cityLookupIdRef.current;
    const map = mapRef.current;
    const AMap = amapRef.current;
    map.clearMap();
    hasSearchResultsRef.current = false;
    setPlaces([]);
    setQueryMessage("");
    setLocationMessage("");

    placeSearchRef.current = new AMap.PlaceSearch({
      pageSize: 10,
      pageIndex: 1,
      city,
      citylimit: true,
      map,
      autoFitView: true,
    });

    const geocoder = new AMap.Geocoder({ city });
    geocoder.getLocation(city, (status, result) => {
      if (requestId !== cityLookupIdRef.current) return;
      const center = result?.geocodes?.[0]?.location;
      if (status === "complete" && result?.info === "OK" && center) {
        if (hasSearchResultsRef.current) map.setFitView();
        else map.setZoomAndCenter(11, center);
      } else {
        setLocationMessage(`高德未能定位“${city}”，请检查城市名称；POI 查询仍会按该城市名限定。`);
      }
    });

    if (lastQueryRef.current) searchPlaces(lastQueryRef.current, placeSearchRef.current);
    else setSearchState("idle");
  }, [city, mapReady]);

  function searchPlaces(term, placeSearch = placeSearchRef.current) {
    const normalized = term.trim();
    if (!normalized || !placeSearch) return;

    lastQueryRef.current = normalized;
    const searchId = ++searchIdRef.current;
    hasSearchResultsRef.current = false;
    setSearchState("loading");
    setQueryTime(formatQueryTime(new Date()));
    setQueryMessage("");
    setPlaces([]);

    placeSearch.search(normalized, (status, result) => {
      if (searchId !== searchIdRef.current) return;
      if (status === "complete" && result?.info === "OK") {
        const pois = result.poiList?.pois ?? [];
        hasSearchResultsRef.current = pois.length > 0;
        setPlaces(pois.map((poi, index) => ({
          id: poi.id || `${poi.name || "地点"}-${index}`,
          name: poi.name || "未提供名称",
          address: getAddress(poi.address),
          location: poi.location || null,
        })));
        setSearchState(pois.length ? "results" : "empty");
        setQueryMessage(pois.length ? "" : `高德在${city}没有返回匹配地点。`);
      } else {
        setSearchState("error");
        setQueryMessage("高德地点查询失败，请稍后重试或通过地图查看入口继续核实。");
      }
    });
  }

  function handleSearch(event) {
    event.preventDefault();
    searchPlaces(keyword);
  }

  function handleLocate() {
    if (!amapRef.current || !mapRef.current) return;
    setLocating(true);
    setLocationMessage("");
    const geolocation = new amapRef.current.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      zoomToAccuracy: true,
    });
    geolocation.getCurrentPosition((status, result) => {
      setLocating(false);
      if (status === "complete" && result?.position) {
        mapRef.current?.setCenter(result.position);
        setLocationMessage("定位成功，仅调整当前地图视野；位置不会保存到旅行资料。");
      } else {
        setLocationMessage("高德定位失败。请检查浏览器定位权限或稍后重试。");
      }
    });
  }

  function focusPlace(place) {
    if (!place.location || !mapRef.current) return;
    mapRef.current.setZoomAndCenter(16, place.location);
  }

  return (
    <section className="destination-map-section" aria-labelledby="destination-map-title">
      <div className="section-head">
        <div><h2 id="destination-map-title">高德地图与地点查询</h2><p>按当前浏览城市查询高德 POI；结果仅用于本次查看，不保存到旅行资料。</p></div>
        <span className="amap-source-label">数据来源：高德开放平台</span>
      </div>

      <form className="destination-map-search" onSubmit={handleSearch}>
        <label htmlFor="destination-map-keyword">地点或关键词</label>
        <input
          id="destination-map-keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={`在${city}搜索地点`}
          required
        />
        <button type="submit" className="btn primary" disabled={!mapReady || !keyword.trim()}>搜索高德 POI</button>
        <button type="button" className="btn" onClick={handleLocate} disabled={!mapReady || locating}>
          {locating ? "定位中…" : "定位到我"}
        </button>
      </form>

      {locationMessage && <p className="destination-map-message" role="status">{locationMessage}</p>}

      <div className="destination-map-layout">
        <div className="destination-map-canvas-wrap">
          {mapError ? (
            <div className="destination-map-unavailable" role="status">{mapError}</div>
          ) : !mapReady ? (
            <div className="destination-map-unavailable" role="status">正在加载高德地图…</div>
          ) : null}
          <div className="destination-map-canvas" ref={containerRef} aria-label={`${city}高德地图`} />
        </div>

        <div className="destination-map-results" aria-live="polite">
          <div className="destination-map-results-heading">
            <strong>{city}的地点结果</strong>
            {queryTime && <span>查询时间：{queryTime}</span>}
          </div>
          {searchState === "idle" && <p className="destination-map-hint">输入地点或关键词，查看高德返回的结果。</p>}
          {searchState === "loading" && <p className="destination-map-hint">正在查询高德地点…</p>}
          {searchState === "empty" && <p className="destination-map-hint">{queryMessage}</p>}
          {searchState === "error" && <p className="destination-map-hint error">{queryMessage}</p>}
          {searchState === "results" && (
            <ul className="destination-map-place-list">
              {places.map((place) => (
                <li key={place.id}>
                  <div><strong>{place.name}</strong>{place.address && <span>{place.address}</span>}</div>
                  <button type="button" className="btn small" onClick={() => focusPlace(place)} disabled={!place.location}>地图查看</button>
                </li>
              ))}
            </ul>
          )}
          <p className="destination-map-disclaimer">地点信息及位置以高德当前返回为准；营业、价格等动态信息请出发前核实。定位仅在用户点击后执行。</p>
        </div>
      </div>
    </section>
  );
}
