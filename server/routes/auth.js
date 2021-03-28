const express = require('express')
const { signup, signup2, accountActivation } = require('../controllers/auth')
const { runValidation } = require('../validators')
const {
  userSignupValidator,
  userSignInValidator,
} = require('../validators/auth')
const router = express.Router()

router.post('/signup', userSignupValidator, runValidation, signup2)
router.post('/signin', userSignInValidator, runValidation, signin)
router.post('/account-activation', accountActivation)

module.exports = router
