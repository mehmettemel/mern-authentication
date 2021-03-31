const express = require('express')
const router = express.Router()

const { read, update } = require('../controllers/user')
const { requireSignin, adminMiddleware } = require('../controllers/auth')

router.get('/user/:id', requireSignin, read)
// (req,res,next) with next we can next to update middleware after requiresSignIn
router.put('/user/update', requireSignin, update)
router.put('/admin/update', requireSignin, adminMiddleware, update)

module.exports = router
