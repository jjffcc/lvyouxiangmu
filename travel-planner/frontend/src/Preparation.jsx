import { useState } from "react";
import "./preparation.css";

function CompanionEditor({ companions, onClose, onSave }) {
  const [people, setPeople] = useState(() => companions.map((person) => ({ ...person })));

  function updatePerson(id, field, value) {
    setPeople((current) => current.map((person) => person.id === id ? { ...person, [field]: value } : person));
  }

  function save() {
    const saved = onSave(people
      .map((person) => ({ ...person, name: person.name.trim(), need: person.need.trim() }))
      .filter((person) => person.name || person.need));
    if (saved) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal preparation-modal" role="dialog" aria-modal="true" aria-labelledby="companion-modal-title">
        <div className="modal-head">
          <div><h2 id="companion-modal-title">同行者需求</h2><p>仅记录当前旅行的同行者和出行需求。</p></div>
          <button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <div className="modal-body preparation-form-body">
          {people.map((person, index) => (
            <div className="companion-editor-row" key={person.id}>
              <div className="form-field"><label htmlFor={`companion-name-${person.id}`}>同行者姓名</label><input id={`companion-name-${person.id}`} className="input" value={person.name} onChange={(event) => updatePerson(person.id, "name", event.target.value)} placeholder={`同行者 ${index + 1}`} /></div>
              <div className="form-field"><label htmlFor={`companion-need-${person.id}`}>出行需求或偏好</label><input id={`companion-need-${person.id}`} className="input" value={person.need} onChange={(event) => updatePerson(person.id, "need", event.target.value)} placeholder="可留空" /></div>
              <button type="button" className="icon-btn companion-remove-button" aria-label={`移除同行者 ${index + 1}`} onClick={() => setPeople((current) => current.filter((item) => item.id !== person.id))}>×</button>
            </div>
          ))}
          <button type="button" className="btn small companion-add-button" onClick={() => setPeople((current) => [...current, { id: crypto.randomUUID(), name: "", need: "" }])}>＋ 添加同行者</button>
        </div>
        <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>取消</button><button type="button" className="btn primary" onClick={save}>保存需求</button></div>
      </section>
    </div>
  );
}

function ChecklistEditor({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [error, setError] = useState("");

  function save(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("请填写准备事项。");
      return;
    }
    const saved = onSave({ id: item?.id ?? crypto.randomUUID(), title: title.trim(), done: item?.done ?? false });
    if (saved) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal preparation-modal" role="dialog" aria-modal="true" aria-labelledby="checklist-modal-title">
        <div className="modal-head">
          <div><h2 id="checklist-modal-title">{item ? "编辑准备事项" : "添加准备事项"}</h2><p>完成状态由你手动勾选。</p></div>
          <button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <form onSubmit={save} noValidate>
          <div className="modal-body preparation-form-body">
            <div className="form-field"><label htmlFor="checklist-title">事项</label><input id="checklist-title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：确认住宿地址" autoFocus /></div>
            {error && <small className="trip-field-error" role="alert">{error}</small>}
          </div>
          <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>取消</button><button type="submit" className="btn primary">保存事项</button></div>
        </form>
      </section>
    </div>
  );
}

function ReservationWeatherEditor({ reservation, weatherNote, onClose, onSave }) {
  const [reservationText, setReservationText] = useState(reservation);
  const [noteText, setNoteText] = useState(weatherNote);

  function save(event) {
    event.preventDefault();
    if (onSave({ reservation: reservationText.trim(), weatherNote: noteText.trim() })) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal preparation-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-modal-title">
        <div className="modal-head"><div><h2 id="reservation-modal-title">预约与天气备注</h2><p>这里只保存你的记录，不代表本站已确认预约或提供实时天气。</p></div><button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button></div>
        <form onSubmit={save}>
          <div className="modal-body preparation-form-body">
            <div className="form-field"><label htmlFor="preparation-reservation">预约/待确认信息</label><textarea id="preparation-reservation" className="input preparation-textarea" value={reservationText} onChange={(event) => setReservationText(event.target.value)} placeholder="未填写；记录预约时间、事项或待核实内容" /></div>
            <div className="form-field"><label htmlFor="preparation-weather-note">天气查询备注</label><textarea id="preparation-weather-note" className="input preparation-textarea" value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="可留空" /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>取消</button><button type="submit" className="btn primary">保存信息</button></div>
        </form>
      </section>
    </div>
  );
}

