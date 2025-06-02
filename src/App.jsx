import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Community from "./pages/Community"
import Navbar from "./Navbar"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/community/:id" element={<Community />} />
      </Routes>
    </Router>
  )
}

export default App

