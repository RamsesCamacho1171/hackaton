// app/api/inventario/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Construir objeto URL
  const { searchParams } = new URL(request.url);

  // 2. Leer hospital_id
  const hospitalId = searchParams.get("hospital_id");

  if (!hospitalId) {
    return NextResponse.json(
      { ok: false, error: "El parámetro hospital_id es requerido" },
      { status: 400 }
    );
  }

  // 3. Simular datos
  const data = [
    {
      id_hospital: 1,
      id_medicine: 1,
      medicine_name: "Paracetamol",
      presentation: "500mg",
      quantity: 120,
      id_transaction: 1,
      provider_name: "Paracetamol SA de CV",
      unit_price: 10,
      currency: "MXN",
      date: "2025-09-05T11:00:00Z",
    },
    {
      id_hospital: 1,
      id_medicine: 2,
      medicine_name: "Amoxicillin",
      presentation: "250mg",
      quantity: 80,
      id_transaction: 2,
      provider_name: "Amoxi Distribuciones S.A.",
      unit_price: 12.5,
      currency: "MXN",
      date: "2025-09-06T09:30:00Z",
    },
    {
      id_hospital: 1,
      id_medicine: 3,
      medicine_name: "Ibuprofen",
      presentation: "100mg/5ml",
      quantity: 60,
      id_transaction: 3,
      provider_name: "Ibuprofenos del Norte",
      unit_price: 8.75,
      currency: "MXN",
      date: "2025-09-07T14:20:00Z",
    },
    {
      id_hospital: 2,
      id_medicine: 4,
      medicine_name: "Metformin",
      presentation: "850mg",
      quantity: 50,
      id_transaction: 4,
      provider_name: "Metformina Global S.A.",
      unit_price: 15.2,
      currency: "MXN",
      date: "2025-09-08T10:45:00Z",
    },
    {
      id_hospital: 2,
      id_medicine: 5,
      medicine_name: "Losartan",
      presentation: "50mg",
      quantity: 90,
      id_transaction: 5,
      provider_name: "Losartan y Cía",
      unit_price: 9.9,
      currency: "MXN",
      date: "2025-09-09T16:15:00Z",
    },
    {
      id_hospital: 2,
      id_medicine: 6,
      medicine_name: "Omeprazole",
      presentation: "20mg",
      quantity: 70,
      id_transaction: 6,
      provider_name: "Omeprazol Internacional",
      unit_price: 7.5,
      currency: "MXN",
      date: "2025-09-10T13:00:00Z",
    },
    {
      id_hospital: 3,
      id_medicine: 7,
      medicine_name: "Chlorphenamine",
      presentation: "4mg",
      quantity: 40,
      id_transaction: 7,
      provider_name: "AlergiaCare S.A.",
      unit_price: 4.4,
      currency: "MXN",
      date: "2025-09-11T08:30:00Z",
    },
    {
      id_hospital: 3,
      id_medicine: 8,
      medicine_name: "Salbutamol",
      presentation: "Inhalador 100mcg",
      quantity: 25,
      id_transaction: 8,
      provider_name: "RespiraFarma",
      unit_price: 18,
      currency: "MXN",
      date: "2025-09-12T15:45:00Z",
    },
    {
      id_hospital: 3,
      id_medicine: 9,
      medicine_name: "NPH Insulin",
      presentation: "Frasco 10ml",
      quantity: 15,
      id_transaction: 9,
      provider_name: "Insulinas del Valle",
      unit_price: 45,
      currency: "MXN",
      date: "2025-09-13T12:10:00Z",
    },
    {
      id_hospital: 1,
      id_medicine: 10,
      medicine_name: "Acetylsalicylic Acid",
      presentation: "100mg",
      quantity: 200,
      id_transaction: 10,
      provider_name: "Ácido Pharma",
      unit_price: 3.25,
      currency: "MXN",
      date: "2025-09-14T17:20:00Z",
    },
  ];

  const result = data.filter((d) => d.id_hospital === Number(hospitalId));

  return NextResponse.json({ ok: true, hospitalId, inventario: result });
}
