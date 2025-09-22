import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json([
        {
            "id_hospital": 1,
            "nombre_hospital": "Hospital General Norte",
            "private_key": "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
            "key": "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
            "wallet": "https://ilp.interledger-test.dev/usa",
            "email": "victorcamacho1171@gmail.com"
        },
        {
            "id_hospital": 2,
            "nombre_hospital": "Hospital San José",
            "private_key": "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
            "key": "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
            "wallet": "https://ilp.interledger-test.dev/usa",
            "email": "victorcamacho1171@gmail.com"
        },
        {
            "id_hospital": 3,
            "nombre_hospital": "Hospital Central",
            "private_key": "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
            "key": "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
            "wallet": "https://ilp.interledger-test.dev/usa",
            "email": "victorcamacho1171@gmail.com"
        }
    ]
    )
}