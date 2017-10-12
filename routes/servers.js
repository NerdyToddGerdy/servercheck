const express = require('express')
const router = express.Router()
const assert = require('assert')

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.DB_URL, function (err, db) {
  assert.equal(null, err)
  console.log('Connected successfully to server')
  db.close()
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', { title: 'servercheck.io' })
})

module.exports = router
