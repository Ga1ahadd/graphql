import jwt from "jsonwebtoken"

export const context = ({ req }) => {
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) return {}

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || "changeme")
    return { userId }
  } catch {
    return {}
  }
}
