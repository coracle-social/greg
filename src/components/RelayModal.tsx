import { Component, createSignal, For, onMount } from "solid-js";
import { INDEXER_RELAYS } from "../config/welshman";
import { useAppState } from "../AppState";

// Import EVENT_TITLES from EventCards to maintain consistency
const EVENT_TITLES: Record<number, string> = {
  10002: "Relay List",
  10006: "Statuses",
  10007: "People Lists",
  10013: "Bookmarks",
  10050: "Zap Lists",
  30002: "Highlights"
};

interface RelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  kind: number;
  initialUrls?: string[];
  onConfirm?: (relays: string[]) => void;
}

const RelayModal: Component<RelayModalProps> = (props) => {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [selectedRelays, setSelectedRelays] = createSignal<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = createSignal(false);
  
  // Reset state when modal opens with new kind
  onMount(() => {
    setSearchTerm("");
    setHasChanges(false);
    
    if (props.initialUrls) {
      setSelectedRelays(new Set(props.initialUrls));
    } else {
      setSelectedRelays(new Set<string>());
    }
  });

  const getModalTitle = () => {
    const baseTitle = EVENT_TITLES[props.kind] || `Kind ${props.kind}`;
    return `Add Relays - ${baseTitle}`;
  };

  const filteredRelays = () => {
    const term = searchTerm().toLowerCase();
    return INDEXER_RELAYS.filter(relay => 
      relay.toLowerCase().includes(term)
    );
  };

  const toggleRelay = (relay: string) => {
    const current = new Set(selectedRelays());
    if (current.has(relay)) {
      current.delete(relay);
    } else {
      current.add(relay);
    }
    setSelectedRelays(current);
    setHasChanges(true);
  };

  const handleConfirm = () => {
    const relayArray = Array.from(selectedRelays());
    props.onConfirm?.(relayArray);
    props.onClose();
  };

  return (
    <dialog class="modal" open={props.isOpen}>
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">{getModalTitle()}</h3>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search relays..."
          class="input input-bordered w-full mb-4"
          value={searchTerm()}
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
        />

        {/* Relay List */}
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <For each={filteredRelays()}>
            {relay => (
              <div 
                class="flex items-center p-2 hover:bg-base-300 rounded-lg cursor-pointer"
                onClick={() => toggleRelay(relay)}
              >
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary mr-3"
                  checked={selectedRelays().has(relay)}
                  // Prevent click event from bubbling to parent
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleRelay(relay)}
                />
                <span class="truncate flex-1">{relay}</span>
              </div>
            )}
          </For>
        </div>

        {/* Action Buttons */}
        <div class="modal-action">
          <button class="btn" onClick={props.onClose}>Cancel</button>
          {hasChanges() && (
            <button class="btn btn-primary" onClick={handleConfirm}>
              Confirm Changes
            </button>
          )}
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button onClick={props.onClose}>close</button>
      </form>
    </dialog>
  );
};

export default RelayModal; 