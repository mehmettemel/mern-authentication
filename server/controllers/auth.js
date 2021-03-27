const User = require('../models/User')

//MONGO DB ADDED METHOD
exports.signup = (req, res) => {
  const { name, email, password } = req.body

  //if the email is used once we are sending response
  User.findOne({ email: email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken',
      })
    }
  })

  let newUser = new User({ name, email, password })

  newUser.save((err, success) => {
    if (err) {
      console.log('signup error', err)
      return res.status(400).json({
        error: err,
      })
    }
    res.json({
      message: 'Signup success! Please sign in',
    })
  })
}

exports.signup2 = (req, res) => {
  
}
