const express = require('express')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const GitHubStrategy = require('passport-github2').Strategy
const path = require('path')
// const assert = require('assert')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

// const partials = require('express-partials')
// const util = require('util')
var auth = require('./libs/auth')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

mongoose.connect(process.env.DB_URL, { useMongoClient: true })

var User = require('./models/user')

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  // console.log(user)
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.SITE_URL + '/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      // console.log(profile.id)
      // return done(null, profile)
      var query = { github_id: profile.id }
      User.findOneAndUpdate(query, { github_id: profile.id, provider: 'github', updated_at: Date.now() }, { upsert: true }, function (err, currentUser) {
        if (err) return console.log(err)
        return done(null, currentUser)
      })
    })
  }
))

var app = express()
var hbs = exphbs.create({extname: '.hbs', defaultLayout: 'main'})

app.engine('.hbs', hbs.engine)

// configure Express
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
// app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
// Initialize Passport! Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('index', { user: req.user, isLoggedIn: false })
})

app.get('/account', auth.isLoggedIn, function (req, res) {
  res.render('account', { user: req.user, isLoggedIn: true })
})

app.get('/servers', auth.isLoggedIn, function (req, res) {
  res.render('servers', { user: req.user, isLoggedIn: true })
})

app.get('/settings', auth.isLoggedIn, function (req, res) {
  res.render('settings', { user: req.user, isLoggedIn: true })
})

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  })

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/servers')
  })

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
