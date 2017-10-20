// grab the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// create a schema
var serverSchema = new Schema({
  github_id: { type: String, required: true },
  url: { type: String, required: true },
  check_interval: Number,
  check_status: String,
  check_time: Date,
  check_message: String,
  created_at: Date,
  updated_at: Date
})

// https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
// the schema is useless so far
// we need to create a model using it
var Server = mongoose.model('Server', serverSchema)

// make this available to our users in our Node applications
module.exports = Server
