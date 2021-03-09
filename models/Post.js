import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  content: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: Object,
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema);