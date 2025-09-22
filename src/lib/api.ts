// lib/api.ts
import type {
  HospitalApi,
  InventoryItemApi,
  ProviderMedicineApi,
  HistoryRowApi,
} from "./api-types";

const BASE = "http://localhost:3000"; // "" para relativo; o process.env.NEXT_PUBLIC_BASE_URL

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function fetchHospitals(): Promise<HospitalApi[]> {
  return j(await fetch(`${BASE}/api/hospital`, { cache: "no-store" }));
}

export async function fetchInventory(hospitalId: number): Promise<InventoryItemApi[]> {
  return j(await fetch(`${BASE}/api/hospital-inventory/${hospitalId}`, { cache: "no-store" }));
}

// Si en UI eliges un proveedor concreto:
export async function fetchProviderMedicines(providerId: number): Promise<ProviderMedicineApi[]> {
  return j(await fetch(`${BASE}/api/provider-medicines/${providerId}`, { cache: "no-store" }));
}

export async function fetchHistory(hospitalId: number): Promise<HistoryRowApi[]> {
  return j(await fetch(`${BASE}/api/history?hospital_id=${hospitalId}`, { cache: "no-store" }));
}
