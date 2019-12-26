import { User } from './user.model'
import * as jwt from "jsonwebtoken";

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const likeUser = async (req, res) => {
  try {
    const currentUser = jwt.decode(req.headers.authorization.split('Bearer ')[1]);
    const user = await User.findOneAndUpdate({
          _id: req.params.id,
          likesFromUsers:  { "$ne": currentUser.id }
        },
        {
          likesFromUsers: currentUser.id
        }, { new: true })
        .select('-password')
        .lean()
        .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const unlikeUser = async (req, res) => {
  try {
    const currentUser = jwt.decode(req.headers.authorization.split('Bearer ')[1]);
    const user = await User.findByIdAndUpdate(req.params.id,
        {
          $pull: { likesFromUsers: currentUser.id }
        }, { new: true })
        .select('-password')
        .lean()
        .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const listTopUsers = async (req, res) => {
  try {
    const users = await User
        .find({}).sort({ 'likesFromUsers': -1 })
        .select('-password')
        .lean()
        .exec()

    res.status(200).json({ data: users })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
