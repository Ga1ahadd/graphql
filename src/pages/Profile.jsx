import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { useUser } from "../UserContext"
import { GET_POSTS, GET_USER } from "../../queries.js"
import { ADD_COMMENT } from "../../mutations.js"

function Profile() {
  const { user: currentUser } = useUser()

  const { data: userData, loading: loadingUser, error: errorUser } = useQuery(GET_USER, {
    variables: { id: currentUser?.id },
    skip: !currentUser?.id
  })

  const { data: postsData, loading: loadingPosts, error: errorPosts } = useQuery(GET_POSTS)
  const [addCommentMutation] = useMutation(ADD_COMMENT)
  const [commentTexts, setCommentTexts] = useState({})

  if (!currentUser || loadingUser || loadingPosts) return <p>Chargement...</p>
  if (errorUser || errorPosts) return <p>Erreur lors du chargement des données</p>

  const user = userData?.user
  const userPosts = postsData?.posts.filter(post => post.userId.id === user.id)

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
          cache.writeQuery({ query: GET_POSTS, data: { posts: updatedPosts } })
        }
      })
      setCommentTexts(prev => ({ ...prev, [postId]: "" }))
    } catch (err) {
      console.error("Erreur ajout commentaire:", err)
    }
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={`/images/${user.avatar}`} alt={user.fullName} className="avatar" />
        <h2>{user.fullName}</h2>
        <p className="bio">{user.bio}</p>
      </div>

      <div className="profile-posts">
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <div key={post.id} className="post">
              <img src={`/images/${post.image}`} alt={post.description} />
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
                value={commentTexts[post.id] || ""}
                onChange={e => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id, commentTexts[post.id] || "")
                  }
                }}
              />
              <button onClick={() => handleAddComment(post.id, commentTexts[post.id] || "")}>
                Publier
              </button>
            </div>
          ))
        ) : (
          <p>Aucun post pour cet utilisateur.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
