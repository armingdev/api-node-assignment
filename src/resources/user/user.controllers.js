import { User } from './user.model'

// Get logged user
export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

// Update user from request body
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

// Like user by id
export const likeUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findOneAndUpdate({
          _id: req.params.id,
          likesFromUsers:  { "$ne": currentUser._id }
        },
        {
          likesFromUsers: currentUser._id
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

// Unlike user by id
export const unlikeUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const user = await User.findByIdAndUpdate(req.params.id,
        {
          $pull: { likesFromUsers: currentUser._id }
        }, { new: true })
        .select('-password')
        .lean()
        .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).send({ message: e.message })
  }
}

// List most liked users
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
