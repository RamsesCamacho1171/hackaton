// lib/store.ts
"use client";

import { create } from "zustand";
import { medicines as seed, purchases as purchasesSeed, Medicine } from "@/lib/data";
import type { Purchase } from "@/lib/data";

type StockDeltaMap = Record<string /* hospitalId */, Record<string /* medicineId */, number>>;

type InventoryState = {
  hospitalId: string | null;
  medicines: Medicine[];
  purchases: Purchase[];                       // NUEVO

  setHospitalId: (id: string) => void;
  setMedicines: (ms: Medicine[]) => void;
  setPurchases: (ps: Purchase[]) => void;      // NUEVO

  // (opcional si ya lo usas) deltas de stock
  stockDeltas?: StockDeltaMap;
  addStock?: (hospitalId: string, medicineId: string, qty: number) => void;
  getDelta?: (hospitalId: string | null, medicineId: string) => number;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  hospitalId: null,
  medicines: seed,
  purchases: purchasesSeed, // ← datos duros

  setHospitalId: (id) => set({ hospitalId: id }),
  setMedicines: (ms) => set({ medicines: ms }),
  setPurchases: (ps) => set({ purchases: ps }),

  // Si ya habías agregado deltas, puedes dejarlos aquí;
  // si no los necesitas, elimina estas 3 propiedades.
  stockDeltas: {},
  addStock: (hospitalId, medicineId, qty) =>
    set((state) => {
      const hospitalMap = state.stockDeltas![hospitalId] ?? {};
      const current = hospitalMap[medicineId] ?? 0;
      return {
        stockDeltas: {
          ...state.stockDeltas,
          [hospitalId]: { ...hospitalMap, [medicineId]: current + Math.max(0, qty) },
        },
      };
    }),
  getDelta: (hospitalId, medicineId) => {
    if (!hospitalId) return 0;
    return get().stockDeltas?.[hospitalId]?.[medicineId] ?? 0;
  },
}));
