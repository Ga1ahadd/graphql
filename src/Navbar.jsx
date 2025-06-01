import React from "react"
import { Link } from "react-router-dom"

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <h1>Instagram Clone</h1>
      <div>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/profile/1">👤 Mon Profil</Link>
        {isLoggedIn && (
          <button onClick={onLogout} style={{ marginLeft: "1rem" }}>
            🚪 Déconnexion
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
