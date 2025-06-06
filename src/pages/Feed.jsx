import React, { useState, useContext } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Link } from "react-router-dom"
import { UserContext } from "../UserContext.jsx"

import { GET_POSTS } from "../../queries.js"
import { ADD_POST, ADD_COMMENT } from "../../mutations.js"

function Feed() {
  const { user } = useContext(UserContext)
  const { data, loading, error } = useQuery(GET_POSTS)
  const [addPostMutation] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }]
  })
  const [addCommentMutation] = useMutation(ADD_COMMENT)

  const [newPostImage, setNewPostImage] = useState("")
  const [newPostDesc, setNewPostDesc] = useState("")
  const [commentTexts, setCommentTexts] = useState({})

  const handleAddPost = async () => {
    if (!newPostImage || !newPostDesc || !user) return
    try {
      await addPostMutation({
        variables: {
          userId: user.id,
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
    if (!text?.trim()) return

    try {
      await addCommentMutation({
        variables: { postId, text },
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

      setCommentTexts(prev => ({ ...prev, [postId]: "" }))
    } catch (err) {
      console.error("Erreur ajout commentaire:", err)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur: {error.message}</p>

  return (
    <div className="feed">
      {user && (
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
      )}

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

          {user && (
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
                  const comment = commentTexts[post.id]
                  if (comment && comment.trim()) {
                    handleAddComment(post.id, comment)
                  }
                }}
              >
                Publier
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Feed
