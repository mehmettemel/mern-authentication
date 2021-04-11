const express = require('express')
const {
  signup,
  signup2,
  accountActivation,
  signin,
  resetPassword,
  forgotPassword,
  googleLogin,
} = require('../controllers/auth')
const { runValidation } = require('../validators')
const {
  userSignupValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth')

const router = express.Router()

router.post('/signup', userSignupValidator, runValidation, signup2)
router.post('/signin', userSignInValidator, runValidation, signin)
router.post('/account-activation', accountActivation)

//Forgot password and reset
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
)
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
)

//google and facebook
router.post('/google-login', googleLogin)

module.exports = router
