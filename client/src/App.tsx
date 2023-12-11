import EventCalendar from "./components/EventCalendar"
import UserIdentifier from "./components/UserIdentifier"
import store from './store/AppStore'
import ErrorAlert from "./components/ErrorAlert"
import { observer } from "mobx-react-lite"

const App = observer(() => {
  return (
    <>
      {store.hasError && <ErrorAlert message={store.hasError} onClose={store.handleErrorClose} />}
      <UserIdentifier />
      <EventCalendar />
    </>
  )
})

export default App
