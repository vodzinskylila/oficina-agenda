import { MAX_PER_WEEK, fmt, toKey, todayKey, weekDays, weekKeyOf } from "../utils/dates";
import { countInWeek } from "../hooks/useBookings";

export default function WeekView({ cursor, bookings, onNew, onEdit }) {
  const days = weekDays(cursor);
  const today = todayKey();
  const full = countInWeek(bookings, toKey(days[0])) >= MAX_PER_WEEK;

  return (
    <div className="week">
      {days.map((d) => {
        const key = toKey(d);
        const items = bookings.filter((b) => b.date === key);
        const closed = d.getDay() === 0;
        const past = key < today;
        const canBook = !closed && !past && !full;

        return (
          <section
            key={key}
            className={`day ${key === today ? "today" : ""} ${closed ? "closed" : ""}`}
          >
            <header>
              <span>{fmt.weekdayShort(d)}</span>
              <strong>{d.getDate()}</strong>
            </header>

            <div className="cards">
              {closed && <p className="empty">Fechado</p>}
              {!closed && items.length === 0 && <p className="empty">Livre</p>}
              {items.map((b) => (
                <button key={b.id} className="card" onClick={() => onEdit(b)}>
                  <strong>{b.name}</strong>
                  <span>
                    {b.model || "Veículo"} · {b.plate}
                  </span>
                  <em>{b.service}</em>
                </button>
              ))}
            </div>

            {canBook && (
              <button className="pill ghost small" onClick={() => onNew(key)}>
                + Reservar
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
