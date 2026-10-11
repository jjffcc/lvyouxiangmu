import { useState } from "react";
import "./itinerary.css";

const itemCategories = ["景点", "餐饮", "住宿", "交通"];

function isWithinTripDates(date, trip) {
  return (!trip.startDate || date >= trip.startDate) && (!trip.endDate || date <= trip.endDate);
}

function formatDate(date) {
  if (!date) return "未选择日期";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "full" }).format(new Date(`${date}T00:00:00`));
}

function ItineraryItem({ item, outsideRange, canEdit, onEdit, onDelete }) {
  return (
    <article className="card itinerary-item-card">
      <div className="itinerary-item-heading">
        <div>
          <span className="sample-label">{item.category}{outsideRange ? " · 超出当前旅行日期" : ""}</span>
          <h3>{item.name}</h3>
        </div>
        <div className="itinerary-item-actions">
          <button type="button" className="btn small" disabled={!canEdit} onClick={() => onEdit(item)}>编辑</button>
          <button type="button" className="btn small danger" disabled={!canEdit} onClick={() => onDelete(item)}>删除</button>
        </div>
      </div>
      <dl className="itinerary-item-details">
        <div><dt>日期</dt><dd>{formatDate(item.date)}</dd></div>
        <div><dt>时间</dt><dd>{item.time || "未填写"}</dd></div>
        <div><dt>地点或地址</dt><dd>{item.address || "未填写"}</dd></div>
        <div className="itinerary-item-note"><dt>备注</dt><dd>{item.note || "未填写"}</dd></div>
      </dl>
    </article>
  );
}

