import { Component, For } from "solid-js";
import { useAppState } from "../AppState";
import EventCard from "./EventCard";

export const EVENT_KINDS = [
  10002,
  10006,
  10007,
  10013,
  10050,
  30002,
] as const;

export const EVENT_TITLES: Record<number, string> = {
  [10002]: "Relay List",
  [10006]: "Blocked Relays",
  [10007]: "Search Relays",
  [10013]: "Private Storage Relays",
  [10050]: "Inbox Relays",
};

const EventList: Component = () => {
  const [state] = useAppState();

  const getEvent = (kind: number) => {
    return state.repository.query([{
      kinds: [kind],
      authors: [state.currentUserPubkey!],
    }])[0];
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <For each={EVENT_KINDS}>
        {(kind) => (
          <EventCard 
            kind={kind} 
            title={EVENT_TITLES[kind]} 
            event={getEvent(kind)}
          />
        )}
      </For>
    </div>
  );
};

export default EventList; 