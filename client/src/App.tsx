import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import TemplateList from './pages/TemplateList'
import CreateTemplate from './pages/CreateTemplate'
import UpdateTemplate from './pages/UpdateTemplate'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<TemplateList />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/update-template" element={<UpdateTemplate />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
