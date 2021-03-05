import dbConnect from '../../../utils/dbConnect'
import User from '../../../models/User'

export default async function handler(req, res) {

  await dbConnect();

  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch(error) {
    res.status(400).json({message: "Unable to retrieve data."});
  }
}