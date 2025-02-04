import { createContext, useContext, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import type { ISigner } from "@welshman/signer";
import type { TrustedEvent, HashedEvent, Repository } from "@welshman/util";
import { repository } from "@welshman/app";

// Define the shape of our state
type AppState = {
  currentUserPubkey?: string;
  signer?: ISigner;
  repository: Repository<TrustedEvent>;
};

// Define the shape of our state actions
type AppStateActions = {
  setCurrentUserPubkey: (pubkey: string | undefined) => void;
  setSigner: (signer: ISigner | undefined) => void;
  addEvent: (event: TrustedEvent) => void;
  publishEvent: (event: HashedEvent) => void;
};

// Create the context with a default value
const AppStateContext = createContext<[AppState, AppStateActions]>();

// Create a provider component
export function AppStateProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<AppState>({
    currentUserPubkey: undefined,
    signer: undefined,
    repository,
  });

  const actions: AppStateActions = {
    setCurrentUserPubkey: (pubkey) => setState("currentUserPubkey", pubkey),
    setSigner: (signer) => setState("signer", signer),
    addEvent: (event) => {
      state.repository.publish(event);
    },
    publishEvent: (event) => {
      state.repository.publish(event);
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