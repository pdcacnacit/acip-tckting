'use strict'

var request = require('request')

module.exports = function (Prediction) {
  Prediction.predict = function (data, cb) {
    try {
      var options = {
        url: process.env.PREDICTION_URL + '/' + process.env.PREDICTION_CONTEXTID + '?accesskey=' + process.env.PREDICTION_APIKEY,
        method: 'POST',
        json: true,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          tablename: process.env.PREDICTION_TABLENAME,
          header: JSON.parse(process.env.PREDICTION_HEADERS),
          data: [data]
        },
        auth: {
          user: process.env.PREDICTION_USERNAME,
          password: process.env.PREDICTION_PASSWORD
        }
      }

      request(options, function (err, response, body) {
        try {
          if (err) {
            cb(err)
          } else {
            if (response.statusCode !== 200) {
              cb('HTTP Error code returned from Watson ML Service is ' + response.statusCode)
            } else {
              cb(null, body)
            }
          }
        } catch (err) {
          console.log(err)
          cb(err)
        }
      })
    } catch (err) {
      console.log(err)
      cb(err)
    }
  }
}
