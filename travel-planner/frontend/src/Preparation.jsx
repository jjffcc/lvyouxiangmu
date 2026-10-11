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

export default function Preparation({ trip, canEdit, canCreateTrip, onSave, onCreateTrip }) {
  const [editor, setEditor] = useState(null);
  const preparation = trip?.preparation ?? {};
  const companions = preparation.companions ?? [];
  const checklist = preparation.checklist ?? [];

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
      {editor?.type === "companions" && <CompanionEditor key="companions" companions={companions} onClose={() => setEditor(null)} onSave={saveCompanions} />}
      {editor?.type === "checklist" && <ChecklistEditor key={editor.item?.id ?? "new-checklist-item"} item={editor.item} onClose={() => setEditor(null)} onSave={saveChecklistItem} />}
    </>
  );
}
