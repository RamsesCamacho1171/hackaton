// app/historial/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useInventoryStore } from "@/lib/store";
import { medicines } from "@/lib/data";
import { Calendar, Search } from "lucide-react";

function currency(n: number) {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function HistorialPage() {
    const { hospitalId, purchases } = useInventoryStore();

    // Filtros simples
    const [qProvider, setQProvider] = useState("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

    const rows = useMemo(() => {
        // filtra por hospital actual
        let list = purchases.filter((p) => p.hospitalId === hospitalId);

        // filtra por proveedor (texto)
        if (qProvider.trim()) {
            const q = qProvider.trim().toLowerCase();
            list = list.filter((p) => p.providerId.toLowerCase().includes(q));
        }

        // filtra por rango de fechas (yyyy-mm-dd)
        if (dateFrom) {
            const from = new Date(dateFrom + "T00:00:00");
            list = list.filter((p) => new Date(p.createdAt) >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo + "T23:59:59");
            list = list.filter((p) => new Date(p.createdAt) <= to);
        }

        // orden por fecha desc
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return list.map((p) => {
            const med = medicines.find((m) => m.id === p.medicineId);
            return {
                ...p,
                medName: med?.name ?? p.medicineId,
                presentation: med?.presentation ?? "—",
            };
        });
    }, [hospitalId, purchases, qProvider, dateFrom, dateTo]);

    const totalGasto = rows.reduce((acc, r) => acc + r.total, 0);

    return (
        <section className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Historial de compras</h1>
                <p className="text-sm text-zinc-600">
                    Registros del hospital seleccionado en el header.
                </p>
            </header>

            {/* Filtros */}
            <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={16} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" />
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
                    Total mostrado: <span className="font-semibold">{currency(totalGasto)}</span>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-50 text-zinc-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-left">Folio</th>
                            <th className="px-4 py-3 text-left">Medicamento</th>
                            <th className="px-4 py-3 text-left">Proveedor</th>
                            <th className="px-4 py-3 text-right">Cantidad</th>
                            <th className="px-4 py-3 text-right">P. Unitario</th>
                            <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                                    No hay compras registradas con los filtros actuales.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                                    <td className="px-4 py-3">
                                        {new Date(r.createdAt).toLocaleString("es-MX", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{r.folio}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-zinc-900">{r.medName}</div>
                                        <div className="text-xs text-zinc-500">{r.presentation}</div>
                                    </td>
                                    <td className="px-4 py-3">{r.providerId}</td>
                                    <td className="px-4 py-3 text-right tabular-nums">{r.quantity}</td>
                                    <td className="px-4 py-3 text-right tabular-nums">{currency(r.unitPrice)}</td>
                                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                                        {currency(r.total)}
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
