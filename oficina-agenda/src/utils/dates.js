// Limite de carros aceitos por semana (segunda a domingo)
export const MAX_PER_WEEK = 10;

const pad = (n) => String(n).padStart(2, "0");

// Datas trafegam como string "YYYY-MM-DD" (evita problemas de fuso horário)
export const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Semana começa na segunda-feira
export const startOfWeek = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

export const weekKeyOf = (key) => toKey(startOfWeek(fromKey(key)));
export const todayKey = () => toKey(new Date());
export const isSunday = (key) => fromKey(key).getDay() === 0;

export const monthGrid = (cursor) => {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const lastRowOutside = days
    .slice(35)
    .every((d) => d.getMonth() !== cursor.getMonth());
  return lastRowOutside ? days.slice(0, 35) : days;
};

export const weekDays = (cursor) => {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

const dayMonth = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});
const clean = (s) => s.replace(" de ", " ").replace(".", "");

export const fmt = {
  month: (d) => {
    const s = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1).replace(" de ", " ");
  },
  weekRange: (start) =>
    `${clean(dayMonth.format(start))} – ${clean(dayMonth.format(addDays(start, 6)))}`,
  dayMonth: (key) => clean(dayMonth.format(fromKey(key))),
  weekdayShort: (d) =>
    new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
      .format(d)
      .replace(".", ""),
};
