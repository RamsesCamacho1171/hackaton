import { NextResponse } from "next/server";
import { PaymentsClient } from "@/back/models/PaymentsClients";
import { createPrivateKey } from "crypto";
import { cookies } from "next/headers";
import { sendEmail } from "@/lib/template";

export async function POST(req: Request) {
  try {
    const {
      privateKey,
      myWallet,
      receiverWallet,
      key,
      value,
      name_medicam,
      presentation,
      email,
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

    const send = await client.setSend(myWallet);
    const receive = await client.setReceive(receiverWallet);

    const incomingPaymentGrant = await client.requestGrant(receive, {
      access: [{ type: "incoming-payment", actions: ["create"] }],
      finalize: true,
    });

    const incomingPayment = await client.createIncomingPayment(
      receive,
      incomingPaymentGrant,
      value
    );

    const quoteGrant = await client.requestGrant(send, {
      access: [{ type: "quote", actions: ["create"] }],
      finalize: true,
    });

    const quote = await client.createQuote(
      send,
      receive,
      quoteGrant,
      incomingPayment
    );

    const outgoingPaymentGrant = await client.requestGrant(send, {
      access: [
        {
          type: "outgoing-payment",
          actions: ["create"],
          limits: { debitAmount: quote.debitAmount },
          identifier: send.id,
        },
      ],
      interact: { start: ["redirect"] },
      finalize: false,
    });

    const cookieStore = await cookies();
    const stateId = crypto.randomUUID();
    cookieStore.set(
      stateId,
      JSON.stringify({
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
        key,
      })
    );

    const emailSend = await sendEmail(
      {
        url_pago: outgoingPaymentGrant.interact.redirect,
        cantidad: value,
        medicamento: name_medicam + "-" + presentation,
        moneda_destino: quote.receiveAmount.assetCode,
        moneda_origen: quote.debitAmount.assetCode,
        monto_destino: Number(quote.receiveAmount.value),
        monto_origen: Number(quote.debitAmount.value),
      },
      email
    );

    if (emailSend) {
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
    }

    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  } catch (e) {
    console.log(e);
  }
}
