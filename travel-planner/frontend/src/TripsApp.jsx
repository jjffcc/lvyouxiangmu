import { useState } from "react";
import DestinationDiscovery from "./DestinationDiscovery.jsx";
import { readAccountTrips, saveAccountTrips } from "./trips.js";
import "./trips.css";

function readInitialTrips(accountId) {
  try {
    return { trips: readAccountTrips(accountId), error: "" };
  } catch (error) {
    return { trips: [], error: storageFailureMessage(error, "read") };
  }
}

function storageFailureMessage(error, operation) {
  if (error?.name === "QuotaExceededError") {
    return "浏览器本地存储空间不足，旅行资料没有保存。请先释放浏览器空间后重试。";
  }
  if (operation === "read") {
    return "无法读取当前浏览器中的旅行资料。请检查浏览器存储权限后刷新页面；现有资料没有被重置。";
  }
  return "浏览器暂时无法保存旅行资料。请检查浏览器存储权限后重试。";
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3.5 14.4 10l6.1 2-6.1 2L12 20.5 9.6 14l-6.1-2 6.1-2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        </svg>
      </span>
      <span>
        <span className="brand-name">途见</span>
        <span className="brand-sub">TRIP JOURNAL</span>
      </span>
    </div>
  );
}

function TripEditor({ trip, onClose, onSave }) {
  const [name, setName] = useState(trip?.name ?? "");
  const [destinations, setDestinations] = useState(() => {
    const saved = trip?.destinations ?? [];
    return saved.length
      ? saved.map((value, index) => ({ key: `destination-${index}`, value }))
      : [{ key: "destination-new", value: "" }];
  });
  const [startDate, setStartDate] = useState(trip?.startDate ?? "");
  const [endDate, setEndDate] = useState(trip?.endDate ?? "");
  const [people, setPeople] = useState(trip?.people ?? "");
  const [budget, setBudget] = useState(trip?.budget ?? "");
  const [preferences, setPreferences] = useState(trip?.preferences ?? "");
  const [errors, setErrors] = useState({});

  function moveDestination(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= destinations.length) return;
    setDestinations((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    const orderedDestinations = destinations.map((item) => item.value.trim()).filter(Boolean);
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "请填写旅行名称。";
    if (!orderedDestinations.length) nextErrors.destinations = "请至少填写一个国内目的地。";
    if (startDate && endDate && endDate < startDate) nextErrors.dates = "返程日期不能早于出发日期。";

    let peopleCount = null;
    if (people !== "") {
      peopleCount = Number(people);
      if (!Number.isInteger(peopleCount) || peopleCount < 1) {
        nextErrors.people = "同行人数请填写大于 0 的整数。";
      }
    }

    let totalBudget = null;
    if (budget !== "") {
      totalBudget = Number(budget);
      if (!Number.isFinite(totalBudget) || totalBudget < 0) {
        nextErrors.budget = "总预算请填写不小于 0 的金额，或留空。";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const saved = onSave({
      id: trip?.id ?? crypto.randomUUID(),
      name: name.trim(),
      destinations: orderedDestinations,
      startDate,
      endDate,
      people: peopleCount,
      budget: totalBudget,
      preferences: preferences.trim(),
    });
    if (saved) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal trip-modal" role="dialog" aria-modal="true" aria-labelledby="trip-modal-title">
        <div className="modal-head">
          <div>
            <h2 id="trip-modal-title">{trip ? "编辑旅行档案" : "新建旅行档案"}</h2>
            <p>旅行资料仅保存在当前浏览器，并与当前账户分开保存。</p>
          </div>
          <button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="modal-body trip-form-body">
            <div className="form-field">
              <label htmlFor="trip-name">旅行名称</label>
              <input id="trip-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：周末杭州慢游" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "trip-name-error" : undefined} autoFocus />
              {errors.name && <small id="trip-name-error" className="trip-field-error" role="alert">{errors.name}</small>}
            </div>

            <div className="form-field">
              <label>国内目的地（按旅行顺序填写）</label>
              <div className="trip-destination-editor">
                {destinations.map((destination, index) => (
                  <div className="trip-destination-input-row" key={destination.key}>
                    <span className="trip-destination-index" aria-hidden="true">{index + 1}</span>
                    <input
                      className="input"
                      aria-label={`第 ${index + 1} 个国内目的地`}
                      value={destination.value}
                      onChange={(event) => setDestinations((current) => current.map((item) => item.key === destination.key ? { ...item, value: event.target.value } : item))}
                      placeholder="输入国内城市"
                      aria-invalid={Boolean(errors.destinations)}
                      aria-describedby={errors.destinations ? "trip-destinations-error" : "trip-destinations-hint"}
                    />
                    <button type="button" className="icon-btn trip-order-button" aria-label={`上移第 ${index + 1} 个目的地`} disabled={index === 0} onClick={() => moveDestination(index, -1)}>↑</button>
                    <button type="button" className="icon-btn trip-order-button" aria-label={`下移第 ${index + 1} 个目的地`} disabled={index === destinations.length - 1} onClick={() => moveDestination(index, 1)}>↓</button>
                    <button type="button" className="icon-btn trip-order-button" aria-label={`删除第 ${index + 1} 个目的地`} disabled={destinations.length === 1} onClick={() => setDestinations((current) => current.filter((item) => item.key !== destination.key))}>×</button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn small trip-add-destination" onClick={() => setDestinations((current) => [...current, { key: crypto.randomUUID(), value: "" }])}>＋ 添加目的地</button>
              <small id={errors.destinations ? "trip-destinations-error" : "trip-destinations-hint"} className={errors.destinations ? "trip-field-error" : "trip-field-hint"} role={errors.destinations ? "alert" : undefined}>
                {errors.destinations || "可自由输入城市，并用上、下按钮调整顺序。"}
              </small>
            </div>

            <div className="form-grid trip-form-grid">
              <div className="form-field">
                <label htmlFor="trip-start-date">出发日期</label>
                <input id="trip-start-date" className="input" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="trip-end-date">返程日期</label>
                <input id="trip-end-date" className="input" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
              {errors.dates && <small className="trip-field-error trip-form-wide" role="alert">{errors.dates}</small>}
              <div className="form-field">
                <label htmlFor="trip-people">同行人数</label>
                <input id="trip-people" className="input" type="number" min="1" step="1" value={people} onChange={(event) => setPeople(event.target.value)} placeholder="可留空" aria-invalid={Boolean(errors.people)} aria-describedby={errors.people ? "trip-people-error" : undefined} />
                {errors.people && <small id="trip-people-error" className="trip-field-error" role="alert">{errors.people}</small>}
              </div>
              <div className="form-field">
                <label htmlFor="trip-budget">总预算（元）</label>
                <input id="trip-budget" className="input" type="number" min="0" step="any" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="可留空" aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? "trip-budget-error" : undefined} />
                {errors.budget && <small id="trip-budget-error" className="trip-field-error" role="alert">{errors.budget}</small>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="trip-preferences">偏好与硬性条件</label>
              <textarea id="trip-preferences" className="input trip-preferences-input" value={preferences} onChange={(event) => setPreferences(event.target.value)} placeholder="例如：每天安排午休、少换酒店" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>取消</button>
            <button type="submit" className="btn primary">{trip ? "保存修改" : "创建旅行"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function displayDate(value) {
  return value || "未填写";
}

function displayBudget(value) {
  if (value === null || value === undefined || value === "") return "未填写";
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(value);
}

function TripCard({ trip, selected, onSelect, onEdit, onDelete }) {
  return (
    <article className={`card trip-card trip-card-v2${selected ? " selected" : ""}`}>
      <div className="trip-card-top">
        <div>
          <div className="trip-title">{trip.name}</div>
          <div className="trip-city">{trip.destinations.length ? trip.destinations.join(" · ") : "目的地未填写"}</div>
        </div>
        {selected && <span className="status-pill"><i className="dot" />当前旅行</span>}
      </div>
      <div className="trip-stats">
        <div className="trip-stat"><span>出行日期</span><strong>{displayDate(trip.startDate)}{trip.endDate ? ` — ${trip.endDate}` : trip.startDate ? " — 返程日期未填写" : ""}</strong></div>
        <div className="trip-stat"><span>同行人数</span><strong>{trip.people === null || trip.people === "" ? "未填写" : `${trip.people} 人`}</strong></div>
        <div className="trip-stat"><span>总预算</span><strong>{displayBudget(trip.budget)}</strong></div>
      </div>
      <div className="trip-card-bottom">
        <span className="trip-date">{trip.preferences ? "已填写偏好与条件" : "偏好与条件未填写"}</span>
        <div className="trip-card-actions">
          <button type="button" className={`btn small${selected ? " soft" : ""}`} onClick={() => onSelect(trip.id)}>{selected ? "当前旅行" : "查看档案"}</button>
          <button type="button" className="btn small" onClick={() => onEdit(trip)}>编辑</button>
          <button type="button" className="btn small danger" onClick={() => onDelete(trip)}>删除</button>
        </div>
      </div>
    </article>
  );
}

export default function TripsApp({ account, onLogout, logoutPending, message }) {
  const [initial] = useState(() => readInitialTrips(account.id));
  const [trips, setTrips] = useState(initial.trips);
  const [loadError, setLoadError] = useState(initial.error);
  const [selectedTripId, setSelectedTripId] = useState(initial.trips[0]?.id ?? null);
  const [activePage, setActivePage] = useState("trips");
  const [editor, setEditor] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) ?? trips[0] ?? null;

  function saveTrips(nextTrips) {
    try {
      saveAccountTrips(account.id, nextTrips);
      setTrips(nextTrips);
      setLoadError("");
      setStatusMessage("旅行档案已保存到当前浏览器。 ");
      return true;
    } catch (error) {
      setStatusMessage(storageFailureMessage(error, "write"));
      return false;
    }
  }

  function saveTrip(trip) {
    if (loadError) return false;
    const exists = trips.some((item) => item.id === trip.id);
    const nextTrips = exists
      ? trips.map((item) => item.id === trip.id ? trip : item)
      : [trip, ...trips];
    if (!saveTrips(nextTrips)) return false;
    setSelectedTripId(trip.id);
    setStatusMessage(exists ? "旅行档案已更新。" : "旅行档案已创建。 ");
    return true;
  }

  function deleteTrip(trip) {
    const confirmed = window.confirm(
      `确定删除“${trip.name}”吗？\n\n删除会一并移除这趟旅行及其日程、费用和出行准备内容，且无法恢复。`,
    );
    if (!confirmed) return;
    const nextTrips = trips.filter((item) => item.id !== trip.id);
    if (!saveTrips(nextTrips)) return;
    setSelectedTripId((current) => current === trip.id ? nextTrips[0]?.id ?? null : current);
    setStatusMessage(`“${trip.name}”及其关联旅行内容已删除。`);
  }

  function retryRead() {
    const result = readInitialTrips(account.id);
    setTrips(result.trips);
    setLoadError(result.error);
    setSelectedTripId(result.trips[0]?.id ?? null);
    setStatusMessage("");
  }

  return (
    <div className="app-shell travel-app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="nav-label">旅行空间</div>
        <nav className="nav-list" aria-label="主要导航">
          <button type="button" className={`nav-item${activePage === "trips" ? " active" : ""}`} onClick={() => setActivePage("trips")}><span className="ui-icon" aria-hidden="true">⌂</span>旅行总览</button>
          <button type="button" className={`nav-item${activePage === "destinations" ? " active" : ""}`} onClick={() => setActivePage("destinations")}>目的地发现</button>
        </nav>
        <div className="sidebar-bottom">
          {selectedTrip && <div className="mini-trip"><div className="mini-trip-label">当前旅行</div><div className="mini-trip-title">{selectedTrip.name}</div><div className="mini-trip-city">{selectedTrip.destinations.join(" · ") || "目的地未填写"}</div></div>}
          <div className="local-note"><span aria-hidden="true">●</span>资料保存在当前浏览器</div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="crumb">途见 <span aria-hidden="true">/</span> <strong>{activePage === "trips" ? "我的旅行" : "目的地发现"}</strong></div>
          <div className="top-actions">
            <span className="top-date">账户旅行资料独立保存</span>
            <button type="button" className="btn small" onClick={onLogout} disabled={logoutPending}>{logoutPending ? "正在退出…" : "退出登录"}</button>
          </div>
        </header>

        <div className="main-content">
          {message && <p className="trip-status-message" role="status">{message}</p>}
          {statusMessage && <p className={`trip-status-message${statusMessage.includes("无法") || statusMessage.includes("不足") ? " error" : ""}`} role="status" aria-live="polite">{statusMessage}</p>}

          {loadError && <div className="notice trip-storage-error" role="alert"><span>{loadError}</span><button type="button" className="btn small" onClick={retryRead}>重试读取</button></div>}
          {activePage === "trips" ? (
            <>
              <div className="page-intro">
                <div><div className="eyebrow">YOUR JOURNEYS</div><h1>我的旅行</h1><p>创建旅行档案，按顺序整理目的地和出行条件。</p></div>
                <div className="intro-actions"><button type="button" className="btn primary" onClick={() => setEditor({ trip: null })} disabled={Boolean(loadError)}>＋ 新建旅行</button></div>
              </div>

              <section className="welcome-banner trips-welcome-banner">
                <div className="banner-copy">
                  <div className="eyebrow">给下一段旅程一点期待</div>
                  <h1>{selectedTrip ? `下一站，${selectedTrip.destinations[0] || "由你决定"}。` : "从一次小旅行开始。"}</h1>
                  <p>{selectedTrip ? "当前旅行的档案和条件都在这里继续完善。" : "创建旅行档案后，就可以开始整理目的地和出行条件。"}</p>
                  <div className="banner-meta"><span>旅行档案 {trips.length} 份</span><span>{selectedTrip?.startDate || "出行日期由你填写"}</span></div>
                </div>
              </section>

              {!loadError && <>
              <div className="section-head" id="trip-list"><div><h2>旅行档案</h2><p>切换当前旅行，或调整档案信息。</p></div></div>
              {trips.length ? (
                <div className="grid trip-list-grid">
                  {trips.map((trip) => <TripCard key={trip.id} trip={trip} selected={trip.id === selectedTrip?.id} onSelect={setSelectedTripId} onEdit={(item) => setEditor({ trip: item })} onDelete={deleteTrip} />)}
                </div>
              ) : (
                <div className="empty trip-empty-state"><strong>还没有旅行档案</strong><span>新建一份旅行，添加一个或多个按顺序排列的国内目的地。</span><button type="button" className="btn primary" onClick={() => setEditor({ trip: null })}>创建第一份旅行</button></div>
              )}

              {selectedTrip && (
                <section className="card trip-detail-card" aria-labelledby="trip-detail-heading">
                  <div className="section-head"><div><h2 id="trip-detail-heading">当前旅行档案</h2><p>未填写的信息会单独显示，不会自动补上默认值。</p></div><button type="button" className="btn small" onClick={() => setEditor({ trip: selectedTrip })}>编辑档案</button></div>
                  <div className="trip-detail-name">{selectedTrip.name}</div>
                  <div className="trip-detail-label">目的地顺序</div>
                  {selectedTrip.destinations.length ? <ol className="trip-destination-list">{selectedTrip.destinations.map((destination, index) => <li key={`${index}-${destination}`}><span>{index + 1}</span>{destination}</li>)}</ol> : <p className="trip-unfilled">未填写</p>}
                  <dl className="trip-detail-grid">
                    <div><dt>出发日期</dt><dd>{displayDate(selectedTrip.startDate)}</dd></div>
                    <div><dt>返程日期</dt><dd>{displayDate(selectedTrip.endDate)}</dd></div>
                    <div><dt>同行人数</dt><dd>{selectedTrip.people === null || selectedTrip.people === "" ? "未填写" : `${selectedTrip.people} 人`}</dd></div>
                    <div><dt>总预算</dt><dd>{displayBudget(selectedTrip.budget)}</dd></div>
                    <div className="trip-detail-preferences"><dt>偏好与硬性条件</dt><dd>{selectedTrip.preferences || "未填写"}</dd></div>
                  </dl>
                </section>
              )}
              </>}
            </>
          ) : (
            <DestinationDiscovery tripDestinations={trips.flatMap((trip) => trip.destinations)} />
          )}
        </div>
      </main>

      <nav className="mobile-nav trip-mobile-nav" aria-label="主要导航">
        <button type="button" className={`nav-item${activePage === "trips" ? " active" : ""}`} onClick={() => setActivePage("trips")}>旅行总览</button>
        <button type="button" className={`nav-item${activePage === "destinations" ? " active" : ""}`} onClick={() => setActivePage("destinations")}>目的地发现</button>
      </nav>

      {editor && <TripEditor key={editor.trip?.id ?? "new-trip"} trip={editor.trip} onClose={() => setEditor(null)} onSave={saveTrip} />}
    </div>
  );
}
