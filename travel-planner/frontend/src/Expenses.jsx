import { useState } from "react";
import "./expenses.css";

const expenseCategories = ["交通", "住宿", "门票", "餐饮", "租车", "其他"];

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === "") return "未填写";
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(amount);
}

function hasAmount(amount) {
  return amount !== null && amount !== undefined && amount !== "";
}

function sumEnteredAmounts(items, field) {
  const amounts = items.map((item) => item[field]).filter(hasAmount);
  return amounts.length ? amounts.reduce((total, amount) => total + amount, 0) : null;
}

function formatDate(date) {
  if (!date) return "未填写";
  return new Intl.DateTimeFormat("zh-CN").format(new Date(`${date}T00:00:00`));
}

function ExpenseEditor({ item, onClose, onSave }) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [date, setDate] = useState(item?.date ?? "");
  const [quantity, setQuantity] = useState(item?.quantity ?? "");
  const [referenceAmount, setReferenceAmount] = useState(item?.referenceAmount ?? "");
  const [actualAmount, setActualAmount] = useState(item?.actualAmount ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请填写项目名称。");
      return;
    }
    if (!category) {
      setError("请选择费用类别。");
      return;
    }

    let savedQuantity = null;
    if (quantity !== "") {
      savedQuantity = Number(quantity);
      if (!Number.isInteger(savedQuantity) || savedQuantity < 1) {
        setError("数量请填写大于 0 的整数，或留空。");
        return;
      }
    }

    let savedReferenceAmount = null;
    if (referenceAmount !== "") {
      savedReferenceAmount = Number(referenceAmount);
      if (!Number.isFinite(savedReferenceAmount) || savedReferenceAmount < 0) {
        setError("参考总额请填写不小于 0 的金额，或留空。");
        return;
      }
    }

    let savedActualAmount = null;
    if (actualAmount !== "") {
      savedActualAmount = Number(actualAmount);
      if (!Number.isFinite(savedActualAmount) || savedActualAmount < 0) {
        setError("实际总额请填写不小于 0 的金额，或留空。");
        return;
      }
    }

    const trimmedLink = link.trim();
    if (trimmedLink) {
      try {
        const parsedLink = new URL(trimmedLink);
        if (!["http:", "https:"].includes(parsedLink.protocol)) throw new Error("unsupported protocol");
      } catch {
        setError("请填写有效的 http 或 https 外部链接，或留空。");
        return;
      }
    }

    const saved = onSave({
      id: item?.id ?? crypto.randomUUID(),
      name: name.trim(),
      category,
      date,
      quantity: savedQuantity,
      referenceAmount: savedReferenceAmount,
      actualAmount: savedActualAmount,
      link: trimmedLink,
      note: note.trim(),
    });
    if (saved) onClose();
  }

  return (
    <div id="modal-root" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal expense-modal" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
        <div className="modal-head">
          <div>
            <h2 id="expense-modal-title">{item ? "编辑购买信息" : "添加购买信息"}</h2>
            <p>记录计划参考信息和手动登记的实际金额；外部购买由你自行处理。</p>
          </div>
          <button type="button" className="modal-x" aria-label="关闭" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="modal-body expense-form-body">
            <div className="expense-form-grid">
              <div className="form-field">
                <label htmlFor="expense-name">项目名称</label>
                <input id="expense-name" className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：景点门票" autoFocus />
              </div>
              <div className="form-field">
                <label htmlFor="expense-category">费用类别</label>
                <select id="expense-category" className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">请选择</option>
                  {expenseCategories.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="expense-date">计划日期</label>
                <input id="expense-date" className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="expense-quantity">数量</label>
                <input id="expense-quantity" className="input" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="可留空" />
              </div>
              <div className="form-field">
                <label htmlFor="expense-reference-amount">参考总额（元）</label>
                <input id="expense-reference-amount" className="input" type="number" min="0" step="0.01" value={referenceAmount} onChange={(event) => setReferenceAmount(event.target.value)} placeholder="可留空" />
              </div>
              <div className="form-field">
                <label htmlFor="expense-actual-amount">实际总额（元）</label>
                <input id="expense-actual-amount" className="input" type="number" min="0" step="0.01" value={actualAmount} onChange={(event) => setActualAmount(event.target.value)} placeholder="未记录可留空" />
              </div>
              <div className="form-field">
                <label htmlFor="expense-link">外部购买链接</label>
                <input id="expense-link" className="input" type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://…（可留空）" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="expense-note">备注</label>
              <textarea id="expense-note" className="input expense-note-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="可留空" />
            </div>
            {error && <small className="trip-field-error" role="alert">{error}</small>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>取消</button>
            <button type="submit" className="btn primary">保存信息</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ExpenseCard({ item, canEdit, onEdit, onDelete }) {
  return (
    <article className="card expense-item-card">
      <div className="expense-item-heading">
        <div><span className="sample-label">{item.category}</span><h3>{item.name}</h3></div>
        <div className="expense-item-actions">
          <button type="button" className="btn small" disabled={!canEdit} onClick={() => onEdit(item)}>编辑</button>
          <button type="button" className="btn small danger" disabled={!canEdit} onClick={() => onDelete(item)}>删除</button>
        </div>
      </div>
      <dl className="expense-item-details">
        <div><dt>计划日期</dt><dd>{formatDate(item.date)}</dd></div>
        <div><dt>数量</dt><dd>{item.quantity ?? "未填写"}</dd></div>
        <div><dt>参考总额</dt><dd>{formatAmount(item.referenceAmount)}</dd></div>
        <div><dt>实际总额</dt><dd>{formatAmount(item.actualAmount)}</dd></div>
        <div className="expense-item-note"><dt>备注</dt><dd>{item.note || "未填写"}</dd></div>
      </dl>
      <p className={`tiny expense-record-status${hasAmount(item.actualAmount) ? " is-recorded" : " is-incomplete"}`}>
        {hasAmount(item.actualAmount) ? "实际金额由你登记，外部交易未经核验。" : "记录不完整：实际金额未填写；不能据此判断是否已付款。"}
      </p>
      {item.link && <a className="btn small expense-external-link" href={item.link} target="_blank" rel="noreferrer">打开外部供应方页面 ↗</a>}
      <p className="tiny expense-external-note">参考金额仅供计划，不代表已购买或已付款。外部链接会离开途见。</p>
    </article>
  );
}

export default function Expenses({ trip, canEdit, canCreateTrip, onSaveItems, onCreateTrip }) {
  const [editor, setEditor] = useState(null);
  const items = trip?.expenses ?? [];
  const referenceTotal = sumEnteredAmounts(items, "referenceAmount");
  const actualTotal = sumEnteredAmounts(items, "actualAmount");
  const incompleteActualCount = items.filter((item) => !hasAmount(item.actualAmount)).length;
  const budgetDifference = trip && hasAmount(trip.budget) && hasAmount(actualTotal)
    ? trip.budget - actualTotal
    : null;

  if (!trip) {
    return (
      <>
        <div className="page-intro"><div><div className="eyebrow">PURCHASE NOTES</div><h1>购买信息</h1><p>记录当前旅行的计划项目和参考信息。</p></div></div>
        <div className="empty trip-empty-state"><strong>还没有旅行档案</strong><span>先创建旅行，再记录购买信息。</span><button type="button" className="btn primary" disabled={!canCreateTrip} onClick={onCreateTrip}>创建旅行档案</button></div>
      </>
    );
  }

  function saveItem(item) {
    const nextItems = editor.item
      ? items.map((existing) => existing.id === item.id ? item : existing)
      : [...items, item];
    return onSaveItems(nextItems);
  }

  function deleteItem(item) {
    if (!window.confirm(`确定删除“${item.name}”这条购买信息吗？`)) return;
    onSaveItems(items.filter((existing) => existing.id !== item.id));
  }

  return (
    <>
      <div className="page-intro">
        <div><div className="eyebrow">PURCHASE NOTES</div><h1>购买信息</h1><p>整理计划项目、参考总额和外部供应方链接，不处理站内交易。</p></div>
        <div className="intro-actions"><button type="button" className="btn primary" disabled={!canEdit} onClick={() => setEditor({ item: null })}>＋ 添加项目</button></div>
      </div>
      <section className="expense-summary" aria-label="旅行费用汇总">
        <div><span>总预算</span><strong>{formatAmount(trip.budget)}</strong></div>
        <div><span>参考费用合计</span><strong>{formatAmount(referenceTotal)}</strong></div>
        <div><span>实际费用合计（已登记）</span><strong>{formatAmount(actualTotal)}</strong></div>
        <div><span>预算差额（按已登记实际金额）</span><strong>{formatAmount(budgetDifference)}</strong></div>
      </section>
      {incompleteActualCount > 0 && (
        <div className="notice expense-incomplete-notice" role="status">
          费用记录未完整：{incompleteActualCount} 项尚未填写实际金额。实际费用合计仅包含已填写的金额。
        </div>
      )}
      <div className="notice expense-trip-context"><strong>当前旅行：</strong>{trip.name}<span>参考金额和外部链接不会更新购买状态；实际金额由你手动登记，未核验外部交易。</span></div>
      {items.length ? (
        <div className="expense-item-list">
          {items.map((item) => <ExpenseCard key={item.id} item={item} canEdit={canEdit} onEdit={(value) => setEditor({ item: value })} onDelete={deleteItem} />)}
        </div>
      ) : (
        <div className="empty expense-empty-state"><strong>还没有购买信息</strong><span>添加一项计划后，数量、参考总额和供应方链接会保存在当前旅行中。</span><button type="button" className="btn primary" disabled={!canEdit} onClick={() => setEditor({ item: null })}>添加第一项</button></div>
      )}
      {editor && <ExpenseEditor key={editor.item?.id ?? "new-expense"} item={editor.item} onClose={() => setEditor(null)} onSave={saveItem} />}
    </>
  );
}
