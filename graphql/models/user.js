import mongoose from "mongoose"

const { Schema } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  avatar: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, required: true },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

export default mongoose.model("User", UserSchema)