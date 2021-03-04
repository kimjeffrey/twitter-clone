import {users} from '../../../data'

export default function handler(req, res) {
  const filtered = users.filter(user => user.id === req.query.id);

  if(filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({message: `User ${req.query.id} was not found.`})
  }
}