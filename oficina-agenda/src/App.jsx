import { useEffect, useState } from "react";
import { useBookings, countInWeek } from "./hooks/useBookings";
import { addDays, fmt, fromKey, startOfWeek, toKey, todayKey } from "./utils/dates";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import WeekMeter from "./components/WeekMeter";
import BookingModal from "./components/BookingModal";
import DeleteButton from "./components/DeleteButton";

const firstOpenDay = () => {
  const d = new Date();
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return toKey(d);
};

export default function App() {
  const { bookings, add, update, remove } = useBookings();
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [modal, setModal] = useState(null); // { booking, date }
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const weekStart = startOfWeek(cursor);
  const weekCount = countInWeek(bookings, toKey(weekStart));

  const title = view === "month" ? fmt.month(cursor) : fmt.weekRange(weekStart);

  const move = (dir) =>
    setCursor((c) =>
      view === "month"
        ? new Date(c.getFullYear(), c.getMonth() + dir, 1)
        : addDays(c, 7 * dir)
    );

  const openNew = (date) => setModal({ booking: null, date });
  const openEdit = (booking) => setModal({ booking, date: booking.date });

  const save = (data) => {
    const editing = Boolean(modal.booking);
    const res = editing ? update(modal.booking.id, data) : add(data);
    if (res.ok) {
      setModal(null);
      setCursor(fromKey(data.date));
      setToast(editing ? "Reserva atualizada" : "Reserva criada");
    }
    return res;
  };

  const del = (id) => {
    remove(id);
    setModal(null);
    setToast("Reserva excluída");
  };

  const today = todayKey();
  const upcoming = bookings
    .filter((b) => b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <div className="shell">
      <aside className="panel">
        <div className="brand">
          <i /> Carro E Cia
        </div>

        <h1>
          O dia certo para o reparo certo. 
          
          <em><br />Escolha o dia.<br /></em>
        </h1>

        <WeekMeter
          count={weekCount}
          label={`Semana de ${fmt.weekRange(weekStart)}`}
        />

        <button
          className="pill primary big"
          onClick={() => openNew(firstOpenDay())}
        >
          Nova reserva
        </button>

        <div className="upcoming">
          <h3>Próximas entradas</h3>
          {upcoming.length === 0 && <p className="none">Nenhuma reserva futura.</p>}
          <ul>
            {upcoming.map((b) => (
              <li key={b.id}>
                <time>{fmt.dayMonth(b.date)}</time>
                <div>
                  <strong>{b.name}</strong>
                  <span>
                    {b.model || b.service} · {b.plate}
                  </span>
                </div>
                <button className="pill dark small" onClick={() => openEdit(b)}>
                  Editar
                </button>
                <DeleteButton className="small onDark" onConfirm={() => del(b.id)} />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="board">
        <div className="toolbar">
          <h2>{title}</h2>

          <div className="controls">
            <button className="round" onClick={() => move(-1)} aria-label="Anterior">
              ‹
            </button>
            <button className="round" onClick={() => move(1)} aria-label="Próximo">
              ›
            </button>
            <button className="pill ghost small" onClick={() => setCursor(new Date())}>
              Hoje
            </button>

            <div className="seg">
              <button
                className={view === "month" ? "on" : ""}
                onClick={() => setView("month")}
              >
                Mês
              </button>
              <button
                className={view === "week" ? "on" : ""}
                onClick={() => setView("week")}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {view === "month" ? (
          <MonthView cursor={cursor} bookings={bookings} onNew={openNew} onEdit={openEdit} />
        ) : (
          <WeekView cursor={cursor} bookings={bookings} onNew={openNew} onEdit={openEdit} />
        )}
      </main>

      {modal && (
        <BookingModal
          booking={modal.booking}
          defaultDate={modal.date}
          bookings={bookings}
          onSave={save}
          onDelete={del}
          onClose={() => setModal(null)}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <i /> {toast}
        </div>
      )}
    </div>
  );
}
