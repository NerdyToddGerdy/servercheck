var express = require('express')
var router = express.Router()
var auth = require('../libs/auth')
var Server = require('../models/server')

router.get('/', auth.isLoggedIn, function (req, res, next) {
  res.render('servers', { user: req.user, isLoggedIn: true })
})

router.post('/', auth.isLoggedIn, function (req, res, next) {
  console.log(req.body)
  var server = new Server({
    github_id: req.user.github_id,
    url: req.body.url,
    check_interval: 5,
    last_check: {
      response_code: null,
      message: null,
      time: null
    },
    created_at: Date.now(),
    updated_at: Date.now()
  })

  server.save(function (err) {
    if (err) console.log(err)
    res.redirect('/servers')
  })
})

module.exports = router
