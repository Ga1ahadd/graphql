import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_COMMUNITIES, GET_COMMUNITY_BY_ID} from "../../queries.js";
import {
  ADD_COMMUNITY, UPDATE_COMMUNITY, DELETE_COMMUNITY} from "../../mutations.js";

function ManageCommunities() {
  const { data, loading, error } = useQuery(GET_USER_COMMUNITIES);
  const [addCommunity] = useMutation(ADD_COMMUNITY, {
    refetchQueries: [{ query: GET_USER_COMMUNITIES }],
  });
  const [updateCommunity] = useMutation(UPDATE_COMMUNITY, {
    refetchQueries: [{ query: GET_USER_COMMUNITIES }],
  });
  const [deleteCommunity] = useMutation(DELETE_COMMUNITY, {
    refetchQueries: [{ query: GET_USER_COMMUNITIES }],
  });

  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });
  const [editState, setEditState] = useState({});

  const handleCreate = async () => {
    if (!newCommunity.name.trim()) return;
    await addCommunity({ variables: newCommunity });
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
    const input = editState[id];
    if (!input?.name?.trim()) return;
    await updateCommunity({ variables: { id, ...input } });
    setEditState(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
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
        {data.communitiesByUser.map((c) => (
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
            <button onClick={() => handleUpdate(c.id)}>Modifier</button>
            <button onClick={() => handleDelete(c.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCommunities;
