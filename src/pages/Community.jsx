import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_BY_ID } from "../../queries.js";

function Community() {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { idCommunity: parseInt(id) },
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement de la communauté</p>;
  if (!data || !data.community) return <p>Aucune donnée trouvée.</p>;

  const { name, description, members } = data.community;

  return (
    <div className="community-page">
      <h2>{name}</h2>
      <p>{description}</p>

      <h3>Membres</h3>
      <div className="members-list">
        {members.map((user) => (
          <div key={user.id} className="member-card">
            <img src={`/images/${user.avatar}`} alt={user.username} className="avatar" />
            <p>{user.fullName}</p>
            <span className="username">@{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
