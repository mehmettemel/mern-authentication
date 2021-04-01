const { check } = require('express-validator')

exports.userSignupValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least six characters'),
]

exports.userSignInValidator = [
  check('email').isEmail().withMessage('must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least six characters'),
]

exports.forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address'),
]
exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least six characters'),
]
