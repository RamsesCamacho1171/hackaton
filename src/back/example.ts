
import { createAuthenticatedClient, isFinalizedGrant } from "@interledger/open-payments";
import { createPrivateKey } from 'crypto'
import  Readline  from "readline/promises";  

(async () => {

    const privateKey = "MC4CAQAwBQYDK2VwBCIEIMqvB0Z5Lv0y3ri2JUZS7PbNaA1KrDC3St8sQNrk0BEs"
    console.log(privateKey);

    const key = createPrivateKey({
        key: Buffer.from(privateKey, "base64"),
        format: "der",
        type: "pkcs8",
    });

    const client = await createAuthenticatedClient({
        walletAddressUrl: "https://ilp.interledger-test.dev/usa",
        privateKey: key,
        keyId: "c490f52c-0a49-48a4-bbe9-935e4ac7329a"
    })
console.log('--------------');

    console.log(client);
console.log('--------------');

    const sendWalletAddress = await client.walletAddress.get({
        url: 'https://ilp.interledger-test.dev/usa'
    })

    const reciveWalletAddress = await client.walletAddress.get({
        url: 'https://ilp.interledger-test.dev/qwerty'
    })

    console.log(sendWalletAddress, reciveWalletAddress);
    

    const incomingPaymentGrant = await client.grant.request(
        {
            url: reciveWalletAddress.authServer
        },
        {
            access_token:{
                access:[
                    {
                        type: 'incoming-payment',
                        actions: ["create"]
                    }
                ]
            }
        }
    );

    if(!isFinalizedGrant(incomingPaymentGrant)){
        throw new Error("Se espera a que finalice")
    }

    console.log(incomingPaymentGrant);

    const incomingPayment = await client.incomingPayment.create(
        {
            url:reciveWalletAddress.resourceServer,
            accessToken:incomingPaymentGrant.access_token.value,
        },
        {
            walletAddress:reciveWalletAddress.id,
            incomingAmount:{
                assetCode:reciveWalletAddress.assetCode,
                assetScale: reciveWalletAddress.assetScale,
                value: "1000"
            },
        }
    );
    
    console.log({incomingPayment});

    const quoteGrant = await client.grant.request(
        {
            url:sendWalletAddress.authServer,
        },
        {
            access_token:{
                access: [
                    {
                        type:"quote",
                        actions:["create"]
                    }
                ]
            }
        }
    );

    if(!isFinalizedGrant(quoteGrant)){
        throw new Error("se espera que se finalice la consesion");
    }

    console.log(quoteGrant);
    
    const quote = await client.quote.create(
        {
            url:reciveWalletAddress.resourceServer,
            accessToken: quoteGrant.access_token.value,
        },
        {
            walletAddress: sendWalletAddress.id,
            receiver:incomingPayment.id,
            method: "ilp"
        }
    );

    console.log({quote});

    const outgoingPaymentGrant = await client.grant.request(
        {
            url:sendWalletAddress.authServer,
        },
        {
            access_token:{
                access:[
                    {
                        type:"outgoing-payment",
                        actions:["create"],
                        limits:{
                            debitAmount:quote.debitAmount,
                        },
                        identifier:sendWalletAddress.id
                    }
                ]
            },
            interact:{
                start: ["redirect"]
            },
        }
    )
    console.log({outgoingPaymentGrant});

    await Readline
    .createInterface({
            input: process.stdin,
            output: process.stdout
    })
    .question('seguir...');
    
    const finalizedOutgoingPaymentGrant = await client.grant.continue({
        url:outgoingPaymentGrant.continue.uri,
        accessToken:outgoingPaymentGrant.continue.access_token.value
    });

    console.log(finalizedOutgoingPaymentGrant);
    

    if(!isFinalizedGrant(finalizedOutgoingPaymentGrant)){
        throw new Error("se espera a que acabe este rollo")
    }

    const outgoingPayment = await client.outgoingPayment.create(
        {
            url:sendWalletAddress.resourceServer,
            accessToken:finalizedOutgoingPaymentGrant.access_token.value
        },
        {
            walletAddress:sendWalletAddress.id,
            quoteId:quote.id
        }
    )

    console.log({outgoingPayment});
    

})();
