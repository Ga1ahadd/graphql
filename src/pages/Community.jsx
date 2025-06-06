import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COMMUNITY_BY_ID,
  GET_POSTS_BY_COMMUNITY,
  GET_NON_MEMBERS
} from "../../queries.js";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { ADD_MEMBER_TO_COMMUNITY } from "../../mutations.js";

function Community() {
  const { id } = useParams();

  const {
    data: communityData,
    loading: loadingCommunity,
    error: errorCommunity,
  } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { id },
  });

  const {
    data: postData,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(GET_POSTS_BY_COMMUNITY, {
    variables: { id },
  });

  const {
    data: nonMembersData,
    loading: loadingNonMembers,
  } = useQuery(GET_NON_MEMBERS, {
    variables: { communityId: id },
    skip: !id,
  });

  const [addMember] = useMutation(ADD_MEMBER_TO_COMMUNITY, {
    refetchQueries: [
      { query: GET_COMMUNITY_BY_ID, variables: { id } }
    ]
  });

  const [selectedUserId, setSelectedUserId] = useState("");
  const [commentTexts, setCommentTexts] = useState({});

  if (loadingCommunity || loadingPosts || loadingNonMembers) return <p>Chargement...</p>;
  if (errorCommunity || errorPosts) return <p>Erreur lors du chargement des données</p>;
  if (!communityData?.community) return <p>Aucune donnée trouvée.</p>;

  const { name, description, members } = communityData.community;

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await addMember({
        variables: {
          communityId: id,
          userId: selectedUserId
        }
      });
      setSelectedUserId("");
    } catch (err) {
      console.error("Erreur lors de l'ajout du membre:", err);
    }
  };

  return (
    <div className="community-page">
      <h2>{name}</h2>
      <p>{description}</p>

      <h3>Publications des membres</h3>

      <div className="feed">
        {postData.postsByCommunity.map(post => (
          <div key={post.id} className="post">
            <Link to={`/profile/${post.userId.id}`}>
              <img
                src={`/images/${post.userId.avatar}`}
                alt={post.userId.username}
                className="avatar"
              />
              <span>{post.userId.username}</span>
            </Link>
            <img src={`/images/${post.image}`} alt={post.description} className="post-image" />
            <p>{post.description}</p>

            <div className="comments">
              {post.comments.map(c => (
                <div key={c.id} className="comment">
                  <strong>{c.userId.username}:</strong> {c.text}
                </div>
              ))}
            </div>

            <div className="comment-form">
              <input
                type="text"
                placeholder="Ajouter un commentaire..."
                value={commentTexts[post.id] || ""}
                onChange={e =>
                  setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))
                }
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id, commentTexts[post.id] || "")
                  }
                }}
              />
              <button
                onClick={() => {
                  const comment = commentTexts[post.id];
                  if (comment && comment.trim()) {
                    handleAddComment(post.id, comment);
                  }
                }}
              >
                Publier
              </button>
            </div>
          </div>
        ))}
      </div>

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

      <h4>Ajouter un membre</h4>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">-- Choisir un utilisateur --</option>
        {nonMembersData?.nonMembers.map(user => (
          <option key={user.id} value={user.id}>
            {user.fullName} (@{user.username})
          </option>
        ))}
      </select>
      <button onClick={handleAddMember} disabled={!selectedUserId}>
        Ajouter à la communauté
      </button>
    </div>
  );
}

export default Community;
