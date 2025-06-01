import { useState } from "react"

export default function AuthForm({ mode = "login", onAuth }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const endpoint = "http://localhost:4000/graphql"

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            ${mode}(email: "${email}", password: "${password}") {
              token
              user { id email }
            }
          }
        `
      })
    })

    const json = await res.json()
    const token = json?.data?.[mode]?.token

    if (token) {
      localStorage.setItem("token", token)
      onAuth(token)
    } else {
      alert("Erreur : " + (json.errors?.[0]?.message || "Échec de l'opération"))
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}>
      <h3>{mode === "signup" ? "Créer un compte" : "Connexion"}</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">{mode === "signup" ? "S'inscrire" : "Se connecter"}</button>
    </form>
  )
}
