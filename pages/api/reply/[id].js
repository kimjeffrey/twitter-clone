import dbConnect from '../../../utils/dbConnect'
import Post from '../../../models/Post'
import Reply from '../../../models/Reply'

export default async function handler(req, res) {
  await dbConnect;

  const {query: {id}, method} = req;

  if(method === 'DELETE') {
    await Reply.findById(id).populate('prevPost').exec((err, reply) => {
      if(err) {
        res.status(400).json({message: "Failed to delete post from user."});
      } else {
        let newReplies = reply.prevPost.replies.filter(postId => postId.toString() !== id);
        Post.findByIdAndUpdate(reply.prevPost._id, {
          replies: newReplies
        }, (err) => {
          if(!err) {
            Reply.deleteOne({_id: id}, (err) => {
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