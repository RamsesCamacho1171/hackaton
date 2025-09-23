import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(request: Request) {
  // 1. Construir objeto URL
  const { searchParams } = new URL(request.url);

  // 2. Leer hospital_id
  const hospitalId = searchParams.get("hospital_id");
  const medicineId = searchParams.get("medicine_id");

    if (!hospitalId) {
    return NextResponse.json(
      { ok: false, error: "El parámetro hospital_id es requerido" },
      { status: 400 }
    );
  }

  const data = [
    {
      id_hospital: 1,
      id_medicine: 1,
      medicine_name: "Paracetamol",
      presentation: "Tabletas 500mg",
      quantity: 120,
    },
    {
      id_hospital: 1,
      id_medicine: 2,
      medicine_name: "Amoxicillin",
      presentation: "Cápsulas 250mg",
      quantity: 80,
    },
    {
      id_hospital: 1,
      id_medicine: 3,
      medicine_name: "Ibuprofen",
      presentation: "Suspensión 100mg/5ml",
      quantity: 60,
    },
    {
      id_hospital: 1,
      id_medicine: 4,
      medicine_name: "Metformin",
      presentation: "Tabletas 850mg",
      quantity: 50,
    },
    {
      id_hospital: 1,
      id_medicine: 5,
      medicine_name: "Losartan",
      presentation: "Tabletas 50mg",
      quantity: 90,
    },
    {
      id_hospital: 1,
      id_medicine: 6,
      medicine_name: "Omeprazole",
      presentation: "Cápsulas 20mg",
      quantity: 70,
    },
    {
      id_hospital: 1,
      id_medicine: 7,
      medicine_name: "Chlorphenamine",
      presentation: "Tabletas 4mg",
      quantity: 40,
    },
    {
      id_hospital: 1,
      id_medicine: 8,
      medicine_name: "Salbutamol",
      presentation: "Inhalador 100mcg",
      quantity: 25,
    },
    {
      id_hospital: 1,
      id_medicine: 9,
      medicine_name: "NPH Insulin",
      presentation: "Frasco 10ml",
      quantity: 15,
    },
    {
      id_hospital: 1,
      id_medicine: 10,
      medicine_name: "Acetylsalicylic Acid",
      presentation: "Tabletas 100mg",
      quantity: 200,
    },

    {
      id_hospital: 2,
      id_medicine: 1,
      medicine_name: "Paracetamol",
      presentation: "Tabletas 500mg",
      quantity: 300,
    },
    {
      id_hospital: 2,
      id_medicine: 2,
      medicine_name: "Amoxicillin",
      presentation: "Cápsulas 250mg",
      quantity: 150,
    },
    {
      id_hospital: 2,
      id_medicine: 3,
      medicine_name: "Ibuprofen",
      presentation: "Suspensión 100mg/5ml",
      quantity: 75,
    },
    {
      id_hospital: 2,
      id_medicine: 4,
      medicine_name: "Metformin",
      presentation: "Tabletas 850mg",
      quantity: 100,
    },
    {
      id_hospital: 2,
      id_medicine: 5,
      medicine_name: "Losartan",
      presentation: "Tabletas 50mg",
      quantity: 85,
    },
    {
      id_hospital: 2,
      id_medicine: 6,
      medicine_name: "Omeprazole",
      presentation: "Cápsulas 20mg",
      quantity: 110,
    },
    {
      id_hospital: 2,
      id_medicine: 7,
      medicine_name: "Chlorphenamine",
      presentation: "Tabletas 4mg",
      quantity: 35,
    },
    {
      id_hospital: 2,
      id_medicine: 8,
      medicine_name: "Salbutamol",
      presentation: "Inhalador 100mcg",
      quantity: 40,
    },
    {
      id_hospital: 2,
      id_medicine: 9,
      medicine_name: "NPH Insulin",
      presentation: "Frasco 10ml",
      quantity: 20,
    },
    {
      id_hospital: 2,
      id_medicine: 10,
      medicine_name: "Acetylsalicylic Acid",
      presentation: "Tabletas 100mg",
      quantity: 180,
    },

    {
      id_hospital: 3,
      id_medicine: 1,
      medicine_name: "Paracetamol",
      presentation: "Tabletas 500mg",
      quantity: 250,
    },
    {
      id_hospital: 3,
      id_medicine: 2,
      medicine_name: "Amoxicillin",
      presentation: "Cápsulas 250mg",
      quantity: 95,
    },
    {
      id_hospital: 3,
      id_medicine: 3,
      medicine_name: "Ibuprofen",
      presentation: "Suspensión 100mg/5ml",
      quantity: 55,
    },
    {
      id_hospital: 3,
      id_medicine: 4,
      medicine_name: "Metformin",
      presentation: "Tabletas 850mg",
      quantity: 130,
    },
    {
      id_hospital: 3,
      id_medicine: 5,
      medicine_name: "Losartan",
      presentation: "Tabletas 50mg",
      quantity: 60,
    },
    {
      id_hospital: 3,
      id_medicine: 6,
      medicine_name: "Omeprazole",
      presentation: "Cápsulas 20mg",
      quantity: 85,
    },
    {
      id_hospital: 3,
      id_medicine: 7,
      medicine_name: "Chlorphenamine",
      presentation: "Tabletas 4mg",
      quantity: 45,
    },
    {
      id_hospital: 3,
      id_medicine: 8,
      medicine_name: "Salbutamol",
      presentation: "Inhalador 100mcg",
      quantity: 30,
    },
    {
      id_hospital: 3,
      id_medicine: 9,
      medicine_name: "NPH Insulin",
      presentation: "Frasco 10ml",
      quantity: 18,
    },
    {
      id_hospital: 3,
      id_medicine: 10,
      medicine_name: "Acetylsalicylic Acid",
      presentation: "Tabletas 100mg",
      quantity: 220,
    },
    {
      id_hospital: 1,
      id_medicine: 12,
      medicine_name: "fentanilo",
      presentation: "Tabletas 100mg",
      quantity: 220,
    },
  ];

  let medi = data.filter((m) => m.id_hospital === Number(hospitalId));

  if(medicineId){
    medi = medi.filter((m) => m.id_medicine === Number(medicineId))
  }

  return NextResponse.json(medi);
}
