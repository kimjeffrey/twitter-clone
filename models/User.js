import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
})

export default mongoose.models.User || mongoose.model('User', UserSchema);