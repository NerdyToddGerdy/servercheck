const request = require('request')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, { useMongoClient: true })
mongoose.set('debug', true)

var Server = require('./models/server')

// Doesn't work
Server.find(function (err, items) {
  if (err) return console.log(err)
  items.forEach(function (item) {
    var query = {url: item.url}
    Server.findOneAndUpdate(query, {updated_at: Date.now()}, function (err, doc) {
      if (err) return console.log(err)
      console.log(doc)
    })
  })
})

// Works!
var query = {url: 'https://google.com'}
Server.findOneAndUpdate(query, {updated_at: Date.now()}, function (err, doc) {
  if (err) return console.log(err)
  console.log(doc)
})

mongoose.connection.close()
