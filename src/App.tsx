import './App.css'
import { Component, Show, Suspense } from 'solid-js'
import { useAppState } from './AppState'
import LoginDialog from './components/LoginDialog'
import EventList from './components/EventList'
import { createResource } from 'solid-js'
import { load, loadRelaySelections, loadFollows } from "@welshman/app";
import { getListTags, getPubkeyTagValues } from "@welshman/util";
import ProfileInfo from './components/ProfileInfo'

const App: Component = () => {
  const [state, actions] = useAppState();

  // Create resource that loads all data when user logs in
  const [data] = createResource(
    () => state.currentUserPubkey,
    async (pubkey) => {
      // Load user's relay selections
      const relaySelections = await loadRelaySelections(pubkey);
      if (relaySelections) {
        actions.addEvent(relaySelections.event);
      }

      // Load followers and their relay selections
      const follows = await loadFollows(pubkey);
      const followPubkeys = getPubkeyTagValues(getListTags(follows));
      
      // Load relay selections for each follower
      await Promise.all(followPubkeys.map(async (follow) => {
        const followerRelays = await loadRelaySelections(follow);
        if (followerRelays) {
          actions.addEvent(followerRelays.event);
        }
      }));

      // TODO: FIXME DON'T RETURN EARLY
      return true;

      // Subscribe to events
      await Promise.all([
        // User's events
        load({
          filters: [{
            authors: [pubkey],
            kinds: [10006, 10007, 10013, 10050, 30002],
          }],
          onEvent: (event) => actions.addEvent(event)
        }),
        // Followers' events
        ...followPubkeys.map(follow => 
          load({
            filters: [{
              authors: [follow],
              kinds: [10006, 10007, 10013, 10050, 30002],
            }],
            onEvent: (event) => actions.addEvent(event)
          })
        )
      ]);

      return true; // Signal completion
    }
  );

  return (
    <>
      <LoginDialog />
      <Show when={state.currentUserPubkey}>
        <Suspense fallback={<div class="p-4">Loading data...</div>}>
          <Show when={data()}>
            <ProfileInfo />
            <EventList />
          </Show>
        </Suspense>
      </Show>
    </>
  )
}

export default App
