const { sendEmailWithNodemailer } = require('../helpers/email')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')

//MONGO DB ADDED METHOD
// exports.signup = (req, res) => {
//   const { name, email, password } = req.body

//   //if the email is used once we are sending response
//   User.findOne({ email: email }).exec((err, user) => {
//     if (user) {
//       return res.status(400).json({
//         error: 'Email is taken',
//       })
//     }
//   })

//   let newUser = new User({ name, email, password })

//   newUser.save((err, success) => {
//     if (err) {
//       console.log('signup error', err)
//       return res.status(400).json({
//         error: err,
//       })
//     }
//     res.json({
//       message: 'Signup success! Please sign in',
//     })
//   })
// }

exports.signup2 = (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      })
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    )

    const emailData = {
      from: process.env.EMAIL, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: 'ACCOUNT ACTIVATION LINK',
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>http://localhost:3000/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>http://localhost:3000</p>
            `,
    }

    sendEmailWithNodemailer(req, res, emailData)
  })
}

exports.accountActivation = (req, res) => {
  const { token } = req.body

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log('JWT VERIFY ACTIVATION ERROR', err)
          return res.status(401).json({
            error: 'Expired link.Sign up again',
          })
        }
        const { name, email, password } = jwt.decode(token)

        const user = new User({ name, email, password })
        user.save((err, user) => {
          if (err) {
            console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
            return res.status(401).json({
              error: 'Error saving user in database.Try signup again',
            })
          }
          return res.json({
            message: 'Signup success.Please sign in',
          })
        })
      }
    )
  } else {
    return res.json({
      message: 'Something went wrong.Please try again',
    })
  }
}

exports.signin = (req, res) => {
  const { email, password } = req.body

  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist.Please sign up',
      })
    }

    //authenticate(it comes from user schema methods)
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match',
      })
    }

    //generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
    const { _id, name, email, role } = user
    return res.json({
      token,
      user: { _id, name, email, role },
    })
  })
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      })
    }
    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource access denied',
      })
    }
    req.profile = user
    next()
  })
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist',
      })
    }

    //we defined our secret name and id . then we use it in client
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: '10m',
      }
    )

    const emailData = {
      from: process.env.EMAIL, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: 'Password Reset Link',
      html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    }

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: 'Database connection error on user forgot request ',
        })
      } else {
        sendEmailWithNodemailer(req, res, emailData)
      }
    })
  })
}
exports.resetPassword = (req, res) => {
  const { resetPasswordLink } = req.body
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: 'Expired link.Try again',
          })
        }
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Something went wrong.Try later',
            })
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          }
          //with this we are extending user with updatedFields
          user = _.extend(user, updatedFields)

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Error resetting user password',
              })
            }
            res.json({
              message: 'Great!Now you can login with your new password',
            })
          })
        })
      }
    )
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
  const { idToken } = req.body

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            })
            const { _id, email, name, role } = user
            return res.json({
              token,
              user: { _id, email, name, role },
            })
          } else {
            let password = email + process.env.JWT_SECRET
            user = new User({ name, email, password })
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err)
                return res.status(400).json({
                  error: 'User signup failed with google',
                })
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              )
              const { _id, email, name, role } = data
              return res.json({
                token,
                user: { _id, email, name, role },
              })
            })
          }
        })
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again',
        })
      }
    })
}

exports.facebookLogin = (req, res) => {
  console.log('facebook login request body', res.body)
  const { userID, accessToken } = req.body

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`

  return fetch(url, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
          })
          const { _id, email, name, role } = user
          return res.json({
            token,
            user: { _id, email, name, role },
          })
        } else {
          let password = email + process.env.JWT_SECRET
          user = new User({ name, email, password })
          user.save((err, data) => {
            if (err) {
              console.log('error facebook login on user save', err)
              return res.status(400).json({
                error: 'User signup failed with facebook',
              })
            }
            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            })
            const { _id, email, name, role } = data
            return res.json({
              token,
              user: { _id, email, name, role },
            })
          })
        }
      })
    })
    .catch((error) =>
      res.json({
        error: 'Facebook Login failed.Try Later',
      })
    )
}
