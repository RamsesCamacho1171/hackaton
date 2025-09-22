// app/historial/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useInventoryStore } from "@/lib/store";
import { Calendar, Search } from "lucide-react";

function currency(n: number, c: string) {
  return n.toLocaleString("es-MX", { style: "currency", currency: c || "MXN" });
}

export default function HistorialPage() {
  const { hospitalId, history, loadHistory, loading } = useInventoryStore();

  // Cargar historial cuando haya hospital seleccionado
  useEffect(() => {
    if (hospitalId) loadHistory();
  }, [hospitalId, loadHistory]);

  // Filtros
  const [qProvider, setQProvider] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const rows = useMemo(() => {
    const base = Array.isArray(history)
      ? history
      : (history as any)?.inventario ?? [];
    let list = base;

    if (qProvider.trim()) {
      const q = qProvider.trim().toLowerCase();
      list = list.filter((p) => p.provider_name.toLowerCase().includes(q));
    }

    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00");
      list = list.filter((p) => new Date(p.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      list = list.filter((p) => new Date(p.date) <= to);
    }

    // más explícito que el +new Date(...)
    return list
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history, qProvider, dateFrom, dateTo]);

  const totalGasto = rows.reduce(
    (acc, r) => acc + r.unit_price * r.quantity,
    0
  );
  const currencyCode = rows[0]?.currency ?? "MXN";

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Historial de compras
        </h1>
        <p className="text-sm text-zinc-600">
          Registros del hospital seleccionado en el header.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
            />
            <input
              value={qProvider}
              onChange={(e) => setQProvider(e.target.value)}
              placeholder="Filtrar por proveedor…"
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white pl-8 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-zinc-500" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <span className="text-sm text-zinc-500">a</span>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-zinc-500" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-700">
          Total mostrado:{" "}
          <span className="font-semibold">
            {currency(totalGasto, currencyCode)}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-700">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Transacción</th>
              <th className="px-4 py-3 text-left">Medicamento</th>
              <th className="px-4 py-3 text-left">Proveedor</th>
              <th className="px-4 py-3 text-right">Cantidad</th>
              <th className="px-4 py-3 text-right">P. Unitario</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-zinc-500"
                >
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-zinc-500"
                >
                  No hay compras registradas con los filtros actuales.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id_transaction}
                  className="border-t border-zinc-100 hover:bg-zinc-50/60"
                >
                  <td className="px-4 py-3">
                    {new Date(r.date).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {r.id_transaction}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">
                      {r.medicine_name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {r.presentation || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">{r.provider_name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {r.quantity}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {currency(r.unit_price, r.currency)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    {currency(r.unit_price * r.quantity, r.currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
