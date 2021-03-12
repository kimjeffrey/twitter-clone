import dbConnect from '../../../utils/dbConnect'
import Post from '../../../models/Post'
import Reply from '../../../models/Reply'
import User from '../../../models/User'

export default async function handler(req, res) {
  await dbConnect;

  const {query: {id}, method} = req;

  if(method === 'GET') {
    Post.findById(id).populate('user').populate({path: 'replies', populate: 'user'}).exec((err, post) => {
      if(!err) {
        res.status(200).json(post);
      } else {
        res.status(400).json({message: `Post ${req.query.id} was not found.`})
      }
    });
  } else if(method === 'DELETE') {
    await Post.findById(id).populate('user').exec((err, post) => {
      if(err) {
        res.status(400).json({message: "Failed to delete post from user."});
      } else {
        let newPosts = post.user.posts.filter(postId => postId.toString() !== id);
        User.findByIdAndUpdate(post.user._id, {
          posts: newPosts
        }, (err) => {
          if(!err) {
            Post.deleteOne({_id: id}, (err) => {
              if(!err) {
                res.status(200).end();
              } else{
                res.status(400).json({message: "Failed to delete post."});
              }
            })
          }
        })
      }
    });
  } else {
    res.status(200).end();
  }
}