const express = require('express')
const router = express.Router()
const path = require('path')
const Server = require(path.join(__dirname, '../../../models/server'))

router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) { return res.status(500).json({error: 'not authorized'}) }
  Server.find({ github_id: req.user.github_id }, '-_id -__v -github_id', function (err, docs) {
    if (err) throw err
    res.json(docs)
  })
})

module.exports = router
