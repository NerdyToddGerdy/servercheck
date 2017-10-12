const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', passport.authenticate('github', { failureRedirect: '/' }), function (req, res) {
  res.redirect('/servers')
})

module.exports = router
