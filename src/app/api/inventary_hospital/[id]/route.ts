import { NextResponse } from 'next/server'

type Params = { id: string }

export async function GET(
    _req: Request,
    { params }: { params: Promise<Params> }  
) {
    const { id } = await params
    const data = [
        {
            "id_hospital": 1,
            "id_medicamento": 1,
            "nombre_medicamento": "Paracetamol",
            "presentacion": "Tabletas 500mg",
            "cantidad": 120
        },
        {
            "id_hospital": 1,
            "id_medicamento": 2,
            "nombre_medicamento": "Amoxicilina",
            "presentacion": "Cápsulas 250mg",
            "cantidad": 80
        },
        {
            "id_hospital": 1,
            "id_medicamento": 3,
            "nombre_medicamento": "Ibuprofeno",
            "presentacion": "Suspensión 100mg/5ml",
            "cantidad": 60
        },
        {
            "id_hospital": 1,
            "id_medicamento": 4,
            "nombre_medicamento": "Metformina",
            "presentacion": "Tabletas 850mg",
            "cantidad": 50
        },
        {
            "id_hospital": 1,
            "id_medicamento": 5,
            "nombre_medicamento": "Losartán",
            "presentacion": "Tabletas 50mg",
            "cantidad": 90
        },
        {
            "id_hospital": 1,
            "id_medicamento": 6,
            "nombre_medicamento": "Omeprazol",
            "presentacion": "Cápsulas 20mg",
            "cantidad": 70
        },
        {
            "id_hospital": 1,
            "id_medicamento": 7,
            "nombre_medicamento": "Clorfenamina",
            "presentacion": "Tabletas 4mg",
            "cantidad": 40
        },
        {
            "id_hospital": 1,
            "id_medicamento": 8,
            "nombre_medicamento": "Salbutamol",
            "presentacion": "Inhalador 100mcg",
            "cantidad": 25
        },
        {
            "id_hospital": 1,
            "id_medicamento": 9,
            "nombre_medicamento": "Insulina NPH",
            "presentacion": "Frasco 10ml",
            "cantidad": 15
        },
        {
            "id_hospital": 1,
            "id_medicamento": 10,
            "nombre_medicamento": "Ácido Acetilsalicílico",
            "presentacion": "Tabletas 100mg",
            "cantidad": 200
        },

        {
            "id_hospital": 2,
            "id_medicamento": 1,
            "nombre_medicamento": "Paracetamol",
            "presentacion": "Tabletas 500mg",
            "cantidad": 300
        },
        {
            "id_hospital": 2,
            "id_medicamento": 2,
            "nombre_medicamento": "Amoxicilina",
            "presentacion": "Cápsulas 250mg",
            "cantidad": 150
        },
        {
            "id_hospital": 2,
            "id_medicamento": 3,
            "nombre_medicamento": "Ibuprofeno",
            "presentacion": "Suspensión 100mg/5ml",
            "cantidad": 75
        },
        {
            "id_hospital": 2,
            "id_medicamento": 4,
            "nombre_medicamento": "Metformina",
            "presentacion": "Tabletas 850mg",
            "cantidad": 100
        },
        {
            "id_hospital": 2,
            "id_medicamento": 5,
            "nombre_medicamento": "Losartán",
            "presentacion": "Tabletas 50mg",
            "cantidad": 85
        },
        {
            "id_hospital": 2,
            "id_medicamento": 6,
            "nombre_medicamento": "Omeprazol",
            "presentacion": "Cápsulas 20mg",
            "cantidad": 110
        },
        {
            "id_hospital": 2,
            "id_medicamento": 7,
            "nombre_medicamento": "Clorfenamina",
            "presentacion": "Tabletas 4mg",
            "cantidad": 35
        },
        {
            "id_hospital": 2,
            "id_medicamento": 8,
            "nombre_medicamento": "Salbutamol",
            "presentacion": "Inhalador 100mcg",
            "cantidad": 40
        },
        {
            "id_hospital": 2,
            "id_medicamento": 9,
            "nombre_medicamento": "Insulina NPH",
            "presentacion": "Frasco 10ml",
            "cantidad": 20
        },
        {
            "id_hospital": 2,
            "id_medicamento": 10,
            "nombre_medicamento": "Ácido Acetilsalicílico",
            "presentacion": "Tabletas 100mg",
            "cantidad": 180
        },

        {
            "id_hospital": 3,
            "id_medicamento": 1,
            "nombre_medicamento": "Paracetamol",
            "presentacion": "Tabletas 500mg",
            "cantidad": 250
        },
        {
            "id_hospital": 3,
            "id_medicamento": 2,
            "nombre_medicamento": "Amoxicilina",
            "presentacion": "Cápsulas 250mg",
            "cantidad": 95
        },
        {
            "id_hospital": 3,
            "id_medicamento": 3,
            "nombre_medicamento": "Ibuprofeno",
            "presentacion": "Suspensión 100mg/5ml",
            "cantidad": 55
        },
        {
            "id_hospital": 3,
            "id_medicamento": 4,
            "nombre_medicamento": "Metformina",
            "presentacion": "Tabletas 850mg",
            "cantidad": 130
        },
        {
            "id_hospital": 3,
            "id_medicamento": 5,
            "nombre_medicamento": "Losartán",
            "presentacion": "Tabletas 50mg",
            "cantidad": 60
        },
        {
            "id_hospital": 3,
            "id_medicamento": 6,
            "nombre_medicamento": "Omeprazol",
            "presentacion": "Cápsulas 20mg",
            "cantidad": 85
        },
        {
            "id_hospital": 3,
            "id_medicamento": 7,
            "nombre_medicamento": "Clorfenamina",
            "presentacion": "Tabletas 4mg",
            "cantidad": 45
        },
        {
            "id_hospital": 3,
            "id_medicamento": 8,
            "nombre_medicamento": "Salbutamol",
            "presentacion": "Inhalador 100mcg",
            "cantidad": 30
        },
        {
            "id_hospital": 3,
            "id_medicamento": 9,
            "nombre_medicamento": "Insulina NPH",
            "presentacion": "Frasco 10ml",
            "cantidad": 18
        },
        {
            "id_hospital": 3,
            "id_medicamento": 10,
            "nombre_medicamento": "Ácido Acetilsalicílico",
            "presentacion": "Tabletas 100mg",
            "cantidad": 220
        }
    ]

    const medi = data.filter((m) => m.id_hospital === Number(id))


    return NextResponse.json(medi)
}