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


/*
const request = require('request')
const mongoose = require('mongoose')
// const async = require('async')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, { useMongoClient: true })
mongoose.set('debug', true)


const Server = require('./models/server')

var arr = []

// doesn't work

Server.find(function (err, docs) {
  docs.forEach(function(item){
    arr.push({url: item.url, id: item.github_id})
  })
  arr.forEach(function(item){
    Server.update({url: item.url, github_id: item.github_id}, {check_interval: 10}, function (err, raw) {
      console.log(raw)
    })
  })
})

Server.update({url: '', github_id: ''}, {check_interval: 10}, function (err, raw) {
  console.log(raw)
})


// works
/*
let arrA = ['https://google.com', 'https://microsoft.com', 'https://this-is-total-fail.com']
let id = '2414647'
arrA.forEach(function(item){
  Server.update({url: item, github_id: id}, {check_interval: 10}, function (err, raw) {
    //console.log(raw)
  })
})

// works
/*
Server.update({url: 'https://google.com', github_id: '2414647'}, {check_interval: 10}, function (err, raw) {
  console.log(raw)
})
*/
//mongoose.connection.close()
