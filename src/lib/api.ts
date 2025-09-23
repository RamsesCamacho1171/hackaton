// lib/api.ts (ajustes pequeños)
import type {
  HospitalApi,
  InventoryItemApi,
  ProviderMedicineApi,
  HistoryRowApi,
} from "./api-types";

const BASE = "http://localhost:3000";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function fetchHospitals(): Promise<HospitalApi[]> {
  return j(await fetch(`${BASE}/api/hospital`, { cache: "no-store" }));
}

export async function fetchInventory(
  hospitalId: number,
  medicineId?: number
): Promise<InventoryItemApi[]> {
  const params = new URLSearchParams({ hospital_id: String(hospitalId) });
  if (medicineId) params.set("medicine_id", String(medicineId));

  const res = await fetch(`${BASE}/api/hospital-inventory?${params}`, {
    cache: "no-store",
  });
  console.log(res);
  
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json() as InventoryItemApi[];
  console.log(json);
  
  return json;
}

export async function fetchProviderMedicines(
  providerId: number
): Promise<ProviderMedicineApi[]> {
  return j(await fetch(`${BASE}/api/provider-medicines/${providerId}`, { cache: "no-store" }));
}

export async function fetchHistory(hospitalId: number): Promise<HistoryRowApi[]> {
  return j(await fetch(`${BASE}/api/history?hospital_id=${hospitalId}`, { cache: "no-store" }));
}
