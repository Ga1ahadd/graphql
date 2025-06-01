import React, { useState } from "react"
import { useParams } from "react-router-dom"
import data from "../data.json"

function Profile() {
  const { id } = useParams()
  const user = data.users.find(user => user.id === id)
  const userPosts = data.posts.filter(post => post.userId === id)

  const [comments, setComments] = useState(data.comments)

  const addComment = (postId, text) => {
    const newComment = {
      id: Date.now().toString(),
      postId,
      userId: "1",
      text,
      createdAt: new Date().toISOString(),
    }
    setComments([...comments, newComment])
  }

  const deleteComment = commentId => {
    setComments(comments.filter(c => c.id !== commentId))
  }

  if (!user) {
    return <p>Utilisateur non trouvé.</p>
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

              {/* Liste des commentaires */}
              <div className="comments">
                {comments
                  .filter(c => c.postId === post.id)
                  .map(c => {
                    const commentUser = data.users.find(u => u.id === c.userId)
                    return (
                      <div key={c.id} className="comment">
                        <strong>{commentUser.username}:</strong> {c.text}
                        {c.userId === "1" && <button onClick={() => deleteComment(c.id)}>❌</button>}
                      </div>
                    )
                  })}
              </div>

              {/* Ajout d'un commentaire */}
              <input
                type="text"
                placeholder="&nbsp; Ajouter un commentaire..."
                onKeyDown={e => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    addComment(post.id, e.target.value)
                    e.target.value = ""
                  }
                }}
              />
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
