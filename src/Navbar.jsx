import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_COMMUNITIES } from "../queries.js";

function Navbar() {
  const [communities, setCommunities] = useState([]);

  const { data, loading, error } = useQuery(GET_USER_COMMUNITIES);

  useEffect(() => {
    if (error) {
      console.error("Apollo error:", error);
    }
    if (data && data.communitiesByUser) {
      setCommunities(data.communitiesByUser);
    }
  }, [data, error]);

  return (
    <nav className="navbar">
      <h1>Instagram Clone</h1>
      <div className="nav-links">
        <Link to="/">🏠 Accueil</Link>
        <Link to="/profile/1">👤 Mon Profil</Link>

        <div className="dropdown-wrapper">
          <div className="dropdown-toggle-wrapper">
            <span className="dropdown-toggle">🌐 Communautés</span>
            <div className="dropdown-menu">
              {loading ? (
                <span className="dropdown-item">Chargement...</span>
              ) : error ? (
                <span className="dropdown-item">Erreur lors du chargement</span>
              ) : communities.length > 0 ? (
                communities.map((c) => (
                  <Link
                    key={c.idCommunity || c.id}
                    to={`/community/${c.idCommunity || c.id}`}
                    className="dropdown-item"
                  >
                    {c.name}
                  </Link>
                ))
              ) : (
                <span className="dropdown-item no-community">
                  Vous ne faites partie d'aucune communauté
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
