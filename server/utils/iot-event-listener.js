'use strict'

var IoTClient = require('ibmiotf')
var request = require('request')
var app = require('../server')

var iotClientConfig = {
  'org': process.env.IOT_ORG,
  'id': process.env.IOT_ID,
  'auth-key': process.env.IOT_LISTENER_KEY,
  'auth-token': process.env.IOT_LISTENER_TOKEN,
  'type': 'shared'
}

var iotClient = process.env.IOT_CLIENT_INSTANCE
if (!iotClient) {
  iotClient = new IoTClient.IotfApplication(iotClientConfig)
  process.env.IOT_CLIENT_INSTANCE = iotClient
}

var equipmentCounters = {}

var IoTEventListener = function () {}

const THRESHOLD = 65 // Percentage threshold when to create a new service order.

IoTEventListener.prototype.disconnect = function () {
  console.log('Disconnecting from IoT Platform...')
  iotClient.disconnect()
  console.log('Done Disconnecting...')
}

IoTEventListener.prototype.listen = function () {
  try {
    var currentDeviceId

    iotClient.connect()

    iotClient.on('connect', function () {
      try {
        iotClient.subscribeToDeviceEvents()
        setTimeout(receiveEvents, 1000)
      } catch (err) {
        console.log(err)
      }
    })

    var receiveEvents = function () {
      console.log('Listening for events...')
      iotClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
        // If the device id changes, send the counters to the predictive model to decide if a new SO should be created.
        if (currentDeviceId && currentDeviceId !== deviceId) {
          console.log('Calling the Predictive Model to determine if an order should be created...')
          var data = jsonToCsv(getCounterObject(currentDeviceId))
          predict(data, function (err, prediction) {
            if (err) {
              console.log('Error calling predictive model: ' + err)
            } else {
              if (prediction.length > 0 && prediction[0].data && prediction[0].data.length > 0) {
                var predictedCertainty = prediction[0].data[0][prediction[0].data[0].length - 1]
                if (predictedCertainty) {
                  var percentage = Math.round(predictedCertainty * 100)
                  if (percentage > THRESHOLD) {
                    console.log('Prediction Certainty of ' + percentage + 'percent. A new service order will be created.')
                    var serialNr = prediction[0].data[0][0]
                    var Workorder = app.models.Workorder
                    Workorder.createWorkOrderFromTemplate(serialNr, function (err) {
                      if (err) {
                        console.log('Error creating work order from prediction')
                      } else {
                        console.log('Workorder from prediction successully created')
                      }
                    })
                  } else {
                    console.log('Prediction Certainty of ' + percentage + ' is below threshold of ' + THRESHOLD)
                  }
                }
              } else {
                console.log('No prediction returned.')
              }
            }
          })
        }
        currentDeviceId = deviceId
        if (deviceId !== '99999999') {
          var counterJson = getCounterObject(deviceId)
          counterJson[eventType + 'Cnt']++
          equipmentCounters[deviceId] = counterJson
        }
      })
    }
  } catch (err) {
    console.log('IoT Event Listener exited with the following error: ' + err)
  }
}

function predict (data, cb) {
  try {
    var options = {
      url: process.env.PREDICTION_URL + '/' + process.env.SO_PREDICTION_CONTEXT_ID + '?accesskey=' + process.env.PREDICTION_APIKEY,
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        tablename: process.env.SO_PREDICTION_TABLE,
        header: data[0],
        data: [data[1]]
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

function jsonToCsv (jsonDoc) {
  var csvBuffer = []
  // Get the headers and the field count
  var headers = getCsvHeader(jsonDoc)
  csvBuffer.push(headers)

  var lineBuffer = []
  for (var jsonField in jsonDoc) {
    var supported = typeof jsonDoc[jsonField] !== 'object'
    if (supported) {
      lineBuffer.push(jsonDoc[jsonField])
    }
  }
  csvBuffer.push(lineBuffer)
  return csvBuffer
}

function getCsvHeader (jsonDoc) {
  var header = []
  for (var jsonField in jsonDoc) {
    var supported = typeof jsonDoc[jsonField] !== 'object'
    if (supported) {
      header.push(jsonField)
    }
  }
  return header
}

function getCounterObject (equipmentNr) {
  if (equipmentCounters[equipmentNr]) {
    return equipmentCounters[equipmentNr]
  } else {
    return {
      'EquipmentNumber': equipmentNr,
      '100Cnt': 0,
      '1029Cnt': 0,
      '1031Cnt': 0,
      '1607Cnt': 0,
      '16644Cnt': 0,
      '16648Cnt': 0,
      '1702Cnt': 0,
      '1706Cnt': 0,
      '1712Cnt': 0,
      '1713Cnt': 0,
      '17921Cnt': 0,
      '17923Cnt': 0,
      '17924Cnt': 0,
      '2008Cnt': 0,
      '3020Cnt': 0,
      '3053Cnt': 0,
      '3076Cnt': 0,
      '4001Cnt': 0,
      '4009Cnt': 0,
      '4013Cnt': 0,
      '4018Cnt': 0,
      '4034Cnt': 0,
      '4035Cnt': 0,
      '4036Cnt': 0,
      '4037Cnt': 0,
      '61187Cnt': 0,
      '61190Cnt': 0,
      '61199Cnt': 0,
      '61201Cnt': 0,
      '61202Cnt': 0,
      '61203Cnt': 0,
      '61208Cnt': 0,
      '61209Cnt': 0,
      '61210Cnt': 0,
      '61211Cnt': 0,
      '17672Cnt': 0
    }
  }
}

module.exports = new IoTEventListener()
