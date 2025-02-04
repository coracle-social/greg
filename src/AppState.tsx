import { createContext, useContext, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import type { ISigner } from "@welshman/signer";
import type { TrustedEvent } from "@welshman/util";

// Define the shape of our state
type AppState = {
  currentUserPubkey?: string;
  signer?: ISigner;
  events: TrustedEvent[];
};

// Define the shape of our state actions
type AppStateActions = {
  setCurrentUserPubkey: (pubkey: string | undefined) => void;
  setSigner: (signer: ISigner | undefined) => void;
  addEvent: (event: TrustedEvent) => void;
  updateEvent: (kind: number, content: string) => void;
};

// Create the context with a default value
const AppStateContext = createContext<[AppState, AppStateActions]>();

// Create a provider component
export function AppStateProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<AppState>({
    currentUserPubkey: undefined,
    signer: undefined,
    events: [],
  });

  const actions: AppStateActions = {
    setCurrentUserPubkey: (pubkey) => setState("currentUserPubkey", pubkey),
    setSigner: (signer) => setState("signer", signer),
    addEvent: (event) => setState("events", (events) => [...events, event]),
    updateEvent: (kind: number, content: string) => {
      setState("events", (events) => {
        const existingEventIndex = events.findIndex(e => e.kind === kind);
        if (existingEventIndex >= 0) {
          // Replace existing event
          return [
            ...events.slice(0, existingEventIndex),
            { ...events[existingEventIndex], content },
            ...events.slice(existingEventIndex + 1)
          ];
        } else {
          // Create new event
          const newEvent: TrustedEvent = {
            kind,
            content,
            created_at: Math.floor(Date.now() / 1000),
            pubkey: state.currentUserPubkey || "",
            id: "", // This would normally be set by the relay
            sig: "", // This would normally be set by signing
            tags: []
          };
          return [...events, newEvent];
        }
      });
    }
  };

  return (
    <AppStateContext.Provider value={[state, actions]}>
      {props.children}
    </AppStateContext.Provider>
  );
}

// Create a hook to use the context
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
} 