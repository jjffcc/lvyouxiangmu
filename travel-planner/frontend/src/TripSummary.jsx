import { formatAmount, hasAmount, sumEnteredAmounts } from "./Expenses.jsx";
import { maskPhone } from "./Preparation.jsx";
import "./trip-summary.css";

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "未填写" : value;
}

function formatDate(date) {
  if (!date) return "未填写日期";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "full" }).format(new Date(`${date}T00:00:00`));
}

function groupItineraryItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    const date = item.date ?? "";
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push(item);
  });
  return [...groups.entries()].sort(([left], [right]) => {
    if (!left) return 1;
    if (!right) return -1;
    return left.localeCompare(right);
  });
}

function isOutsideTripDates(date, trip) {
  return Boolean(date && ((trip.startDate && date < trip.startDate) || (trip.endDate && date > trip.endDate)));
}

function SummaryField({ label, children }) {
  return (
    <div className="trip-summary-field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function EmptyMessage({ children }) {
  return <p className="trip-summary-empty">{children}</p>;
}

function ItinerarySection({ trip, onNavigate }) {
  const items = trip.itineraryItems ?? [];
  const days = groupItineraryItems(items);

  return (
    <section className="card trip-summary-section" aria-labelledby="trip-summary-itinerary">
      <div className="section-head">
        <div><h2 id="trip-summary-itinerary">每日行程</h2><p>按日期排列；同一天保留你在每日行程中的手工顺序。</p></div>
        <button type="button" className="btn small" onClick={() => onNavigate("itinerary")}>查看每日行程</button>
      </div>
      {days.length ? (
        <div className="trip-summary-days">
          {days.map(([date, dayItems]) => (
            <section className="trip-summary-day" key={date || "undated"}>
              <header className="trip-summary-day-head">
                <h3>{formatDate(date)}</h3>
                <span>{dayItems.length} 项</span>
              </header>
              <ol className="trip-summary-itinerary-list">
                {dayItems.map((item, index) => (
                  <li className="trip-summary-itinerary-item" key={item.id}>
                    <span className="trip-summary-item-order">{index + 1}</span>
                    <div className="trip-summary-item-content">
                      <div className="trip-summary-item-title">
                        <strong>{displayValue(item.name)}</strong>
                        <span className="sample-label">{displayValue(item.category)}</span>
                        {item.locked && <span className="trip-summary-lock">已锁定</span>}
                        {isOutsideTripDates(date, trip) && <span className="trip-summary-outside">超出旅行日期</span>}
                      </div>
                      <dl className="trip-summary-item-details">
                        <SummaryField label="时间">{displayValue(item.time)}</SummaryField>
                        <SummaryField label="地点或地址">{displayValue(item.address)}</SummaryField>
                        <SummaryField label="备注">{displayValue(item.note)}</SummaryField>
                      </dl>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <EmptyMessage>每日行程尚未填写。</EmptyMessage>
      )}
      <div className="trip-summary-route-note">
        <div><strong>动态路线参考</strong><p>路线、距离和预计时长需在每日行程中按日期发起高德查询；查询结果不保存在旅行资料中，本页不会展示过期路线。</p></div>
        <button type="button" className="btn small" onClick={() => onNavigate("itinerary")}>前往查询路线</button>
      </div>
    </section>
  );
}

function ExpenseSection({ trip, onNavigate }) {
  const expenses = trip.expenses ?? [];
  const referenceTotal = sumEnteredAmounts(expenses, "referenceAmount");
  const actualTotal = sumEnteredAmounts(expenses, "actualAmount");
  const missingActualCount = expenses.filter((item) => !hasAmount(item.actualAmount)).length;

  return (
    <section className="card trip-summary-section" aria-labelledby="trip-summary-expenses">
      <div className="section-head">
        <div><h2 id="trip-summary-expenses">旅行费用</h2><p>总预算、参考费用和已登记实际费用分别计算。</p></div>
        <button type="button" className="btn small" onClick={() => onNavigate("expenses")}>查看购买信息</button>
      </div>
      <div className="trip-summary-metrics">
        <div><span>总预算</span><strong>{formatAmount(trip.budget)}</strong></div>
        <div><span>参考费用合计</span><strong>{formatAmount(referenceTotal)}</strong></div>
        <div><span>实际费用合计（已登记）</span><strong>{formatAmount(actualTotal)}</strong></div>
      </div>
      {expenses.length ? (
        <>
          <p className="trip-summary-disclaimer">实际费用合计只包含已填写金额；记录不代表外部交易已核实或已付款。{missingActualCount > 0 ? ` ${missingActualCount} 项尚未填写实际金额。` : ""}</p>
          <div className="trip-summary-expense-list">
            {expenses.map((item) => (
              <article className="trip-summary-expense" key={item.id}>
                <div className="trip-summary-expense-name">
                  <strong>{displayValue(item.name)}</strong>
                  <span>{displayValue(item.category)} · {item.date ? formatDate(item.date) : "日期未填写"}</span>
                </div>
                <dl className="trip-summary-expense-amounts">
                  <SummaryField label="数量">{displayValue(item.quantity)}</SummaryField>
                  <SummaryField label="参考总额">{formatAmount(item.referenceAmount)}</SummaryField>
                  <SummaryField label="实际总额">{formatAmount(item.actualAmount)}</SummaryField>
                  <SummaryField label="备注">{displayValue(item.note)}</SummaryField>
                </dl>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyMessage>购买信息尚未填写。</EmptyMessage>
      )}
    </section>
  );
}

function PreparationSection({ trip, onNavigate }) {
  const preparation = trip.preparation ?? {};
  const checklist = preparation.checklist ?? [];
  const companions = preparation.companions ?? [];
  const accommodation = preparation.accommodation ?? {};
  const emergencyContact = preparation.emergencyContact ?? {};
  const completedCount = checklist.filter((item) => item.done).length;

  return (
    <section className="card trip-summary-section" aria-labelledby="trip-summary-preparation">
      <div className="section-head">
        <div><h2 id="trip-summary-preparation">出行准备</h2><p>{completedCount} / {checklist.length} 项清单已完成</p></div>
        <button type="button" className="btn small" onClick={() => onNavigate("preparation")}>查看出行准备</button>
      </div>
      <div className="trip-summary-preparation-grid">
        <section className="trip-summary-subsection">
          <h3>预约与待确认</h3>
          <p className="trip-summary-pre-wrap">{displayValue(preparation.reservation)}</p>
          <small>由你记录，不代表外部预约已确认。</small>
        </section>
        <section className="trip-summary-subsection">
          <h3>住宿信息</h3>
          <dl className="trip-summary-fields">
            <SummaryField label="住宿名称">{displayValue(accommodation.name)}</SummaryField>
            <SummaryField label="住宿地址">{displayValue(accommodation.address)}</SummaryField>
            <SummaryField label="备注">{displayValue(accommodation.note)}</SummaryField>
          </dl>
        </section>
        <section className="trip-summary-subsection">
          <h3>紧急联系人</h3>
          <dl className="trip-summary-fields">
            <SummaryField label="联系人">{displayValue(emergencyContact.name)}</SummaryField>
            <SummaryField label="联系电话">{maskPhone(emergencyContact.phone ?? "")}</SummaryField>
            <SummaryField label="备注">{displayValue(emergencyContact.note)}</SummaryField>
          </dl>
          <small>电话号码按出行准备页面规则默认遮盖。</small>
        </section>
        <section className="trip-summary-subsection">
          <h3>同行者需求</h3>
          {companions.length ? (
            <ul className="trip-summary-list">
              {companions.map((person) => <li key={person.id}><strong>{displayValue(person.name)}</strong><span>{displayValue(person.need)}</span></li>)}
            </ul>
          ) : <EmptyMessage>同行者需求尚未填写。</EmptyMessage>}
        </section>
        <section className="trip-summary-subsection trip-summary-checklist-section">
          <h3>准备清单</h3>
          {checklist.length ? (
            <ul className="trip-summary-list trip-summary-checklist">
              {checklist.map((item) => <li key={item.id}><span className={item.done ? "is-complete" : "is-pending"}>{item.done ? "✓" : "·"}</span><strong>{displayValue(item.title)}</strong><small>{item.done ? "已完成" : "待完成"}</small></li>)}
            </ul>
          ) : <EmptyMessage>准备清单尚未填写。</EmptyMessage>}
        </section>
        <section className="trip-summary-subsection">
          <h3>天气查询备注</h3>
          <p className="trip-summary-pre-wrap">{displayValue(preparation.weatherNote)}</p>
          <small>此处是用户备注，不是实时天气数据。</small>
        </section>
      </div>
    </section>
  );
}

export default function TripSummary({ trip, onCreateTrip, onNavigate }) {
  return (
    <div className="trip-summary-page">
      <div className="page-intro">
        <div><div className="eyebrow">YOUR COMPLETE TRIP</div><h1>完整旅行计划</h1><p>只读汇总当前旅行资料；修改档案后，这里会显示最新内容。</p></div>
      </div>
      {!trip ? (
        <div className="empty trip-empty-state"><strong>还没有旅行档案</strong><span>创建旅行后，这里会汇总行程、费用和出行准备。</span><button type="button" className="btn primary" onClick={onCreateTrip}>创建旅行档案</button></div>
      ) : (
        <>
          <section className="card trip-summary-hero" aria-labelledby="trip-summary-title">
            <div className="trip-summary-hero-top"><span className="eyebrow">旅行概览</span><span className="sample-label">当前旅行数据汇总</span></div>
            <h2 id="trip-summary-title">{displayValue(trip.name)}</h2>
            <ol className="trip-summary-destinations" aria-label="目的地顺序">
              {trip.destinations?.length ? trip.destinations.map((city, index) => <li key={`${index}-${city}`}><span>{index + 1}</span>{displayValue(city)}</li>) : <li>未填写</li>}
            </ol>
            <dl className="trip-summary-trip-fields">
              <SummaryField label="出发日期">{formatDate(trip.startDate)}</SummaryField>
              <SummaryField label="返程日期">{formatDate(trip.endDate)}</SummaryField>
              <SummaryField label="同行人数">{trip.people === null || trip.people === undefined || trip.people === "" ? "未填写" : `${trip.people} 人`}</SummaryField>
              <SummaryField label="偏好与硬性条件">{displayValue(trip.preferences)}</SummaryField>
            </dl>
          </section>
          <ItinerarySection trip={trip} onNavigate={onNavigate} />
          <ExpenseSection trip={trip} onNavigate={onNavigate} />
          <PreparationSection trip={trip} onNavigate={onNavigate} />
          <p className="trip-summary-readonly-note">本页只读。预约和住宿信息由你记录，未与外部供应方核实；动态路线、店铺与地图查询不会在此页缓存或补造。</p>
        </>
      )}
    </div>
  );
}
