import { Component } from "solid-js";
import { useAppState } from "../AppState";
import { getNip07, Nip07Signer } from "@welshman/signer";
import { loadInboxRelaySelections, load, loadRelaySelections } from "@welshman/app";

const LoginDialog: Component = () => {
  const [state, actions] = useAppState();

  const handleLogin = async () => {
    try {
      const nip07 = getNip07();
      if (!nip07) {
        throw new Error("No Nostr extension found");
      }

      const signer = new Nip07Signer();
      const pubkey = await signer.getPubkey();
      
      // Save both the signer and pubkey in state
      actions.setSigner(signer);
      actions.setCurrentUserPubkey(pubkey);
      console.log('=======')
      // Load user's relay selections from purplepag.es
      const relaySelections = await loadRelaySelections(pubkey);
      if (relaySelections) {
        actions.addEvent(relaySelections.event);
      }
      console.log(relaySelections)
      // Subscribe to user's events
      load({
        filters: [{
          authors: [pubkey],
          kinds: [10006, 10007, 10013, 10050, 30002],
        }],
        onEvent: (event) => {
            console.log(event)
            actions.addEvent(event);
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <dialog class="modal modal-bottom sm:modal-middle" open={state.currentUserPubkey === undefined}>
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">User Account</h3>
        <div class="flex justify-center">
          <button 
            class="btn btn-primary w-full max-w-xs"
            onClick={handleLogin}
          >
            Log in with extension
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default LoginDialog; 