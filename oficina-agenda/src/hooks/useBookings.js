import { useEffect, useState } from "react";
import {
  MAX_PER_WEEK,
  addDays,
  isSunday,
  toKey,
  weekKeyOf,
} from "../utils/dates";

const STORAGE_KEY = "torque-reservas-v1";

const makeId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Dados de exemplo só na primeira visita, para o visual não começar vazio
const seed = () => {
  const mk = (offset, name, model, plate, service) => {
    let d = addDays(new Date(), offset);
    if (d.getDay() === 0) d = addDays(d, 1);
    return {
      id: makeId(),
      name,
      phone: "",
      model,
      plate,
      service,
      date: toKey(d),
      notes: "",
    };
  };
  return [
    mk(1, "Marina Alves", "Onix 2019", "QWE1A23", "Revisão"),
    mk(1, "Carlos Dias", "HB20 2021", "RTY4B56", "Troca de óleo"),
    mk(2, "Paulo Reis", "Corolla 2018", "UIO7C89", "Freios"),
    mk(4, "Júlia Ramos", "Polo 2022", "ASD2D34", "Alinhamento e balanceamento"),
    mk(8, "Rafael Costa", "Compass 2020", "FGH5E67", "Diagnóstico"),
  ];
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return seed();
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const countInWeek = (list, wk, ignoreId) =>
  list.filter((b) => b.id !== ignoreId && weekKeyOf(b.date) === wk).length;

export function useBookings() {
  const [bookings, setBookings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [bookings]);

  const validate = (data, ignoreId) => {
    if (!data.name.trim()) return "Informe o nome do cliente.";
    if (!data.plate.trim()) return "Informe a placa do carro.";
    if (!data.date) return "Escolha uma data.";
    if (isSunday(data.date)) return "A oficina fecha aos domingos.";
    if (countInWeek(bookings, weekKeyOf(data.date), ignoreId) >= MAX_PER_WEEK)
      return `Semana lotada: o limite é de ${MAX_PER_WEEK} carros.`;
    return null;
  };

  const add = (data) => {
    const error = validate(data);
    if (error) return { ok: false, error };
    setBookings((prev) => [...prev, { ...data, id: makeId() }]);
    return { ok: true };
  };

  const update = (id, data) => {
    const error = validate(data, id);
    if (error) return { ok: false, error };
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    return { ok: true };
  };

  const remove = (id) =>
    setBookings((prev) => prev.filter((b) => b.id !== id));

  return { bookings, add, update, remove };
}
