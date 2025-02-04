import './App.css'
import { Component, Show } from 'solid-js'
import { useAppState } from './AppState'
import LoginDialog from './components/LoginDialog'
import EventCards from './components/EventCards'

const App: Component = () => {
  const [state] = useAppState();

  return (
    <>
      <LoginDialog />
      <Show when={state.currentUserPubkey}>
        <EventCards />
      </Show>
    </>
  )
}

export default App
