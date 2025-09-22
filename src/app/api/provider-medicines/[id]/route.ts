import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const data = [
    {
      id_provider: 1,
      id_medicine: 1,
      provider_name: "Paracetamol SA de CV",
      price: 10.0,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 2,
      id_medicine: 2,
      provider_name: "Amoxi Distribuciones S.A.",
      price: 12.5,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 3,
      id_medicine: 3,
      provider_name: "Ibuprofenos del Norte",
      price: 8.75,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 4,
      id_medicine: 4,
      provider_name: "Metformina Global S.A.",
      price: 15.2,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 5,
      id_medicine: 5,
      provider_name: "Losartan y Cía",
      price: 9.9,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 6,
      id_medicine: 6,
      provider_name: "Omeprazol Internacional",
      price: 7.5,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 7,
      id_medicine: 7,
      provider_name: "AlergiaCare S.A.",
      price: 4.4,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 8,
      id_medicine: 8,
      provider_name: "RespiraFarma",
      price: 18.0,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 9,
      id_medicine: 9,
      provider_name: "Insulinas del Valle",
      price: 45.0,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
    {
      id_provider: 10,
      id_medicine: 10,
      provider_name: "Ácido Pharma",
      price: 3.25,
      asset_code: "USD",
      wallet_url: "https://ilp.interledger-test.dev/qwerty",
    },
  ];

  const medi = data.filter((m) => m.id_medicine === Number(id));

  return NextResponse.json(medi);
}
