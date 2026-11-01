import { MAX_PER_WEEK, monthGrid, toKey, todayKey, weekKeyOf } from "../utils/dates";
import { countInWeek } from "../hooks/useBookings";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function MonthView({ cursor, bookings, onNew, onEdit }) {
  const days = monthGrid(cursor);
  const today = todayKey();

  return (
    <div className="month">
      <div className="weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="grid">
        {days.map((d) => {
          const key = toKey(d);
          const items = bookings.filter((b) => b.date === key);
          const outside = d.getMonth() !== cursor.getMonth();
          const closed = d.getDay() === 0;
          const past = key < today;
          const full = countInWeek(bookings, weekKeyOf(key)) >= MAX_PER_WEEK;
          const canBook = !closed && !past && !full;

          const cls = [
            "cell",
            outside && "outside",
            closed && "closed",
            past && "past",
            full && !closed && "full",
            key === today && "today",
            canBook && "bookable",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={key}
              className={cls}
              onClick={() => canBook && onNew(key)}
            >
              <span className="num">{d.getDate()}</span>

              {canBook && (
                <button
                  className="add"
                  aria-label={`Nova reserva em ${key}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNew(key);
                  }}
                >
                  +
                </button>
              )}

              <div className="chips">
                {items.slice(0, 2).map((b) => (
                  <button
                    key={b.id}
                    className="chip"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(b);
                    }}
                  >
                    {b.model || b.name}
                  </button>
                ))}
                {items.length > 2 && (
                  <span className="more">+{items.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
