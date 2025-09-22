// // lib/store.ts
// "use client";

// import { create } from "zustand";
// import { medicines as seed, purchases as purchasesSeed, Medicine } from "@/lib/data";
// import type { Purchase } from "@/lib/data";

// type StockDeltaMap = Record<string /* hospitalId */, Record<string /* medicineId */, number>>;

// type InventoryState = {
//   hospitalId: string | null;
//   medicines: Medicine[];
//   purchases: Purchase[];                       // NUEVO

//   setHospitalId: (id: string) => void;
//   setMedicines: (ms: Medicine[]) => void;
//   setPurchases: (ps: Purchase[]) => void;      // NUEVO

//   // (opcional si ya lo usas) deltas de stock
//   stockDeltas?: StockDeltaMap;
//   addStock?: (hospitalId: string, medicineId: string, qty: number) => void;
//   getDelta?: (hospitalId: string | null, medicineId: string) => number;
// };

// export const useInventoryStore = create<InventoryState>((set, get) => ({
//   hospitalId: null,
//   medicines: seed,
//   purchases: purchasesSeed, // ← datos duros

//   setHospitalId: (id) => set({ hospitalId: id }),
//   setMedicines: (ms) => set({ medicines: ms }),
//   setPurchases: (ps) => set({ purchases: ps }),

//   // Si ya habías agregado deltas, puedes dejarlos aquí;
//   // si no los necesitas, elimina estas 3 propiedades.
//   stockDeltas: {},
//   addStock: (hospitalId, medicineId, qty) =>
//     set((state) => {
//       const hospitalMap = state.stockDeltas![hospitalId] ?? {};
//       const current = hospitalMap[medicineId] ?? 0;
//       return {
//         stockDeltas: {
//           ...state.stockDeltas,
//           [hospitalId]: { ...hospitalMap, [medicineId]: current + Math.max(0, qty) },
//         },
//       };
//     }),
//   getDelta: (hospitalId, medicineId) => {
//     if (!hospitalId) return 0;
//     return get().stockDeltas?.[hospitalId]?.[medicineId] ?? 0;
//   },
// }));

// lib/store.ts
"use client";

import { create } from "zustand";
import { fetchHospitals, fetchInventory, fetchHistory } from "@/lib/api";
import type {
  HospitalApi,
  InventoryItemApi,
  HistoryRowApi,
} from "@/lib/api-types";

// Estado derivado para el badge de stock
export type StockStatusKey = "none" | "low" | "ok";
export const LOW_STOCK = 10;
function getStockStatus(qty: number, low = LOW_STOCK): StockStatusKey {
  if (qty <= 0) return "none";
  if (qty < low) return "low";
  return "ok";
}

// Lo que consume tu DataTable de inventario
export type InventoryRow = {
  id: number; // id_medicine
  name: string; // medicine_name
  presentation: string;
  qty: number; // quantity
  status: StockStatusKey;
  // unitPrice?: number; // si luego incorporas precios por proveedor, lo agregas aquí
};

type InventoryState = {
  // Estado global
  hospitals: HospitalApi[];
  hospitalId: number | null;
  inventory: InventoryRow[];
  history: HistoryRowApi[];

  // Flags
  loading: boolean;
  error?: string;

  // Acciones
  loadHospitals: () => Promise<void>;
  setHospitalId: (id: number) => void;
  loadInventory: () => Promise<void>;
  loadHistory: () => Promise<void>;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  hospitals: [],
  hospitalId: null,
  inventory: [],
  history: [],

  loading: false,
  error: undefined,

  // 1) Cargar hospitales; si no hay seleccionado, elegir el primero
  loadHospitals: async () => {
    try {
      set({ loading: true, error: undefined });
      const hs = await fetchHospitals();
      set({ hospitals: hs, loading: false });
      if (hs.length && get().hospitalId == null) {
        set({ hospitalId: hs[0].id_hospital });
      }
    } catch (e: any) {
      set({ error: e.message ?? "Error cargando hospitales", loading: false });
    }
  },

  // 2) Cambiar hospital activo
  setHospitalId: (id) => set({ hospitalId: id }),

  // 3) Cargar inventario del hospital activo y adaptarlo a InventoryRow
  loadInventory: async () => {
    const id = get().hospitalId;
    if (!id) return;
    try {
      set({ loading: true, error: undefined });
      const items: InventoryItemApi[] = await fetchInventory(id);

      const rows: InventoryRow[] = items.map((it) => ({
        id: it.id_medicine,
        name: it.medicine_name,
        presentation: it.presentation ?? "",
        qty: it.quantity,
        status: getStockStatus(it.quantity),
      }));

      set({ inventory: rows, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Error cargando inventario", loading: false });
    }
  },

  // 4) Cargar historial del hospital activo (ya viene “render-friendly”)

  loadHistory: async () => {
    const id = get().hospitalId;
    if (!id) return;
    try {
      set({ loading: true, error: undefined });
      const resp = await fetchHistory(id);
      // resp puede ser un array o un objeto con { inventario: [] }
      const rows = Array.isArray(resp) ? resp : (resp as any)?.inventario ?? [];
      set({ history: rows, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Error cargando historial", loading: false });
    }
  },
}));
