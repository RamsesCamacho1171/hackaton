export type Hospital = { id: string; name: string };
export type Provider = { id: string; name: string; hospitalId: string };
export type Medicine = {
id: string;
name: string;
presentation?: string;
unitPrice: number;
quantities: Record<string /* hospitalId */, number>; // stock por hospital
};
export type Purchase = {
  id: string;        // uuid o similar
  folio: string;     // por ejemplo "PO-ABC123"
  hospitalId: string;
  medicineId: string;
  providerId: string;
  quantity: number;
  unitPrice: number;
  total: number;     // unitPrice * quantity
  createdAt: string; // ISO
};
export const LOW_STOCK = 10;


// lib/types.ts

export type StockStatusKey = "none" | "low" | "ok";



export const hospitals: Hospital[] = [
  { id: "h1", name: "Hospital Central" },
  { id: "h2", name: "Clínica del Norte" },
  { id: "h3", name: "San José General" },
];

export const medicines: Medicine[] = [
  {
    id: "m1",
    name: "Paracetamol",
    presentation: "500mg (10 tabs)",
    unitPrice: 15.5,
    quantities: { h1: 12, h2: 4, h3: 0 },
  },
  {
    id: "m2",
    name: "Ibuprofeno",
    presentation: "400mg (10 tabs)",
    unitPrice: 18.0,
    quantities: { h1: 9, h2: 30, h3: 11 },
  },
  {
    id: "m3",
    name: "Vitamina C",
    presentation: "1g (10 tabs)",
    unitPrice: 10.0,
    quantities: { h1: 0, h2: 2, h3: 50 },
  },
  {
    id: "m4",
    name: "Alcohol Gel",
    presentation: "100ml",
    unitPrice: 22.0,
    quantities: { h1: 25, h2: 6, h3: 14 },
  },
  {
    id: "m5",
    name: "Amoxicilina",
    presentation: "500mg (20 caps)",
    unitPrice: 35.0,
    quantities: { h1: 18, h2: 5, h3: 0 },
  },
  {
    id: "m6",
    name: "Diclofenaco",
    presentation: "50mg (20 tabs)",
    unitPrice: 20.0,
    quantities: { h1: 4, h2: 12, h3: 7 },
  },
  {
    id: "m7",
    name: "Omeprazol",
    presentation: "20mg (14 caps)",
    unitPrice: 28.0,
    quantities: { h1: 15, h2: 0, h3: 9 },
  },
  {
    id: "m8",
    name: "Metformina",
    presentation: "850mg (30 tabs)",
    unitPrice: 40.0,
    quantities: { h1: 22, h2: 8, h3: 4 },
  },
  {
    id: "m9",
    name: "Losartán",
    presentation: "50mg (30 tabs)",
    unitPrice: 45.0,
    quantities: { h1: 3, h2: 16, h3: 10 },
  },
  {
    id: "m10",
    name: "Aspirina",
    presentation: "100mg (28 tabs)",
    unitPrice: 12.0,
    quantities: { h1: 40, h2: 2, h3: 5 },
  },
  {
    id: "m11",
    name: "Clorfenamina",
    presentation: "4mg (20 tabs)",
    unitPrice: 8.0,
    quantities: { h1: 6, h2: 0, h3: 18 },
  },
  {
    id: "m12",
    name: "Loratadina",
    presentation: "10mg (10 tabs)",
    unitPrice: 14.0,
    quantities: { h1: 12, h2: 25, h3: 0 },
  },
  {
    id: "m13",
    name: "Prednisona",
    presentation: "5mg (20 tabs)",
    unitPrice: 30.0,
    quantities: { h1: 0, h2: 8, h3: 4 },
  },
  {
    id: "m14",
    name: "Insulina",
    presentation: "10ml vial",
    unitPrice: 120.0,
    quantities: { h1: 2, h2: 6, h3: 1 },
  },
  {
    id: "m15",
    name: "Furosemida",
    presentation: "40mg (20 tabs)",
    unitPrice: 25.0,
    quantities: { h1: 7, h2: 12, h3: 0 },
  },
  {
    id: "m16",
    name: "Atorvastatina",
    presentation: "20mg (30 tabs)",
    unitPrice: 65.0,
    quantities: { h1: 13, h2: 5, h3: 9 },
  },
  {
    id: "m17",
    name: "Salbutamol Inhalador",
    presentation: "100mcg (200 dosis)",
    unitPrice: 95.0,
    quantities: { h1: 4, h2: 0, h3: 3 },
  },
  {
    id: "m18",
    name: "Captopril",
    presentation: "25mg (20 tabs)",
    unitPrice: 18.0,
    quantities: { h1: 15, h2: 7, h3: 2 },
  },
  {
    id: "m19",
    name: "Enalapril",
    presentation: "10mg (30 tabs)",
    unitPrice: 32.0,
    quantities: { h1: 11, h2: 9, h3: 6 },
  },
  {
    id: "m20",
    name: "Ketorolaco",
    presentation: "10mg (10 tabs)",
    unitPrice: 22.0,
    quantities: { h1: 5, h2: 3, h3: 0 },
  },
  {
    id: "m21",
    name: "Levofloxacino",
    presentation: "500mg (7 tabs)",
    unitPrice: 80.0,
    quantities: { h1: 2, h2: 1, h3: 4 },
  },
  {
    id: "m22",
    name: "Azitromicina",
    presentation: "500mg (3 tabs)",
    unitPrice: 70.0,
    quantities: { h1: 0, h2: 5, h3: 8 },
  },
  {
    id: "m23",
    name: "Claritromicina",
    presentation: "500mg (14 tabs)",
    unitPrice: 95.0,
    quantities: { h1: 7, h2: 6, h3: 2 },
  },
  {
    id: "m24",
    name: "Ceftriaxona",
    presentation: "1g vial",
    unitPrice: 150.0,
    quantities: { h1: 3, h2: 0, h3: 1 },
  },
  {
    id: "m25",
    name: "Dexametasona",
    presentation: "8mg (10 tabs)",
    unitPrice: 40.0,
    quantities: { h1: 9, h2: 4, h3: 6 },
  },
  {
    id: "m26",
    name: "Naproxeno",
    presentation: "500mg (20 tabs)",
    unitPrice: 28.0,
    quantities: { h1: 20, h2: 10, h3: 0 },
  },
  {
    id: "m27",
    name: "Aciclovir",
    presentation: "400mg (25 tabs)",
    unitPrice: 55.0,
    quantities: { h1: 1, h2: 2, h3: 0 },
  },
  {
    id: "m28",
    name: "Ranitidina",
    presentation: "150mg (20 tabs)",
    unitPrice: 18.0,
    quantities: { h1: 0, h2: 0, h3: 15 },
  },
  {
    id: "m29",
    name: "Hidroxicloroquina",
    presentation: "200mg (30 tabs)",
    unitPrice: 120.0,
    quantities: { h1: 8, h2: 0, h3: 6 },
  },
  {
    id: "m30",
    name: "Clopidogrel",
    presentation: "75mg (28 tabs)",
    unitPrice: 85.0,
    quantities: { h1: 5, h2: 11, h3: 2 },
  },
];

