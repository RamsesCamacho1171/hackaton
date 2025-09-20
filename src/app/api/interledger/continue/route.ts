import { NextResponse } from "next/server";
import { PaymentsClient } from "@/back/models/PaymentsClients";
import { createPrivateKey } from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { stateId } = await req.json();
        if (!stateId) return NextResponse.json({ error: "Falta stateId" }, { status: 400 });
        console.log('mi codigo', stateId);
        const cookieStore = await cookies();
        const saved = JSON.parse(cookieStore.get(stateId)?.value)
        if (!saved) return NextResponse.json({ error: "stateId inválido o expirado" }, { status: 410 });

        const privateKey = createPrivateKey({
            key: Buffer.from(saved.private_key, "base64"),
            format: "der",
            type: "pkcs8",
        });

        const client = await PaymentsClient.init({
            walletAddressUrl: saved.myWallet,
            privateKey: privateKey,
            keyId: saved.key,
        });

        let finalizedOutgoingPaymentGrant;
        try {
            finalizedOutgoingPaymentGrant = await client.continueGrant(saved.continueUri, saved.continueAccessToken)

            if (finalizedOutgoingPaymentGrant.access_token) {
                const outgoingPayment = await client.outgoingPayment(
                    saved.sendWalletAddressId,
                    saved.sendWalletAddressResourceServer,
                    finalizedOutgoingPaymentGrant.access_token.value,
                    saved.quoteId
                )
                cookieStore.delete(stateId); // limpiar

                console.log(outgoingPayment);

                //si jala aqui mandamos al api de java
                return NextResponse.json({
                    outgoingPayment,
                });
            }

            return NextResponse.json({ error: "falta validar" }, { status: 410 });


        } catch (error) {
            console.log(error);
            cookieStore.delete(stateId);
            return NextResponse.json({ state: "denied" }, { status: 401 });

        }

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "No se pudo continuar el grant" }, { status: 400 });
    }
}