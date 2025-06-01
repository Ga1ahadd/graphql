import express from "express"
import http from "http"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import { useServer } from "graphql-ws/use/ws"
import { WebSocketServer } from "ws"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { makeExecutableSchema } from '@graphql-tools/schema'

// 🎯 1️⃣ Importation du schéma et des résolveurs depuis le dossier 'graph'
import typeDefs from "./graphql/schema.js"
import resolvers from "./graphql/resolvers.js"

// 🎯 2️⃣ Importation des routes REST depuis restRoutes.js
import restRoutes from "./restRoutes.js"

dotenv.config();

const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error("❌ L'URI MongoDB est manquant dans les variables d'environnement");
  process.exit(1);
}

//mongoose
mongoose.connect(dbURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

//mongoDB
import connectDB from "./db.js";
connectDB();

// 🎯 3️⃣ Initialisation d'Express et Apollo Server
const app = express()

// Middleware pour les requêtes JSON
app.use(express.json()) // Ajout de cette ligne pour parser les corps de requêtes en JSON

app.use(cors())

const httpServer = http.createServer(app)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

await apolloServer.start()
apolloServer.applyMiddleware({ app })

// 🎯 4️⃣ Utilisation des routes REST
app.use("/api", restRoutes) // Toutes les routes définies dans restRoutes.js seront accessibles via /api

// 🎯 5️⃣ WebSocket Server pour GraphQL Subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
})

useServer(
  {
    onConnect: ctx => console.log("Connexion WebSocket"),
    onDisconnect: () => console.log("Déconnexion WebSocket"),
    onError: err => console.error("WebSocket error :", err),
  },
  wsServer
)

const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
useServer({ schema: executableSchema }, wsServer);

// 🎯 6️⃣ Démarrage du serveur
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur GraphQL disponible sur http://localhost:${PORT}/graphql`)
  console.log(`📡 WebSocket Server actif sur ws://localhost:${PORT}/graphql`)
  console.log(`💬 API REST disponible sur http://localhost:${PORT}/api`)
})