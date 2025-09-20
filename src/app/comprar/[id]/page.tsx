// app/comprar/[id]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { medicines, getQty, getProvidersByHospital } from "@/lib/data";
import { useInventoryStore } from "@/lib/store";

export default function ComprarPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const { hospitalId, addStock, getDelta } = useInventoryStore();

    const med = useMemo(
        () => medicines.find((m) => m.id === params.id),
        [params.id]
    );

    const providers = getProvidersByHospital(hospitalId);

    // Estado del formulario
    const [providerId, setProviderId] = useState(providers[0]?.id ?? "");
    const [quantity, setQuantity] = useState<number>(1);
    const [processing, setProcessing] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [folio, setFolio] = useState<string | null>(null);

    if (!med) {
        return (
            <section className="space-y-4">
                <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                    <ArrowLeft size={16} /> Volver
                </button>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                    Medicamento no encontrado.
                </div>
            </section>
        );
    }

    const baseQty = getQty(med, hospitalId);
    const delta = getDelta(hospitalId, med.id);
    const effectiveQty = baseQty + delta;
    const total = (med.unitPrice * quantity) || 0;

    const canSubmit =
        hospitalId && providerId && quantity > 0 && !processing;

    const onPay = async () => {
        if (!hospitalId || !canSubmit) return;
        setProcessing(true);

        // Simulación de pago (API/banco)
        await new Promise((r) => setTimeout(r, 800));

        // “éxito”: generamos folio simple y actualizamos deltas
        const fakeFolio = `PO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        setFolio(fakeFolio);
        addStock(hospitalId, med.id, quantity);

        setProcessing(false);
        setSuccessOpen(true);
    };

    const onCloseSuccess = () => {
        setSuccessOpen(false);
        router.push("/"); // volver al inventario
    };

    return (
        <section className="space-y-6">
            {/* Volver */}
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
            >
                <ArrowLeft size={16} /> Volver
            </button>

            {/* Header */}
            <header className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Comprar: {med.name}
                </h1>
                <p className="text-sm text-zinc-600">
                    {med.presentation ?? "Presentación estándar"} · Precio unitario:{" "}
                    <span className="font-medium">${med.unitPrice.toFixed(2)}</span>
                </p>
                <p className="text-sm text-zinc-600">
                    Stock actual en este hospital:{" "}
                    <span className="font-medium">{effectiveQty}</span>
                </p>
            </header>

            {/* Formulario */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
                {/* Proveedor */}
                <div className="grid gap-1">
                    <label htmlFor="provider" className="text-sm font-medium text-zinc-800">
                        Proveedor
                    </label>
                    <select
                        id="provider"
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {providers.length === 0 ? (
                            <option value="">No hay proveedores para este hospital</option>
                        ) : (
                            providers.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))
                        )}
                    </select>
                    <p className="text-xs text-zinc-500">
                        El listado depende del hospital seleccionado en el header.
                    </p>
                </div>

                {/* Cantidad */}
                <div className="grid gap-1">
                    <label htmlFor="qty" className="text-sm font-medium text-zinc-800">
                        Cantidad a comprar
                    </label>
                    <input
                        id="qty"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="h-10 w-40 rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                {/* Resumen */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">
                    Total:{" "}
                    <span className="font-semibold">
                        ${total.toFixed(2)}
                    </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                    <button
                        disabled={!canSubmit}
                        onClick={onPay}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? "Procesando..." : "Pagar y comprar"}
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium hover:bg-zinc-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>

            {/* Modal de éxito */}
            {successOpen && (
                <div
                    className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg">
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 />
                        </div>
                        <h2 className="text-lg font-semibold">Compra realizada</h2>
                        <p className="mt-1 text-sm text-zinc-600">
                            Se agregaron <strong>{quantity}</strong> unidades de{" "}
                            <strong>{med.name}</strong>.
                        </p>
                        {folio && (
                            <p className="mt-1 text-xs text-zinc-500">
                                Folio: <span className="font-mono">{folio}</span>
                            </p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={onCloseSuccess}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Volver al inventario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
