// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useInventoryStore, LOW_STOCK, type StockStatusKey } from "@/lib/store";
import { DataTable, type MedicineRow } from "@/components/data-table";

type StatusFilter = "all" | StockStatusKey;

export default function InventoryPage() {
  const { hospitalId, inventory, loadInventory } = useInventoryStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Cargar inventario cuando haya hospital seleccionado
  useEffect(() => {
    if (hospitalId) loadInventory();
  }, [hospitalId, loadInventory]);

  // Adaptar el inventario del store al shape de la tabla
  const rows: MedicineRow[] = useMemo(() => {
    const base: MedicineRow[] =
      inventory.map((it) => ({
        id: String(it.id),
        name: it.name,
        presentation: it.presentation,
        unitPrice: 0,           // si luego traes precio, cámbialo aquí
        qty: it.qty,
        status: it.status,      // ya viene calculado en el store
      })) ?? [];

    // Filtro por texto
    const byText = q
      ? base.filter((r) =>
          `${r.name} ${r.presentation ?? ""}`.toLowerCase().includes(q.toLowerCase())
        )
      : base;

    // Filtro por estado
    return status === "all" ? byText : byText.filter((r) => r.status === status);
  }, [inventory, q, status]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-sm text-zinc-600">
            Consulta el stock por hospital y repón desde aquí.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar medicamento…"
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white pl-8 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">Todos</option>
            <option value="none">Sin stock</option>
            <option value="low">Bajo stock (&lt; {LOW_STOCK})</option>
            <option value="ok">Suficiente</option>
          </select>
        </div>
      </header>

      <DataTable data={rows} />
    </section>
  );
}