function ItineraryEditor({ item, selectedDate, trip, onClose, onSave }) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [date, setDate] = useState(item?.date ?? selectedDate);
  const [time, setTime] = useState(item?.time ?? "");
  const [address, setAddress] = useState(item?.address ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请填写事项名称。");
      return;
    }
    if (!category) {
      setError("请选择事项类型。");
      return;
    }
    if (!date) {
      setError("请选择事项日期。");
      return;
    }
    if (!isWithinTripDates(date, trip)) {
      setError("事项日期超出当前旅行档案日期，请先调整旅行档案或事项日期。");
      return;
    }

    const saved = onSave({
      id: item?.id ?? crypto.randomUUID(),
      name: name.trim(),
      category,
      date,
      time,
      address: address.trim(),
      note: note.trim(),
    });
    if (saved) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal itinerary-modal" role="dialog" aria-modal="true" aria-labelledby="itinerary-modal-title">
        <div className="modal-head">
          <div>
            <h2 id="itinerary-modal-title">{item ? "编辑每日事项" : "添加每日事项"}</h2>
            <p>事项保存到当前旅行档案；发现页收藏不会自动加入日程。</p>
          </div>
          <button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="modal-body itinerary-form-body">
            <div className="form-field">
              <label htmlFor="itinerary-name">事项名称</label>
              <input id="itinerary-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="填写活动、用餐、住宿或交通事项" autoFocus />
            </div>
            <div className="itinerary-form-grid">
              <div className="form-field">
                <label htmlFor="itinerary-category">事项类型</label>
                <select id="itinerary-category" className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">请选择</option>
                  {itemCategories.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="itinerary-date">事项日期</label>
                <input id="itinerary-date" className="input" type="date" value={date} min={trip.startDate || undefined} max={trip.endDate || undefined} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="itinerary-time">时间</label>
                <input id="itinerary-time" className="input" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="itinerary-address">地点或地址</label>
                <input id="itinerary-address" className="input" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="可留空" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="itinerary-note">备注</label>
              <textarea id="itinerary-note" className="input itinerary-note-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="可留空" />
            </div>
            {error && <small className="trip-field-error" role="alert">{error}</small>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>取消</button>
            <button type="submit" className="btn primary">保存事项</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Itinerary({ trip, canEdit, onSaveItems, onCreateTrip, canCreateTrip }) {
  const [selectedDate, setSelectedDate] = useState(trip?.startDate ?? "");
  const [editor, setEditor] = useState(null);
  const items = trip?.itineraryItems ?? [];

  if (!trip) {
    return (
      <>
        <div className="page-intro"><div><div className="eyebrow">DAY BY DAY</div><h1>每日行程</h1><p>按旅行日期手动维护每天的活动与事项。</p></div></div>
        <div className="empty trip-empty-state"><strong>还没有旅行档案</strong><span>先创建旅行，再开始整理每日事项。</span><button type="button" className="btn primary" disabled={!canCreateTrip} onClick={onCreateTrip}>创建旅行档案</button></div>
      </>
    );
  }

  const dayItems = selectedDate && isWithinTripDates(selectedDate, trip)
    ? items.filter((item) => item.date === selectedDate)
    : [];
  const outOfRangeItems = items.filter((item) => !isWithinTripDates(item.date, trip));

  function saveItem(item) {
    const nextItems = editor.item
      ? items.map((existing) => existing.id === item.id ? item : existing)
      : [...items, item];
    return onSaveItems(nextItems);
  }

  function deleteItem(item) {
    if (!window.confirm(`确定删除“${item.name}”吗？这只会移除当前旅行中的这项安排。`)) return;
    onSaveItems(items.filter((existing) => existing.id !== item.id));
  }

  return (
    <>
      <div className="page-intro">
        <div><div className="eyebrow">DAY BY DAY</div><h1>每日行程</h1><p>由你决定每天安排什么；地点和时间未填写时会明确显示。</p></div>
        <div className="intro-actions"><button type="button" className="btn primary" disabled={!canEdit || !selectedDate || !isWithinTripDates(selectedDate, trip)} onClick={() => setEditor({ item: null })}>＋ 添加事项</button></div>
      </div>

      <div className="city-switchbar itinerary-day-picker">
        <label htmlFor="itinerary-selected-date">当前旅行：{trip.name}</label>
        <input id="itinerary-selected-date" className="input" type="date" value={selectedDate} min={trip.startDate || undefined} max={trip.endDate || undefined} onChange={(event) => setSelectedDate(event.target.value)} />
        <span>{trip.startDate || trip.endDate ? `旅行日期：${trip.startDate || "未填写"} — ${trip.endDate || "未填写"}` : "旅行日期未填写；请选择明确日期，系统不会代填。"}</span>
      </div>

      <section className="itinerary-day-section">
        <div className="section-head"><div><h2>{formatDate(selectedDate)}</h2><p>{selectedDate ? `${dayItems.length} 项日程` : "选择日期后查看或添加事项。"}</p></div></div>
        {!selectedDate ? (
          <div className="empty itinerary-empty-state"><strong>请选择出行日期</strong><span>档案未填写日期时，可在此明确选择要维护的日期。</span></div>
        ) : !isWithinTripDates(selectedDate, trip) ? (
          <div className="notice itinerary-range-notice" role="status">所选日期不在当前旅行日期范围内。已保存事项仍会保留，请调整档案或日期后查看。</div>
        ) : dayItems.length ? (
          <div className="itinerary-item-list">
            {dayItems.map((item) => <ItineraryItem key={item.id} item={item} canEdit={canEdit} onEdit={(value) => setEditor({ item: value })} onDelete={deleteItem} />)}
          </div>
        ) : (
          <div className="empty itinerary-empty-state"><strong>这一天还没有安排</strong><span>添加第一项活动、用餐、住宿或交通事项。</span><button type="button" className="btn primary" disabled={!canEdit || !isWithinTripDates(selectedDate, trip)} onClick={() => setEditor({ item: null })}>添加第一项</button></div>
        )}
      </section>

      {outOfRangeItems.length > 0 && (
        <section className="itinerary-out-of-range">
          <div className="section-head"><div><h2>超出当前旅行日期的已保存事项</h2><p>调整旅行日期时，既有事项会保留在这里，可编辑日期或删除。</p></div></div>
          <div className="itinerary-item-list">
            {outOfRangeItems.map((item) => <ItineraryItem key={item.id} item={item} outsideRange canEdit={canEdit} onEdit={(value) => setEditor({ item: value })} onDelete={deleteItem} />)}
          </div>
        </section>
      )}

      {editor && <ItineraryEditor key={editor.item?.id ?? `new-${selectedDate}`} item={editor.item} selectedDate={selectedDate} trip={trip} onClose={() => setEditor(null)} onSave={saveItem} />}
    </>
  );
}
