import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_COMMUNITIES } from "../queries.js";
import { UserContext } from "./UserContext.jsx";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [communities, setCommunities] = useState([]);

  const { data, loading, error } = useQuery(GET_USER_COMMUNITIES, {
    variables: { userId: user?.id },
    skip: !user,
  });

  useEffect(() => {
    if (error) {
      console.error("Erreur Apollo :", error);
    }
    if (data?.communitiesByUser) {
      setCommunities(data.communitiesByUser);
    }
  }, [data, error]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1>Instagram Clone</h1>
      <div className="nav-links">
        <Link to="/">🏠 Accueil</Link>

        {user ? (
          <>
            <Link to={`/profile/${user.id}`}>👤 Mon Profil</Link>

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
                        key={c.id}
                        to={`/community/${c.id}`}
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
                  <Link to="/admin/communities" className="dropdown-item admin-link">
                    Gérer les communautés
                  </Link>
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/auth">Connexion / Inscription</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
