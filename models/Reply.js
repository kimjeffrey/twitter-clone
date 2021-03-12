import mongoose from 'mongoose'

const ReplySchema = new mongoose.Schema({
  content: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  prevPost: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  date: Object,
  likes: Number
})

export default mongoose.models.Reply || mongoose.model('Reply', ReplySchema);