import { Component, For, createSignal } from "solid-js";
import { useAppState } from "../AppState";
import RelayModal from "./RelayModal";

const EVENT_TITLES: Record<number, string> = {
  10002: "Relay List",
  10006: "Statuses",
  10007: "People Lists",
  10013: "Bookmarks",
  10050: "Zap Lists",
  30002: "Highlights"
};

const EventCards: Component = () => {
  const [state] = useAppState();
  const [modalOpen, setModalOpen] = createSignal(false);
  const [selectedKind, setSelectedKind] = createSignal<number | null>(null);

  const eventsByKind = () => {
    const grouped = new Map<number, string[]>();
    
    // Initialize map with empty arrays for all known event types
    Object.keys(EVENT_TITLES).forEach(kind => {
      grouped.set(Number(kind), []);
    });
    
    // Then populate with actual data
    state.events.forEach(event => {
      let urls: string[] = [];
      try {
        const content = JSON.parse(event.content);
        urls = Array.isArray(content) ? content.map(item => item.url || item) : [];
      } catch {
        urls = [];
      }
      grouped.set(event.kind, urls);
    });

    return grouped;
  };

  const handleAddClick = (kind: number) => {
    setSelectedKind(kind);
    setModalOpen(true);
  };

  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <For each={Array.from(eventsByKind().entries())}>
          {([kind, urls]) => (
            <div class="card bg-base-200 shadow-xl">
              <div class="card-body">
                <div class="flex justify-between items-center">
                  <h2 class="card-title">{EVENT_TITLES[kind] || `Kind ${kind}`}</h2>
                  <button 
                    class="btn btn-sm btn-primary"
                    onClick={() => handleAddClick(kind)}
                  >
                    Add
                  </button>
                </div>
                {urls.length === 0 ? (
                  <p class="text-gray-500 italic">No items yet</p>
                ) : (
                  <ul class="list-disc list-inside">
                    <For each={urls}>
                      {url => <li class="truncate">{url}</li>}
                    </For>
                  </ul>
                )}
              </div>
            </div>
          )}
        </For>
      </div>

      <RelayModal 
        isOpen={modalOpen()} 
        onClose={() => setModalOpen(false)}
        kind={selectedKind() ?? 0}
      />
    </>
  );
};

export default EventCards; 