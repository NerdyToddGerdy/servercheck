var Alerts = function () {}

Alerts.prototype.email = function (data) {
  var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN})
  mailgun.messages().send(data, function (err, body) {
    if (err) return console.log(err)
  })
}

module.exports = new Alerts()
