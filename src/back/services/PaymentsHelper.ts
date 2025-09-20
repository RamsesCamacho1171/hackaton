import { isFinalizedGrant, type AuthenticatedClient } from "@interledger/open-payments";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function waitForFinalizedGrant(
    client: AuthenticatedClient,
    initialGrant: any,
    maxAttempts = 10,
    delayMs = 500
) {
    let grant = initialGrant;
    let attempt = 0;

    while (!isFinalizedGrant(grant)) {
        if (!grant?.continue?.uri || !grant?.continue?.access_token?.value) {
            throw new Error("Grant no finalizado y sin datos de continuación.");
        }
        if (attempt >= maxAttempts) {
            throw new Error(`Se alcanzó el máximo de reintentos (${maxAttempts}).`);
        }

        // opcional: una breve pausa
        if (delayMs > 0) await sleep(delayMs);

        grant = await client.grant.continue({
            url: grant.continue.uri,
            accessToken: grant.continue.access_token.value,
        });

        attempt++;
    }

    return grant;
}
