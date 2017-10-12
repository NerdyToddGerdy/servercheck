const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

mongoose.connect(process.env.DB_URL, { useMongoClient: true })

// Get our models
var User = require('./models/user')

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.SITE_URL + '/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      var query = { github_id: profile.id }
      User.findOneAndUpdate(query, { github_id: profile.id, provider: 'github', updated_at: Date.now() }, { upsert: true }, function (err, currentUser) {
        if (err) return console.log(err)
        return done(null, currentUser)
      })
    })
  }
))

const app = express()
const hbs = exphbs.create({extname: '.hbs', defaultLayout: 'main'})

app.engine('.hbs', hbs.engine)

// configure Express
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
// Initialize Passport! Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

// App routes
var index = require('./routes/index')
app.use('/', index)

var servers = require('./routes/servers')
app.use('/servers', servers)

var settings = require('./routes/settings')
app.use('/settings', settings)

var authGithub = require('./routes/auth/github')
app.use('/auth/github', authGithub)

var authGithubCall = require('./routes/auth/github-callback')
app.use('/auth/github/callback', authGithubCall)

var logout = require('./routes/logout')
app.use('/logout', logout)

// API Routes
var serverApi = require('./routes/api/server')
app.use('/api/v1/server', serverApi)

var userApi = require('./routes/api/user')
app.use('/api/v1/user', userApi)

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
