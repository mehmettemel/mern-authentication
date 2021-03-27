const mongoose = require('mongoose')

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
  } catch (err) {
    process.exit(1)
  }
}
