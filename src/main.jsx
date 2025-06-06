import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split } from "@apollo/client"
import "./style.css"
import App from "./App.jsx"
import { createClient } from "graphql-ws"
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    retryAttempts: 10,
    keepAlive: 100000,
    on: {
      connected: () => console.log("WebSocket connecté"),
      closed: event => console.log(`WebSocket fermé : `, event),
      error: err => console.error("Erreur WebSocket :", err),
    },
  })
)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === "OperationDefinition" && definition.operation === "subscription"
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)