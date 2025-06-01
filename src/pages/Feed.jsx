import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Link } from "react-router-dom"

import { GET_POSTS } from "../../queries.js"
import { ADD_POST, ADD_COMMENT } from "../../mutations.js"

function Feed() {
  const { data, loading, error } = useQuery(GET_POSTS)
  const [addPostMutation] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }]
  })
  const [addCommentMutation] = useMutation(ADD_COMMENT)

  const [newPostImage, setNewPostImage] = useState("")
  const [newPostDesc, setNewPostDesc] = useState("")

  const currentUser = {
    id: "1",
    username: "john_doe",
    avatar: "john.jpg"
  }

  const handleAddPost = async () => {
    if (!newPostImage || !newPostDesc) return
    try {
      await addPostMutation({
        variables: {
          userId: currentUser.id,
          image: newPostImage,
          description: newPostDesc
        }
      })
      setNewPostImage("")
      setNewPostDesc("")
    } catch (err) {
      console.error("Erreur ajout post:", err)
    }
  }

  const handleAddComment = async (postId, text) => {
    try {
      await addCommentMutation({
        variables: {
          postId,
          userId: currentUser.id,
          text
        },
        
        update(cache, { data: { addComment } }) {
          const existing = cache.readQuery({ query: GET_POSTS })
          const updatedPosts = existing.posts.map(post =>
            post.id === postId
              ? { ...post, comments: [...post.comments, addComment] }
              : post
          )
          cache.writeQuery({
            query: GET_POSTS,
            data: { posts: updatedPosts }
          })
        }
      })
    } catch (err) {
      console.error("Erreur ajout commentaire:", err)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur: {error.message}</p>

  return (
    <div className="feed">

      <div className="new-post">
        <input
          type="text"
          placeholder="URL de l'image"
          value={newPostImage}
          onChange={e => setNewPostImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newPostDesc}
          onChange={e => setNewPostDesc(e.target.value)}
        />
        <button onClick={handleAddPost}>Publier</button>
      </div>

      {data.posts.map(post => (
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


          <input
            type="text"
            placeholder="Ajouter un commentaire..."
            onKeyDown={e => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                handleAddComment(post.id, e.target.value.trim())
                e.target.value = ""
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default Feed