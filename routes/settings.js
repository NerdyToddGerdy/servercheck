var express = require('express')
var router = express.Router()
var auth = require('../libs/auth')

/* GET home page. */
router.get('/', auth.isLoggedIn, function (req, res, next) {
  res.render('settings', { user: req.user, isLoggedIn: true })
})

module.exports = router
