const mongoose = require('mongoose')
const rp = require('request-promise-native')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

mongoose.connect(process.env.DB_URL, { useMongoClient: true })
mongoose.Promise = global.Promise
mongoose.set('debug', true)

var Server = require('./models/server')

const stream = Server.find().cursor()
stream.eachAsync(doc => {
  return new Promise((resolve, reject) => {
    rp({uri: doc.url, simple: false, resolveWithFullResponse: true})
    .then(function (res) {
      doc.last_check.response_code = res && res.statusCode
      doc.last_check.time = Date.now()
      doc.save().then(() => {
        resolve()
      })
    })
    .catch(function (err) {
      doc.last_check.message = err
      // doc.last_check.response_code = res && res.statusCode
      doc.last_check.time = Date.now()
      doc.save().then(() => {
        resolve()
      })
    })
  })
})
.then(() => {
  mongoose.disconnect()
  return Promise.resolve()
})
.catch(function (err) {
  if (err) console.log(err)
})
