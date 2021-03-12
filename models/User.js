import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  liked: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  likedReplies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}]
})

export default mongoose.models.User || mongoose.model('User', UserSchema);