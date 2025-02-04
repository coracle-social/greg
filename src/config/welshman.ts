import { setContext } from "@welshman/lib";
// import { } from "@welshman/net";
import { getDefaultNetContext, getDefaultAppContext, makeRouter } from "@welshman/app";

// Constants for configuration
export const INDEXER_RELAYS = ["wss://purplepag.es/", 'wss://relay.damus.io/'];
const REQUEST_TIMEOUT = 5000;

// Initialize Welshman configuration
export function initWelshman() {
  setContext({
    net: getDefaultNetContext(),
    app: getDefaultAppContext({
      indexerRelays: INDEXER_RELAYS,
      router: makeRouter(),
    }),
  });
} 