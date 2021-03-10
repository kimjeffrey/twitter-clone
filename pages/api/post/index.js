import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'
import Post from '../../../models/Post'

export default async function handler(req, res) {
  await dbConnect;

  const {body, method} = req;

  if(method === 'POST') {
    const newPost = new Post({
      user: body.user,
      content: body.content,
      date: new Date(),
      likes: 0,
    })

    newPost.save((err) => {
      if(!err) {
        User.findByIdAndUpdate(body.user, {
          $push: {posts: newPost._id}
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