// components/status-badge.tsx
"use client";

import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";
import type { StockStatusKey } from "@/lib/data";

export function StatusBadge({ status }: { status: StockStatusKey }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border";

  if (status === "ok") {
    return (
      <span
        className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}
      >
        <CheckCircle2 size={14} />
        Suficiente
      </span>
    );
  }

  if (status === "low") {
    return (
      <span
        className={`${base} bg-amber-50 text-amber-700 border-amber-200`}
      >
        <TriangleAlert size={14} />
        Necesitas comprar más
      </span>
    );
  }

  return (
    <span
      className={`${base} bg-rose-50 text-rose-700 border-rose-200`}
    >
      <XCircle size={14} />
      Sin existencias
    </span>
  );
}
