import mongoose from "mongoose"

const { Schema } = mongoose

const CommunitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }]
})

export default mongoose.model("Community", CommunitySchema)
