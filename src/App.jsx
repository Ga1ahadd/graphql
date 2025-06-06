import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Community from "./pages/Community"
import ManageCommunities from "./pages/ManageCommunities"
import Navbar from "./Navbar"
import Auth from "./pages/Auth"
import { UserProvider } from "./UserContext"

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/admin/communities" element={<ManageCommunities />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
