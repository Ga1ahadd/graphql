import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_COMMUNITIES } from "../../queries.js";
import {
  ADD_COMMUNITY,
  UPDATE_COMMUNITY,
  DELETE_COMMUNITY
} from "../../mutations.js";
import { UserContext } from "../UserContext.jsx";

function ManageCommunities() {
  const { user } = useContext(UserContext);

  const { data, loading, error } = useQuery(GET_USER_COMMUNITIES, {
    variables: { userId: user?.id },
    skip: !user,
  });

  const [addCommunity] = useMutation(ADD_COMMUNITY, {
    refetchQueries: [
      {
        query: GET_USER_COMMUNITIES,
        variables: { userId: user?.id },
      },
    ],
  });

  const [updateCommunity, { loading: updating }] = useMutation(UPDATE_COMMUNITY, {
    refetchQueries: [
      {
        query: GET_USER_COMMUNITIES,
        variables: { userId: user?.id },
      },
    ],
  });

  const [deleteCommunity] = useMutation(DELETE_COMMUNITY, {
    refetchQueries: [
      {
        query: GET_USER_COMMUNITIES,
        variables: { userId: user?.id },
      },
    ],
  });

  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });
  const [editState, setEditState] = useState({});

  const handleCreate = async () => {
    if (!newCommunity.name.trim()) return;
    await addCommunity({ variables: { ...newCommunity, userId: user.id } });
    setNewCommunity({ name: "", description: "" });
  };

  const handleEditChange = (id, field, value) => {
    setEditState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    console.log("🟡 handleUpdate appelé pour :", id);

    const edited = editState[id];
    if (!edited) {
      console.log("⚠️ Rien à modifier");
      return;
    }

    const original = data.communitiesByUser.find(c => c.id === id);
    if (!original) return;

    const updatedData = {
      id,
      name: edited.name?.trim() || original.name,
      description: edited.description?.trim() || original.description,
    };

    console.log("🔧 Données envoyées pour mise à jour :", updatedData);

    try {
      await updateCommunity({ variables: updatedData });
      setEditState(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour :", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette communauté ?")) {
      await deleteCommunity({ variables: { id } });
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur de chargement</p>;

  return (
    <div className="manage-communities">
      <h2>Gérer les communautés</h2>

      <div className="create-community">
        <input
          type="text"
          placeholder="Nom"
          value={newCommunity.name}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Description"
          value={newCommunity.description}
          onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
        />
        <button onClick={handleCreate}>Créer</button>
      </div>

      <ul className="community-list">
        {data?.communitiesByUser?.length > 0 ? (
          data.communitiesByUser.map((c) => (
            <li key={c.id}>
              <input
                type="text"
                value={editState[c.id]?.name ?? c.name}
                onChange={(e) => handleEditChange(c.id, "name", e.target.value)}
              />
              <input
                type="text"
                value={editState[c.id]?.description ?? c.description}
                onChange={(e) => handleEditChange(c.id, "description", e.target.value)}
              />
              <button onClick={() => handleUpdate(c.id)} disabled={updating}>
                {updating ? "Mise à jour..." : "Modifier"}
              </button>
              <button onClick={() => handleDelete(c.id)}>Supprimer</button>
            </li>
          ))
        ) : (
          <p>Aucune communauté trouvée.</p>
        )}
      </ul>
    </div>
  );
}

export default ManageCommunities;
