// lib/api-types.ts
export type HospitalApi = {
  id_hospital: number;
  hospital_name: string;
  private_key: string;
  api_key: string;
  wallet_url: string;
  email: string;
};

export type InventoryItemApi = {
  id_hospital: number;
  id_medicine: number;
  medicine_name: string;
  presentation: string;
  quantity: number;
};

export type ProviderMedicineApi = {
  id_provider: number;
  id_medicine: number;
  provider_name: string;
  price: number;
  asset_code: string;   // "USD", ...
  wallet_url: string;
};

export type HistoryRowApi = {
  id_hospital: number;
  id_medicine: number;
  medicine_name: string;
  presentation: string;
  quantity: number;
  id_transaction: number;
  provider_name: string;
  unit_price: number;
  currency: string;     // "MXN", ...
  date: string;         // ISO
};
