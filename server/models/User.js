const mongoose = require('mongoose')
//for security we use crypto.it hashes the password
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //for white spaces
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String, //salt for determine strong of  the hashing password
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timestamps: true } //it automatic added after all action
)

//get virtual password and set and then get
userSchema
  .virtual('password')
  .set(function (password) {
    // create a temporarity variable called _password
    this._password = password
    // generate salt
    this.salt = this.makeSalt()
    // encryptPassword
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  //authenticate is success method
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  },
}

module.exports = mongoose.model('User', userSchema)
