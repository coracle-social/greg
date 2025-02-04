import { setContext } from "@welshman/lib";
import { getDefaultNetContext } from "@welshman/net";
import { getDefaultAppContext, makeRouter } from "@welshman/app";

// Constants for configuration
const INDEXER_RELAYS = ["wss://purplepag.es/", 'wss://relay.damus.io/'];
const REQUEST_TIMEOUT = 5000;

// Initialize Welshman configuration
export function initWelshman() {
  setContext({
    net: getDefaultNetContext(),
    app: getDefaultAppContext({
      indexerRelays: INDEXER_RELAYS,
      requestTimeout: REQUEST_TIMEOUT,
      router: makeRouter({
        getFallbackRelays: () => INDEXER_RELAYS,
        getIndexerRelays: () => INDEXER_RELAYS,
      }),
    }),
  });
} 