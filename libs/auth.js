var Auth = function () {}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
Auth.prototype.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

Auth.prototype.filter = function (model, req, done) {
  model.find({github_id: req.user.github_id}, function (err, docs) {
    if (err) console.log(err)
    done(docs)
  })
}

module.exports = new Auth()