function AccommodationEditor({ accommodation, onClose, onSave }) {
  const [name, setName] = useState(accommodation.name ?? "");
  const [address, setAddress] = useState(accommodation.address ?? "");
  const [note, setNote] = useState(accommodation.note ?? "");

  function save(event) {
    event.preventDefault();
    if (onSave({ name: name.trim(), address: address.trim(), note: note.trim() })) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal preparation-modal" role="dialog" aria-modal="true" aria-labelledby="accommodation-modal-title">
        <div className="modal-head"><div><h2 id="accommodation-modal-title">住宿信息</h2><p>由你记录；不代表本站已完成预订。</p></div><button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button></div>
        <form onSubmit={save}>
          <div className="modal-body preparation-form-body">
            <div className="form-field"><label htmlFor="accommodation-name">住宿名称</label><input id="accommodation-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="未填写" /></div>
            <div className="form-field"><label htmlFor="accommodation-address">住宿地址</label><input id="accommodation-address" className="input" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="未填写" /></div>
            <div className="form-field"><label htmlFor="accommodation-note">备注</label><textarea id="accommodation-note" className="input preparation-textarea" value={note} onChange={(event) => setNote(event.target.value)} placeholder="可留空" /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>取消</button><button type="submit" className="btn primary">保存住宿信息</button></div>
        </form>
      </section>
    </div>
  );
}

