import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/store"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar"
import TypeareaOptimized from "./components/TypeareaOptimized"
import Profile from "./components/Profile"
import Leaderboard from "./components/Leaderboard"
import ErrorBoundary from "./components/ErrorBoundary"

function AppContent() {
  const theme = useSelector((state) => state.settings.theme)

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
        }`}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TypeareaOptimized />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
