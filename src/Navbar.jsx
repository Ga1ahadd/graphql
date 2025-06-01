import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Instagram Clone</h1>
      <div>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/profile/1">👤 Mon Profil</Link>
      </div>
    </nav>
  );
}

export default Navbar;
