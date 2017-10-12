const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', passport.authenticate('github', { scope: [ 'user:email' ] }), function (req, res) {
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
})

module.exports = router
