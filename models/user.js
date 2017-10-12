// grab the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var userSchema = new Schema({
  github_id: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  plan: String,
  mobile: String,
  provider: String,
  slackApiKey: String,
  slackChannel: String,
  created_at: Date,
  updated_at: Date
})

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema)

// make this available to our users in our Node applications
module.exports = User
