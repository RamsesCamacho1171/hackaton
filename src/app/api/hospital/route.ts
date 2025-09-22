import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id_hospital: 1,
      hospital_name: "Hospital General Norte",
      private_key:
        "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
      api_key: "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
      wallet_url: "https://ilp.interledger-test.dev/usa",
      email: "victorcamacho1171@gmail.com",
    },
    {
      id_hospital: 2,
      hospital_name: "Hospital San José",
      private_key:
        "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
      api_key: "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
      wallet_url: "https://ilp.interledger-test.dev/usa",
      email: "victorcamacho1171@gmail.com",
    },
    {
      id_hospital: 3,
      hospital_name: "Hospital Central",
      private_key:
        "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs",
      api_key: "c490f52c-0a49-48a4-bbe9-935e4ac7329a",
      wallet_url: "https://ilp.interledger-test.dev/usa",
      email: "victorcamacho1171@gmail.com",
    },
  ]);
}