
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import ShortnerUrl from './pages/ShortnerUrl'
import Statistics from './pages/Statistics'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<ShortnerUrl />} />
        <Route path={"/statistics/:code"} element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App