export const providers: Provider[] = [
  // h1
  { id: "p-mmx", name: "MedMX Distribuidora", hospitalId: "h1" },
  { id: "p-alf", name: "Alfa Farma", hospitalId: "h1" },
  // h2
  { id: "p-nor", name: "Norte Médica", hospitalId: "h2" },
  { id: "p-sal", name: "Salud Total", hospitalId: "h2" },
  // h3
  { id: "p-sur", name: "Suministros del Sur", hospitalId: "h3" },
  { id: "p-gen", name: "Genéricos Express", hospitalId: "h3" },
];

export const purchases: Purchase[] = [
  // h1
  { id: "po1", folio: "PO-7A3F1C", hospitalId: "h1", medicineId: "m1",  providerId: "p-mmx", quantity: 20, unitPrice: 15.5, total: 310, createdAt: "2025-09-10T10:05:00Z" },
  { id: "po2", folio: "PO-1B9E22", hospitalId: "h1", medicineId: "m2",  providerId: "p-alf", quantity: 15, unitPrice: 18.0, total: 270, createdAt: "2025-09-12T15:40:00Z" },
  { id: "po3", folio: "PO-5D21A9", hospitalId: "h1", medicineId: "m10", providerId: "p-sol", quantity: 50, unitPrice: 12.0, total: 600, createdAt: "2025-09-13T09:10:00Z" },
  { id: "po4", folio: "PO-8C41F0", hospitalId: "h1", medicineId: "m14", providerId: "p-mmx", quantity: 5,  unitPrice: 120.0, total: 600, createdAt: "2025-09-14T12:20:00Z" },

  // h2
  { id: "po5", folio: "PO-3F7E55", hospitalId: "h2", medicineId: "m3",  providerId: "p-sal", quantity: 25, unitPrice: 10.0, total: 250, createdAt: "2025-09-08T08:15:00Z" },
  { id: "po6", folio: "PO-2A11D4", hospitalId: "h2", medicineId: "m9",  providerId: "p-nor", quantity: 10, unitPrice: 45.0, total: 450, createdAt: "2025-09-11T17:30:00Z" },
  { id: "po7", folio: "PO-4B77C2", hospitalId: "h2", medicineId: "m23", providerId: "p-sal", quantity: 6,  unitPrice: 95.0, total: 570, createdAt: "2025-09-16T13:50:00Z" },

  // h3
  { id: "po8", folio: "PO-9D8A10", hospitalId: "h3", medicineId: "m26", providerId: "p-gen", quantity: 30, unitPrice: 28.0, total: 840, createdAt: "2025-09-05T11:00:00Z" },
  { id: "po9", folio: "PO-0E12B3", hospitalId: "h3", medicineId: "m30", providerId: "p-sur", quantity: 12, unitPrice: 85.0, total: 1020, createdAt: "2025-09-09T14:25:00Z" },
  { id: "po10", folio: "PO-6C45A8", hospitalId: "h3", medicineId: "m21", providerId: "p-gen", quantity: 4,  unitPrice: 80.0, total: 320, createdAt: "2025-09-15T10:40:00Z" },
];


export function getQty(m: Medicine, hospitalId: string | null) {
  if (!hospitalId) return 0;
  return m.quantities[hospitalId] ?? 0;
}

export function getStockStatus(qty: number, low = LOW_STOCK): StockStatusKey {
  if (qty <= 0) return "none";
  if (qty < low) return "low";
  return "ok";
}

export function getProvidersByHospital(hospitalId: string | null) {
  if (!hospitalId) return [];
  return providers.filter((p) => p.hospitalId === hospitalId);
}