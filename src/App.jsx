import { useState } from "react"
import AuthForm from "./AuthForm"
import Navbar from "./Navbar"
import Feed from "./pages/Feed"

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <div>
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      {!token ? (
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
          <AuthForm mode="signup" onAuth={setToken} />
          <AuthForm mode="login" onAuth={setToken} />
        </div>
      ) : (
        <Feed token={token} />
      )}
    </div>
  )
}
