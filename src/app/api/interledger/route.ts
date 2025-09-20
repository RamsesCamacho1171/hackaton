import { NextResponse } from "next/server";
import { PaymentsClient } from "@/back/models/PaymentsClients";
import { createPrivateKey } from "crypto";
import { cookies } from "next/headers";


export async function POST(req: Request) {
    try {
        const {
            privateKey,
            myWallet,
            receiverWallet,
            key,
            value
        } = await req.json();

        const private_key = createPrivateKey({
            key: Buffer.from(privateKey, "base64"),
            format: "der",
            type: "pkcs8",
        });

        const client = await PaymentsClient.init({
            walletAddressUrl: myWallet,
            privateKey: private_key,
            keyId: key,
        });


        const send = await client.setSend(myWallet)
        const receive = await client.setReceive(receiverWallet)

        const incomingPaymentGrant = await client.requestGrant(receive, {
            access: [{ type: "incoming-payment", actions: ["create"] }],
            finalize: true,
        });


        const incomingPayment = await client.createIncomingPayment(receive, incomingPaymentGrant, value)


        const quoteGrant = await client.requestGrant(send, {
            access: [{ type: "quote", actions: ["create"] }],
            finalize: true,
        });

        const quote = await client.createQuote(send, receive, quoteGrant, incomingPayment);


        const outgoingPaymentGrant = await client.requestGrant(send, {
            access: [{
                type: "outgoing-payment",
                actions: ["create"],
                limits: { debitAmount: quote.debitAmount },
                identifier: send.id,
            }],
            interact: { start: ["redirect"] },
            finalize: false,
        });


        const cookieStore = await cookies();
        const stateId = crypto.randomUUID();
        cookieStore.set(stateId, JSON.stringify({
            continueUri: outgoingPaymentGrant.continue.uri,
            continueAccessToken: outgoingPaymentGrant.continue.access_token.value,
            incomingPaymentId: incomingPayment.id,
            quoteId: quote.id,
            receiveAmount: quote.receiveAmount,
            debitAmount: quote.debitAmount,
            quoteExpiresAt: quote.expiresAt!,
            sendWalletAddressId: send.id,
            sendWalletAddressResourceServer: send.resourceServer,
            private_key: privateKey,
            myWallet,
            key
        }));

        return NextResponse.json({
            stateId,
            redirectUrl: outgoingPaymentGrant.interact.redirect,
            context: {
                incomingPaymentId: incomingPayment.id,
                quoteId: quote.id,
                receiveAmount: quote.receiveAmount,
                debitAmount: quote.debitAmount,
                quoteExpiresAt: quote.expiresAt,
            },
        });

    } catch (e) {
        console.log(e);

        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
}