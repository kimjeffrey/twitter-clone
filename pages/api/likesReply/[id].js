import dbConnect from '../../../utils/dbConnect'
import Reply from '../../../models/Reply'
import User from '../../../models/User'

export default async function handler(req, res) {
  await dbConnect;

  const {query: {id}, body, method} = req;

  if(method === 'GET') {
    const user = await User.findById(id);
    if(user.likedReplies){
      res.status(200).json(user.likedReplies);
    } else {
      res.status(200).json({message: "No likes."})
    }
  } else if(method === 'POST') {
    Reply.findByIdAndUpdate(id, {
      $inc: {likes: 1}
    }, (err) => {
      if(err) {
        res.status(400).json({message: `Failed to increment like.`})
      } else {
        User.findByIdAndUpdate(body.user, {
          $push: {likedReplies: id}
        }, {
          upsert: true
        }, (err) => {
          if(!err) {
            res.status(200).end();
          } else {
            res.status(400).json({message: `Failed to like post.`})
          }
        })
      }
    })    
  } else if(method === 'PUT') {
    Reply.findByIdAndUpdate(id, {
      $inc: {likes: -1}
    }, (err) => {
      if(err) {
        res.status(400).json({message: `Failed to decrement like.`})
      } else {
        User.findById(body.user, (err, user) => {
          if(err) {
            res.status(400).json({message: `Failed to remove like.`})
          } else {
            user.likedReplies = user.likedReplies.filter(replyId => replyId.toString() !== id);
            user.save((err) => {
              if(err) {
                res.status(400).json({message: `Failed to remove like.`})
              } else {
                res.status(200).end();
              }
            })
          }
        })
      }
    })

    
  } else {
    res.status(200).end();
  }
}