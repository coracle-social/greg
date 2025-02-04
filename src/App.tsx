import './App.css'
import { Component, Show } from 'solid-js'
import { useAppState } from './AppState'
import LoginDialog from './components/LoginDialog'
import EventList from './components/EventList'

const App: Component = () => {
  const [state] = useAppState();

  return (
    <>
      <LoginDialog />
      <Show when={state.currentUserPubkey}>
        <EventList />
      </Show>
    </>
  )
}

export default App
