import mongoose from "mongoose"

const { Schema } = mongoose

const CommunitySchema = new Schema({
  idCommunity: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }]
})

export default mongoose.model("Community", CommunitySchema)
