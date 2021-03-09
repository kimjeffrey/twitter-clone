import dbConnect from '../../../utils/dbConnect'
import Post from '../../../models/Post'

export default async function handler(req, res) {

  await dbConnect();

  try {
    await Post.find({}).populate("user").exec((err, post) => {
      if(err) {
        res.status(400).json({message: "Unable to retrieve data."});
      } else {
        res.status(200).json(post);
      }
    });
  } catch(error) {
    res.status(400).json({message: "Unable to retrieve user."});
  }
}