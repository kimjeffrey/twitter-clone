import dbConnect from '../../../utils/dbConnect'
import Post from '../../../models/Post'
import Reply from '../../../models/Reply'

export default async function handler(req, res) {
  await dbConnect;

  const {body, method} = req;

  if(method === 'POST') {
    const newReply = new Reply({
      user: body.user,
      prevPost: body.post,
      content: body.content,
      date: new Date(),
      likes: 0,
    })

    newReply.save((err) => {
      if(!err) {
        Post.findByIdAndUpdate(body.post, {
          $push: {replies: newReply._id}
        }, {
          upsert: true
        }, (err) => {
          if(err) {
            res.status(400).json({message: err});
          } else {
            res.status(200).end();
          }
        });
      } else {
        res.status(400).json({message: err});
      }
    })
  } 

  res.status(200).end();
}