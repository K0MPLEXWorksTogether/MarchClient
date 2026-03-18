import { Routes, Route } from 'react-router'
import Session from './pages/Session'
import Goals from './pages/Goals'

function App() {

  return (
    <Routes>
      <Route index element={<Goals />}></Route>
      <Route path="session" element={<Session />}></Route>
    </Routes>
  )
}

export default App
