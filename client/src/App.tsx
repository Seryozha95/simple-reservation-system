import EventCalendar from "./components/EventCalendar"
import store from './store/AppStore'
import { observer } from "mobx-react-lite"

function App() {
  return (
    <EventCalendar />
  )
}

export default App
