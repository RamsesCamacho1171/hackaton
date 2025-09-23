// app/comprar/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useInventoryStore } from "@/lib/store";
import { fetchProviderMedicines } from "@/lib/api";
import type { ProviderMedicineApi } from "@/lib/api-types";

function currency(n: number, code: string) {
  return n.toLocaleString("es-MX", { style: "currency", currency: code || "MXN" });
}

// Convierte monto mayor (2 decimales) -> minor units (entero)
// Ej: 10.00 -> "1000"; 6 -> "600"; 0.06 -> "6"
function toMinorUnits(amount: number) {
  return String(Math.round((Number.isFinite(amount) ? amount : 0) * 100));
}

export default function ComprarPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const medicineId = Number(params.id);

  const {
    hospitals,           // HospitalApi[]
    hospitalId,          // number | null
    inventory,           // InventoryRow[]
    loadInventory,       // ({ medicineId }) => Promise<void>
  } = useInventoryStore();

  // proveedores / precios por medicina
  const [providers, setProviders] = useState<ProviderMedicineApi[]>([]);
  const [providerIdx, setProviderIdx] = useState<number>(0);

  // formulario
  const [quantity, setQuantity] = useState<number>(1);

  // estados de proceso / modales
  const [processing, setProcessing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState<null | string>(null);

  // datos para el paso de "continue"
  const [stateId, setStateId] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  // estado visual del continue
  // "idle" -> sin intentar; "pending" -> 410; "declined" -> 401
  const [continueState, setContinueState] = useState<"idle" | "pending" | "declined">("idle");
  const [continueMessage, setContinueMessage] = useState<string>("");

  // 1) cargar inventario de ESA medicina
  useEffect(() => {
    if (hospitalId && medicineId) {
      loadInventory({ medicineId });
    }
  }, [hospitalId, medicineId, loadInventory]);

  // 2) cargar proveedores con precio para esa medicina
  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const list = await fetchProviderMedicines(medicineId);
        if (!active) return;
        setProviders(list);
        setProviderIdx(0);
      } catch {
        setProviders([]);
      }
    }
    if (medicineId) run();
    return () => { active = false; };
  }, [medicineId]);

  // Hospital actual
  const currentHospital = useMemo(
    () => hospitals.find(h => h.id_hospital === hospitalId) || null,
    [hospitals, hospitalId]
  );

  // Fila de inventario (debe venir 1)
  const medRow = inventory.find((r) => r.id === medicineId);
  const medName = medRow?.name ?? `Medicina #${medicineId}`;
  const presentation = medRow?.presentation ?? "—";
  const stockQty = medRow?.qty ?? 0;

  // Proveedor seleccionado
  const currentProvider = providers[providerIdx];
  const unitPrice = currentProvider?.price ?? 0;
  const currencyCode = currentProvider?.asset_code ?? "MXN";
  const total = unitPrice * quantity;

  const canSubmit = Boolean(
    hospitalId &&
    currentHospital &&
    currentProvider &&
    quantity > 0 &&
    !processing
  );

  // ---------- API calls ----------
  async function postInterledgerStart() {
    const body = {
      privateKey: currentHospital!.private_key,
      myWallet: currentHospital!.wallet_url,
      receiverWallet: currentProvider!.wallet_url,
      key: currentHospital!.api_key,
      value: toMinorUnits(total),            // minor units
      name_medicam: medName,
      presentation,
      email: currentHospital!.email,
      hospital_id: currentHospital?.id_hospital,
      distributor_id: currentProvider.id_provider,
      medication_id:medicineId,
      quantity:quantity,
    };

    const res = await fetch("/api/interledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Interledger start ${res.status}`);
    const json = await res.json() as { stateId: string; message: string };
    return json;
  }

  async function postInterledgerResend(email: string) {
    const res = await fetch("/api/interledger/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return res.json();
  }

  async function postInterledgerContinue(id: string) {
    const res = await fetch("/api/interledger/continue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stateId: id }),
    });

    // devolvemos status + body para decidir en UI
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : null;

    return { status: res.status, body };
  }
  // --------------------------------

  // “Pagar”
  const onPay = async () => {
    if (!canSubmit) return;
    setProcessing(true);
    setContinueState("idle");
    setContinueMessage("");
    try {
      const start = await postInterledgerStart();
      setStateId(start.stateId);
      setSuccessOpen(true);        // mostramos modal de éxito + instrucciones email
    } catch (e: any) {
      setErrorOpen("No se pudo iniciar el pago con Interledger. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  const onResend = async () => {
    if (!currentHospital) return;
    setResendLoading(true);
    try {
      await postInterledgerResend(currentHospital.email);
      // opcional: podrías mostrar un mensajito de "Correo reenviado"
    } catch {
      // opcional: un mensaje de error suave
    } finally {
      setResendLoading(false);
    }
  };

  const onContinue = async () => {
    if (!stateId) return;
    setContinueLoading(true);
    setContinueMessage("");
    try {
      const { status, body } = await postInterledgerContinue(stateId);

      if (status === 200) {
        // Pago cerrado con éxito → redirigir al historial (o recargar inventario)
        setSuccessOpen(false);
        router.push("/historial");
        return;
      }

      if (status === 410) {
        // Aún no acepta ni declina
        setContinueState("pending");
        setContinueMessage(
          body?.message ??
          "Aún no se ha confirmado ni rechazado el cobro. Revisa el correo y vuelve a intentar."
        );
        return;
      }

      if (status === 401) {
        // Rechazado/expirado
        setContinueState("declined");
        setContinueMessage(
          body?.message ?? "El cobro fue rechazado o expiró. Inicia el proceso nuevamente."
        );
        return;
      }

      // Otros errores inesperados
      setErrorOpen("No se pudo completar el pago. Intenta de nuevo.");
    } catch {
      setErrorOpen("No se pudo completar el pago. Intenta de nuevo.");
    } finally {
      setContinueLoading(false);
    }
  };

  const onCloseSuccess = () => {
    setSuccessOpen(false);
  };

  // estados de validación
  if (!hospitalId) {
    return (
      <section className="space-y-4">
        <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline">
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Selecciona un hospital en el header para continuar.
        </div>
      </section>
    );
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Comprar: {medName}</h1>
        <p className="text-sm text-zinc-600">
          {presentation} · Precio unitario:{" "}
          <span className="font-medium">
            {currentProvider ? currency(unitPrice, currencyCode) : "—"}
          </span>
        </p>
        <p className="text-sm text-zinc-600">
          Stock actual en este hospital: <span className="font-medium">{stockQty}</span>
        </p>
      </header>

      {/* Formulario */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        {/* Proveedor */}
        <div className="grid gap-1">
          <label htmlFor="provider" className="text-sm font-medium text-zinc-800">
            Proveedor (con precio)
          </label>
          <select
            id="provider"
            value={String(providerIdx)}
            onChange={(e) => setProviderIdx(Number(e.target.value))}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {providers.length === 0 ? (
              <option value="0">No hay proveedores para esta medicina</option>
            ) : (
              providers.map((p, idx) => (
                <option key={`${p.id_provider}-${idx}`} value={idx}>
                  {p.provider_name} — {currency(p.price, p.asset_code)}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-zinc-500">
            Depende del <strong>id de la medicina</strong> (ruta) y muestra precios por proveedor.
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
            {currentProvider ? currency(total, currencyCode) : "—"}
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

      {/* Modal de éxito + flujo de email/continue */}
      {successOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 />
            </div>
            <h2 className="text-lg font-semibold">Solicitud enviada</h2>
            <p className="text-sm text-zinc-600">
              Enviamos un correo de confirmación al registrado en el hospital (<strong>{currentHospital?.email}</strong>).
              Confírmalo para continuar con el pago.
            </p>

            {continueState === "pending" && (
              <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800">
                <AlertTriangle size={18} className="mt-[2px]" />
                <p className="text-sm">
                  {continueMessage || "Aún no se ha confirmado ni rechazado el cobro. Revisa el correo y vuelve a intentar."}
                </p>
              </div>
            )}

            {continueState === "declined" && (
              <div className="mt-2 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-700">
                <XCircle size={18} className="mt-[2px]" />
                <p className="text-sm">
                  {continueMessage || "El cobro fue rechazado o expiró. Inicia el proceso nuevamente."}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={onResend}
                disabled={resendLoading}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
              >
                {resendLoading ? "Reenviando…" : "Reenviar correo"}
              </button>

              <div className="flex items-center gap-2">
                {continueState === "declined" ? (
                  <button
                    onClick={() => {
                      setSuccessOpen(false);
                      setStateId(null);
                      setContinueState("idle");
                      setContinueMessage("");
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-800 px-4 text-sm font-medium text-white hover:bg-zinc-900"
                  >
                    Cerrar
                  </button>
                ) : (
                  <button
                    onClick={onContinue}
                    disabled={!stateId || continueLoading}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {continueLoading ? "Continuando…" : "Continuar"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {errorOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-lg">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <XCircle />
            </div>
            <h2 className="text-lg font-semibold">Algo falló</h2>
            <p className="mt-1 text-sm text-zinc-600">{errorOpen}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setErrorOpen(null)}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-800 px-4 text-sm font-medium text-white hover:bg-zinc-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
