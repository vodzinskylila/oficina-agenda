import { useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";
import { MAX_PER_WEEK, fmt, fromKey, todayKey, weekKeyOf } from "../utils/dates";
import { countInWeek } from "../hooks/useBookings";

export const SERVICES = [
  "Revisão",
  "Troca de óleo",
  "Freios",
  "Suspensão",
  "Alinhamento e balanceamento",
  "Diagnóstico",
  "Outro",
];

export default function BookingModal({
  booking,
  defaultDate,
  bookings,
  onSave,
  onDelete,
  onClose,
}) {
  const editing = Boolean(booking);

  const [form, setForm] = useState(
    () =>
      booking ?? {
        name: "",
        phone: "",
        model: "",
        plate: "",
        service: SERVICES[0],
        date: defaultDate,
        notes: "",
      }
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (field) => (e) => {
    const value =
      field === "plate" ? e.target.value.toUpperCase() : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  };

  const wk = form.date ? weekKeyOf(form.date) : null;
  const used = wk ? countInWeek(bookings, wk, booking?.id) : 0;
  const full = used >= MAX_PER_WEEK;

  const submit = (e) => {
    e.preventDefault();
    const res = onSave(form);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form
        className="dialog"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <header>
          <h2>{editing ? "Editar reserva" : "Nova reserva"}</h2>
          <button type="button" className="round" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="fields">
          <label className="wide">
            Nome do cliente
            <input value={form.name} onChange={set("name")} placeholder="Ex.: Marina Alves" autoFocus />
          </label>

          <label>
            Telefone
            <input value={form.phone} onChange={set("phone")} placeholder="(47) 90000-0000" />
          </label>

          <label>
            Placa
            <input value={form.plate} onChange={set("plate")} placeholder="ABC1D23" maxLength={8} />
          </label>

          <label>
            Veículo
            <input value={form.model} onChange={set("model")} placeholder="Modelo e ano" />
          </label>

          <label>
            Serviço
            <select value={form.service} onChange={set("service")}>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="wide">
            Data de entrada
            <input
              type="date"
              value={form.date}
              min={editing ? undefined : todayKey()}
              onChange={set("date")}
            />
          </label>

          <label className="wide">
            Observações
            <textarea rows={2} value={form.notes} onChange={set("notes")} placeholder="Algo que a oficina deva saber?" />
          </label>
        </div>

        {wk && (
          <p className={`capacity ${full ? "full" : ""}`}>
            Semana de {fmt.weekRange(fromKey(wk))}: {used}/{MAX_PER_WEEK} carros
            {full ? " — lotada" : ""}
          </p>
        )}
        {error && <p className="error">{error}</p>}

        <footer>
          {editing && <DeleteButton onConfirm={() => onDelete(booking.id)} />}
          <span className="spacer" />
          <button type="button" className="pill ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="pill primary" disabled={full}>
            {editing ? "Salvar" : "Reservar"}
          </button>
        </footer>
      </form>
    </div>
  );
}
