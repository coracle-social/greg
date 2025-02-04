import { Component, createSignal, For, Show } from "solid-js";
import type { TrustedEvent } from "@welshman/util";
import { readList, asDecryptedEvent } from "@welshman/util";
import { getRelayUrls } from "@welshman/app";
import RelayModal from "./RelayModal";

interface EventCardProps {
  kind: number;
  title: string;
  event?: TrustedEvent;
}

const EventCard: Component<EventCardProps> = (props) => {
  const [modalOpen, setModalOpen] = createSignal(false);
  const initialUrls = getRelayUrls(readList(asDecryptedEvent(props.event)));
  const [urls, setUrls] = createSignal<string[]>(initialUrls);
  const [isDirty, setIsDirty] = createSignal(false);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleConfirm = (relays: string[]) => {
    setUrls(relays);
    setIsDirty(true);
    setModalOpen(false);
  };

  const handleDiscard = () => {
    setUrls(initialUrls);
    setIsDirty(false);
  };

  const handleSave = () => {
    // TODO: Publish the updated relay list to nostr
    setIsDirty(false);
  };

  return (
    <>
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <h2 class="card-title">{props.title}</h2>
            <div class="flex gap-2">
              <Show when={isDirty()}>
                <button 
                  class="btn btn-sm btn-ghost"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button 
                  class="btn btn-sm btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
              </Show>
              <button 
                class="btn btn-sm btn-primary"
                onClick={handleAddClick}
              >
                Add
              </button>
            </div>
          </div>
          {urls().length === 0 ? (
            <p class="text-gray-500 italic">No items yet</p>
          ) : (
            <ul class="list-disc list-inside">
              <For each={urls()}>
                {url => <li class="truncate">{url}</li>}
              </For>
            </ul>
          )}
        </div>
      </div>

      <RelayModal 
        isOpen={modalOpen()} 
        onClose={() => setModalOpen(false)}
        kind={props.kind}
        initialUrls={urls()}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default EventCard; 