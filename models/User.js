import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  posts: Array,
})

export default mongoose.models.User || mongoose.model('User', UserSchema);