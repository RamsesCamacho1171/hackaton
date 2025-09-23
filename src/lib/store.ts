// lib/store.ts
"use client";

import { create } from "zustand";
import {
  fetchHospitals,
  fetchInventory,
  fetchHistory,
} from "@/lib/api";
import type {
  HospitalApi,
  InventoryItemApi,
  HistoryRowApi,
} from "@/lib/api-types";

// Status para el badge de stock
export type StockStatusKey = "none" | "low" | "ok";
export const LOW_STOCK = 10;
function getStockStatus(qty: number, low = LOW_STOCK): StockStatusKey {
  if (qty <= 0) return "none";
  if (qty < low) return "low";
  return "ok";
}

// Shape que consume tu DataTable
export type InventoryRow = {
  id: number;             // id_medicine
  name: string;           // medicine_name
  presentation: string;
  qty: number;            // quantity
  status: StockStatusKey; // derivado
};

type InventoryState = {
  // Estado global
  hospitals: HospitalApi[];
  hospitalId: number | null;

  inventory: InventoryRow[];   // para la tabla de inventario
  history: HistoryRowApi[];    // historial tal cual viene del API

  loading: boolean;
  error?: string;

  // Acciones
  loadHospitals: () => Promise<void>;
  setHospitalId: (id: number) => void;
  loadInventory: (opts?: { medicineId?: number }) => Promise<void>;
  loadHistory: () => Promise<void>;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  hospitals: [],
  hospitalId: null,

  inventory: [],
  history: [],

  loading: false,
  error: undefined,

  // 1) Cargar hospitales y seleccionar el primero si no hay
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

  // 3) Cargar inventario del hospital activo (opcionalmente de un solo medicamento)
  loadInventory: async (opts) => {
    const id = get().hospitalId;
    if (!id) return;
    try {
      set({ loading: true, error: undefined });
      const items: InventoryItemApi[] = await fetchInventory(id, opts?.medicineId);

      console.log(items);
      

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

  // 4) Cargar historial del hospital activo
  loadHistory: async () => {
    const id = get().hospitalId;
    if (!id) return;
    try {
      set({ loading: true, error: undefined });
      const rows: HistoryRowApi[] = await fetchHistory(id);
      set({ history: rows, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Error cargando historial", loading: false });
    }
  },
}));
