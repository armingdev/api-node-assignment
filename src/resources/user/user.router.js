import { Router } from 'express'
import {likeUser, me, unlikeUser, updateMe} from './user.controllers'
import {protect} from "../../utils/auth";

const router = Router()

router.get('/me', me)
router.put('/me/update-password', updateMe)
router.patch('/:id/like', likeUser)
router.patch('/:id/unlike', unlikeUser)

export default router
