import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'

export default async function handler(req, res) {
  await dbConnect;

  const {query: {id}, body, method} = req;

  const user = await User.findById(id);

  if(method === 'GET') {
    if(user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({message: `User ${req.query.id} was not found.`})
    }
  } else if(method === 'POST') {
    const newPost = {
      _id: id,
      _postId: Date.now(),
      name: user.name,
      content: body,
      date: new Date()
    } 

    await User.findByIdAndUpdate(id, {
      posts: [...user.posts, newPost]
    }, {
      upsert: true
    })

    res.status(200).end();
  } else if(method === 'PUT') {
    let newPosts = user.posts.filter(post => post._postId !== body);
    await User.findByIdAndUpdate(id, {
      posts: newPosts
    })

    res.status(200).end();
  }
}