function EmergencyContactEditor({ contact, onClose, onSave }) {
  const [name, setName] = useState(contact.name ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [note, setNote] = useState(contact.note ?? "");

  function save(event) {
    event.preventDefault();
    if (onSave({ name: name.trim(), phone: phone.trim(), note: note.trim() })) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal preparation-modal" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title">
        <div className="modal-head"><div><h2 id="emergency-modal-title">紧急联系人</h2><p>保存后，电话号码在页面中默认遮盖。</p></div><button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button></div>
        <form onSubmit={save}>
          <div className="modal-body preparation-form-body">
            <div className="form-field"><label htmlFor="emergency-contact-name">联系人姓名</label><input id="emergency-contact-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="未填写" /></div>
            <div className="form-field"><label htmlFor="emergency-contact-phone">联系电话</label><input id="emergency-contact-phone" className="input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="未填写" /></div>
            <div className="form-field"><label htmlFor="emergency-contact-note">备注</label><textarea id="emergency-contact-note" className="input preparation-textarea" value={note} onChange={(event) => setNote(event.target.value)} placeholder="可留空" /></div>
          </div>
          <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>取消</button><button type="submit" className="btn primary">保存联系人</button></div>
        </form>
      </section>
    </div>
  );
}

function CompanionCard({ companions, canEdit, onEdit }) {
  return (
    <section className="card preparation-card">
      <div className="section-head preparation-card-head">
        <div><h2>同行者需求</h2><p>饮食、行动或其他出行偏好</p></div>
        <button type="button" className="btn small" disabled={!canEdit} onClick={onEdit}>{companions.length ? "编辑" : "添加"}</button>
      </div>
      {companions.length ? (
        <ul className="companion-list">
          {companions.map((person) => <li key={person.id}><span className="companion-avatar" aria-hidden="true">{person.name?.slice(0, 1) || "?"}</span><span><strong>{person.name || "姓名未填写"}</strong><small>{person.need || "出行需求未填写"}</small></span></li>)}
        </ul>
      ) : (
        <div className="preparation-empty"><strong>未填写同行者需求</strong><span>添加同行者姓名及可选的出行需求或偏好。</span></div>
      )}
    </section>
  );
}

function ChecklistCard({ items, canEdit, onToggle, onAdd, onEdit, onDelete }) {
  const completed = items.filter((item) => item.done).length;

  return (
    <section className="card preparation-card">
      <div className="section-head preparation-card-head">
        <div><h2>准备清单</h2><p>{completed} / {items.length} 项完成</p></div>
        <button type="button" className="btn small" disabled={!canEdit} onClick={onAdd}>＋ 添加事项</button>
      </div>
      {items.length ? (
        <ul className="preparation-checklist">
          {items.map((item) => (
            <li key={item.id} className={item.done ? "is-complete" : ""}>
              <label><input type="checkbox" checked={item.done} disabled={!canEdit} onChange={(event) => onToggle(item, event.target.checked)} /><span><strong>{item.title}</strong><small>{item.done ? "已完成" : "出发前核对"}</small></span></label>
              <div className="preparation-row-actions"><button type="button" className="btn small" disabled={!canEdit} onClick={() => onEdit(item)}>编辑</button><button type="button" className="btn small danger" disabled={!canEdit} onClick={() => onDelete(item)}>删除</button></div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="preparation-empty"><strong>清单尚未填写</strong><span>添加准备事项后，再由你手动标记完成。</span><button type="button" className="btn small" disabled={!canEdit} onClick={onAdd}>添加第一项</button></div>
      )}
    </section>
  );
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "未填写";
  if (digits.length <= 4) return "•".repeat(digits.length);
  return `${"•".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export default function Preparation({ trip, canEdit, canCreateTrip, onSave, onCreateTrip }) {
  const [editor, setEditor] = useState(null);
  const preparation = trip?.preparation ?? {};
  const companions = preparation.companions ?? [];
  const checklist = preparation.checklist ?? [];
  const accommodation = preparation.accommodation ?? {};
  const emergencyContact = preparation.emergencyContact ?? {};
  const [reservation, setReservation] = useState(preparation.reservation ?? "");
  const [weatherNote, setWeatherNote] = useState(preparation.weatherNote ?? "");
  const [showEmergencyPhone, setShowEmergencyPhone] = useState(false);

  if (!trip) {
    return (
      <>
        <div className="page-intro"><div><div className="eyebrow">GET READY</div><h1>出行准备</h1><p>按旅行整理同行者需求和出发前待办。</p></div></div>
        <div className="empty trip-empty-state"><strong>还没有旅行档案</strong><span>先创建旅行，再记录同行者需求和准备清单。</span><button type="button" className="btn primary" disabled={!canCreateTrip} onClick={onCreateTrip}>创建旅行档案</button></div>
      </>
    );
  }

  function saveCompanions(nextCompanions) {
    return onSave({ ...preparation, companions: nextCompanions });
  }

  function saveChecklistItem(item) {
    const nextItems = editor.item
      ? checklist.map((existing) => existing.id === item.id ? item : existing)
      : [...checklist, item];
    return onSave({ ...preparation, checklist: nextItems });
  }

  function toggleChecklistItem(item, done) {
    onSave({ ...preparation, checklist: checklist.map((existing) => existing.id === item.id ? { ...existing, done } : existing) });
  }

  function deleteChecklistItem(item) {
    if (!window.confirm(`确定删除“${item.title}”这项准备事项吗？`)) return;
    onSave({ ...preparation, checklist: checklist.filter((existing) => existing.id !== item.id) });
  }

  function saveReservationWeather(values) {
    return onSave({ ...preparation, ...values });
  }

  function saveAccommodation(nextAccommodation) {
    return onSave({ ...preparation, accommodation: nextAccommodation });
  }

  function saveEmergencyContact(nextContact) {
    return onSave({ ...preparation, emergencyContact: nextContact });
  }

  return (
    <>
      <div className="page-intro"><div><div className="eyebrow">GET READY</div><h1>出行准备</h1><p>当前旅行：{trip.name}。需求和清单仅保存在这份旅行档案中。</p></div></div>
      <div className="preparation-grid">
        <CompanionCard companions={companions} canEdit={canEdit} onEdit={() => setEditor({ type: "companions" })} />
        <ChecklistCard
          items={checklist}
          canEdit={canEdit}
          onToggle={toggleChecklistItem}
          onAdd={() => setEditor({ type: "checklist", item: null })}
          onEdit={(item) => setEditor({ type: "checklist", item })}
          onDelete={deleteChecklistItem}
        />
      </div>
      <section className="card preparation-detail-card">
        <div className="section-head preparation-card-head">
          <div><h2>预约与天气查询</h2><p>预约信息由你记录；天气数据来自外部网站。</p></div>
          <button type="button" className="btn small" disabled={!canEdit} onClick={() => setEditor({ type: "reservation-weather" })}>编辑</button>
        </div>
        <div className="preparation-details-grid">
          <div className="preparation-saved-field"><span>预约/待确认信息</span><p>{preparation.reservation || "未填写"}</p><small>用户记录，不代表外部预约已确认。</small></div>
          <div className="preparation-saved-field"><span>天气查询备注</span><p>{weatherNote || "未填写"}</p><small><a href="https://www.weather.com.cn/" target="_blank" rel="noreferrer">打开天气查询网站 ↗</a> · 出发前请再次核实。</small></div>
        </div>
      </section>
      <div className="preparation-grid preparation-extra-grid">
        <section className="card preparation-detail-card">
          <div className="section-head preparation-card-head"><div><h2>住宿信息</h2><p>由你维护当前旅行的住宿记录。</p></div><button type="button" className="btn small" disabled={!canEdit} onClick={() => setEditor({ type: "accommodation" })}>编辑</button></div>
          <dl className="preparation-saved-list">
            <div><dt>住宿名称</dt><dd>{accommodation.name || "未填写"}</dd></div>
            <div><dt>住宿地址</dt><dd>{accommodation.address || "未填写"}</dd></div>
            <div><dt>备注</dt><dd>{accommodation.note || "未填写"}</dd></div>
          </dl>
        </section>
        <section className="card preparation-detail-card">
          <div className="section-head preparation-card-head"><div><h2>紧急联系人</h2><p>联系电话默认遮盖；显示仅在当前页面有效。</p></div><button type="button" className="btn small" disabled={!canEdit} onClick={() => setEditor({ type: "emergency-contact" })}>编辑</button></div>
          <dl className="preparation-saved-list">
            <div><dt>联系人</dt><dd>{emergencyContact.name || "未填写"}</dd></div>
            <div className="emergency-phone-field"><dt>联系电话</dt><dd>{showEmergencyPhone ? emergencyContact.phone || "未填写" : maskPhone(emergencyContact.phone ?? "")}</dd><button type="button" className="btn small" disabled={!emergencyContact.phone} aria-pressed={showEmergencyPhone} onClick={() => setShowEmergencyPhone((visible) => !visible)}>{showEmergencyPhone ? "隐藏号码" : "显示号码"}</button></div>
            <div><dt>备注</dt><dd>{emergencyContact.note || "未填写"}</dd></div>
          </dl>
        </section>
      </div>
      {editor?.type === "companions" && <CompanionEditor key="companions" companions={companions} onClose={() => setEditor(null)} onSave={saveCompanions} />}
      {editor?.type === "checklist" && <ChecklistEditor key={editor.item?.id ?? "new-checklist-item"} item={editor.item} onClose={() => setEditor(null)} onSave={saveChecklistItem} />}
      {editor?.type === "reservation-weather" && <ReservationWeatherEditor key="reservation-weather" reservation={reservation} weatherNote={weatherNote} onClose={() => setEditor(null)} onSave={(values) => { const saved = saveReservationWeather(values); if (saved) { setReservation(values.reservation); setWeatherNote(values.weatherNote); } return saved; }} />}
      {editor?.type === "accommodation" && <AccommodationEditor key="accommodation" accommodation={accommodation} onClose={() => setEditor(null)} onSave={saveAccommodation} />}
      {editor?.type === "emergency-contact" && <EmergencyContactEditor key="emergency-contact" contact={emergencyContact} onClose={() => setEditor(null)} onSave={(value) => { const saved = saveEmergencyContact(value); if (saved) setShowEmergencyPhone(false); return saved; }} />}
    </>
  );
}
