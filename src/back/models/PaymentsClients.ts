import { createAuthenticatedClient, type AuthenticatedClient } from "@interledger/open-payments";
import { waitForFinalizedGrant } from "../services/PaymentsHelper";
import { KeyObject } from "crypto";

type GrantAccess = {
    type: "quote" | "incoming-payment" | "outgoing-payment";
    actions: string[];
    limits?: Record<string, any>;
    identifier?: string;
};

type RequestGrantOptions = {
    access: GrantAccess[];
    interact?: {
        start?: ("redirect" | "user" | "external")[];
    };
    finalize?: boolean;
    maxAttempts?: number;
    delayMs?: number;
};

export class PaymentsClient {
    private client: AuthenticatedClient;

    private sendWallet: any;
    private receiveWallet: any;

    private constructor(client: AuthenticatedClient) {
        this.client = client;
    }

    static async init(config: {
        walletAddressUrl: string;
        privateKey: KeyObject;
        keyId: string;
    }) {
        const client = await createAuthenticatedClient({
            ...config,
            validateResponses: false
        });
        return new PaymentsClient(client);
    }

    //getters y setters
    async setSend(url: string) {
        this.sendWallet = await this.walletAddress(url);
        return this.sendWallet;
    }
    getSend() {
        return this.sendWallet; // tipo WalletAddressResponse | undefined
    }

    async setReceive(url: string) {
        this.receiveWallet = await this.walletAddress(url);
        return this.receiveWallet;
    }
    getReceive() {
        return this.receiveWallet;
    }

    //funciones

    private async walletAddress(url: string) {
        return this.client.walletAddress.get({ url });
    }

    async createIncomingPayment(receiveWallet: any, grant: any, value: string) {
        return await this.client.incomingPayment.create(
            {
                url: receiveWallet.resourceServer,
                accessToken: grant.access_token.value,
            },
            {
                walletAddress: receiveWallet.id,
                incomingAmount: {
                    assetCode: receiveWallet.assetCode,
                    assetScale: receiveWallet.assetScale,
                    value
                },
            }
        )
    }

    async requestGrant(
        wallet: { authServer: string },
        options: RequestGrantOptions
    ) {
        const {
            access,
            interact,
            finalize = true,
            maxAttempts = 10,
            delayMs = 500,
        } = options;

        const initialGrant = await this.client.grant.request(
            { url: wallet.authServer },
            {
                access_token: { access },
                ...(interact ? { interact } : {}),
            } as any
        );

        if (!finalize) {
            return initialGrant;
        }

        return await waitForFinalizedGrant(this.client, initialGrant, maxAttempts, delayMs);
    }

    async createQuote(sendWallet: any, receiverWallet: any, quoteGrant: any, incomingPayment: any) {
        return this.client.quote.create(
            {
                url: receiverWallet.resourceServer,
                accessToken: quoteGrant.access_token.value,
            },
            {
                walletAddress: sendWallet.id,
                receiver: incomingPayment.id,
                method: "ilp"
            }
        )
    }

    async continueGrant(url: any, accessToken: any) {
        return await this.client.grant.continue({
            url,
            accessToken
        })
    }

    async outgoingPayment(sendWalletId: any, sendWalletResourceServer: string, finalizedOutgoingPaymentGrantToken: any, quoteId: string) {
        return await this.client.outgoingPayment.create(
            {
                url: sendWalletResourceServer,
                accessToken: finalizedOutgoingPaymentGrantToken
            },
            {
                walletAddress: sendWalletId,
                quoteId
            }
        )
    }

}
