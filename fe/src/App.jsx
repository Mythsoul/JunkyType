import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/store"
import { useSelector } from "react-redux"
import Navbar from "./components/Navbar"
import Typearea from "./components/Typearea"
import Leaderboard from "./components/Leaderboard"
import Profile from "./components/Profile"

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
            <Route path="/" element={<Typearea />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App