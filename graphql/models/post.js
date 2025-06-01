import mongoose from "mongoose"
 
const { Schema } = mongoose
 
const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
})
 
export default mongoose.models.Post || mongoose.model("Post", PostSchema)