import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import TripSummary from './pages/TripSummary'
import MyTrips from './pages/MyTrips'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/create-trip'
            element={<CreateTrip />}
          />
          <Route
            path='/trip-summary'
            element={<TripSummary />}
          />
          <Route path="/my-trips" element={<MyTrips />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
