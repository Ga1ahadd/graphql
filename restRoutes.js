import express from "express";
import User from "./graphql/models/user.js"
import Post from "./graphql/models/post.js"
import Comment from "./graphql/models/comment.js"

const router = express.Router();

// Récupérer tous les utilisateurs
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Récupérer un utilisateur par son ID
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: "Utilisateur non trouvé" });
});

export default router;
