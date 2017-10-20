const express = require('express')
const router = express.Router()
const path = require('path')
const Server = require(path.join(__dirname, '../../models/server'))

router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) { return res.status(500).json({error: 'not authorized'}) }
  Server.find({ github_id: req.user.github_id }, '-_id -__v -github_id', function (err, docs) {
    if (err) throw err
    res.json(docs)
  })
})

router.post('/', function (req, res, next) {
  var server = new Server({
    github_id: req.user.github_id,
    url: req.body.url,
    check_interval: 5,
    check_status: 'unknown',
    check_time: null,
    check_message: null,
    created_at: Date.now(),
    updated_at: Date.now()
  })

  var query = { github_id: req.user.github_id, url: req.body.url }
  Server.findOneAndUpdate(query, server, { upsert: true }, function (err, server) {
    if (err) return console.log(err)
    res.json(server)
  })
})

module.exports = router
