import React, { useState, useContext } from "react"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { LOGIN_USER, REGISTER_USER } from "../../mutations.js"
import { UserContext } from "../UserContext.jsx"

function Auth() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerData, setRegisterData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    avatar: "",
    bio: ""
  })

  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [register] = useMutation(REGISTER_USER)
  const [login] = useMutation(LOGIN_USER)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await login({ variables: { email: loginEmail, password: loginPassword } })
      setUser(data.login)
      navigate("/")
    } catch (err) {
      console.error("Erreur login:", err.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const { data } = await register({ variables: { ...registerData } })
      setUser(data.register)
      navigate("/")
    } catch (err) {
      console.error("Erreur register:", err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="form-section">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          <button type="submit">Se connecter</button>
        </form>
      </div>

      <div className="form-section">
        <h2>Inscription</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nom d'utilisateur" value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} required />
          <input type="text" placeholder="Nom complet" value={registerData.fullName} onChange={e => setRegisterData({ ...registerData, fullName: e.target.value })} required />
          <input type="email" placeholder="Email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
          <input type="password" placeholder="Mot de passe" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
          <input type="text" placeholder="Avatar (nom de fichier)" value={registerData.avatar} onChange={e => setRegisterData({ ...registerData, avatar: e.target.value })} required />
          <input type="text" placeholder="Bio" value={registerData.bio} onChange={e => setRegisterData({ ...registerData, bio: e.target.value })} required />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  )
}

export default Auth
