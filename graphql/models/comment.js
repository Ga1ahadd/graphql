import mongoose from "mongoose"

const { Schema } = mongoose

const CommentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  })

export default mongoose.model("Comment", CommentSchema)