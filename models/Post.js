import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  content: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: Object,
  likes: Number
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema);