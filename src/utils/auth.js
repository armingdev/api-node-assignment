import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = async token =>{
  const payload = await jwt.verify(token, config.secrets.jwt);
  return payload;
}

// Signup function
export const signup = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ message: 'Username and Password are required' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}

// Login function
export const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ message: 'Username and Password are required' })
  }

  const user = await User.findOne({ username: req.body.username })

  if (!user) {
    return res.status(401).send({ message: 'Not auth' })
  }

  try {
    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'Not auth' })
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(400).send({ message: 'Not auth' })
  }
}

// Authorization middleware
export const protect = async (req, res, next) => {

  try {
    if (!req.headers.authorization) {
      throw new Error(`Unauthorized`)
    }
    const token = req.headers.authorization.split('Bearer ')[1]

    if (!token) {
      throw new Error(`Unauthorized`)
    }

    const payload = await verifyToken(token)
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    return res.status(401).send({message: `Unauthorized`})
  }
}
