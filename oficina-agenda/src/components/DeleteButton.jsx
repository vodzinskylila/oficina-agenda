import { useEffect, useState } from "react";

// Exclusão em dois cliques: o primeiro "arma" o botão, o segundo confirma
export default function DeleteButton({ onConfirm, label = "Excluir", className = "" }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      className={`pill ${armed ? "danger" : "ghost"} ${className}`}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
    >
      {armed ? "Confirmar?" : label}
    </button>
  );
}
