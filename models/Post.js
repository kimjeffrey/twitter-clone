import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  content: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  replies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}],
  date: Object,
  likes: Number
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema);