import { Component, For } from "solid-js";
import { useAppState } from "../AppState";

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

  const eventsByKind = () => {
    const grouped = new Map<number, string[]>();
    
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

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <For each={Array.from(eventsByKind().entries())}>
        {([kind, urls]) => (
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">{EVENT_TITLES[kind] || `Kind ${kind}`}</h2>
              <ul class="list-disc list-inside">
                <For each={urls}>
                  {url => <li class="truncate">{url}</li>}
                </For>
              </ul>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default EventCards; 