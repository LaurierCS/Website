import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Events from './pages/Events'
import NotFound from './pages/NotFound'
import Team from './pages/Team'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<Events />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
