import { MAX_PER_WEEK } from "../utils/dates";

export default function WeekMeter({ count, label }) {
  const left = Math.max(MAX_PER_WEEK - count, 0);

  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong>
          {count}
          <small>/{MAX_PER_WEEK}</small>
        </strong>
      </div>
      <div className="dots" aria-hidden="true">
        {Array.from({ length: MAX_PER_WEEK }, (_, i) => (
          <i key={i} className={i < count ? "on" : ""} />
        ))}
      </div>
      <p>
        {left === 0
          ? "Semana lotada"
          : `${left} ${left === 1 ? "vaga restante" : "vagas restantes"}`}
      </p>
    </div>
  );
}
