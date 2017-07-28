'use strict'

var fs = require('fs')
var es = require('event-stream')
var IBMIoTF = require('ibmiotf')

var app = require('../../server/server')

// The CSV file that contains the events to emit.
const EVENT_FILE = './dist/server/config/demo-events-dataset-small.csv'
// Watson IOT Platform config
var iotClientConfig = {
  'org': process.env.IOT_ORG,
  'id': process.env.IOT_ID,
  'auth-key': process.env.IOT_SENDER_KEY,
  'auth-token': process.env.IOT_SENDER_TOKEN,
  'type': 'shared'
}
// Create an IoT Client
var iotClient = new IBMIoTF.IotfApplication(iotClientConfig)

var lineNr = 0
var headers = []

process.env.EVENT_EMITTER_RUNNING = 'false'

module.exports = function (Iotevent) {
  Iotevent.startIoTEventEmitter = function (cb) {
    // Check if another emitter is already running....
    if (process.env.EVENT_EMITTER_RUNNING === 'true') {
      var err = {
        'type': 'danger',
        'state': 'running',
        'msg': 'An Event Emitter is currently running, only one emitter is allowed at one time.'
      }
      cb(err)
      return
    }
    process.env.EVENT_EMITTER_RUNNING = 'true'
    // Connect to the IoT Platform
    iotClient.connect()

    iotClient.on('connect', function () {
      // Return to the caller
      var response = {
        'type': 'success',
        'state': 'stopped',
        'msg': 'Event Emitter was successfully connected to Watson IoT Platform. Event publishing will start shortly.'
      }
      cb(null, response)
    })

    // Process the event file
    var s = fs.createReadStream(EVENT_FILE)
      .pipe(es.split())
      .pipe(es.mapSync(function (line) {
        var result = processCsvRow(line)
        if (result && result.eventJson && result.eventJson.EquipmentNumber_FK) {
          s.pause()
          setTimeout(function () {
            publishEvent(result.eventJson)
            s.resume()
          }, result.waitFor)
        }
        lineNr += 1
      })
      .on('error', function () {
        console.log('Error while reading file.')
        process.env.EVENT_EMITTER_RUNNING = 'false'
      })
      .on('end', function () {
        console.log('Read entire file of ' + lineNr + ' lines')
        process.env.EVENT_EMITTER_RUNNING = 'false'
      })
    )
  }
  // Function to check what the status of the Event Emitter is
  Iotevent.statusOfIoTEventEmitter = function (cb) {
    var status = {}
    if (process.env.EVENT_EMITTER_RUNNING === 'false') {
      var Workorder = app.models.workorder
      Workorder.findById('10000001', function (err, workOrder) {
        if (err) {
          console.log('Error search for existing temporary work order: ' + err)
          status = {
            'type': 'warning',
            'state': 'stopped',
            'msg': 'Error search for existing temporary work order: ' + err
          }
          cb(null, status)
        } else {
          if (workOrder) {
            var created = new Date(workOrder.createdTimeStamp)
            var now = new Date()
            var age = Math.round((now - created) / (1000 * 60))
            var expiry = (60 - age)
            status = {
              'type': 'success',
              'state': 'stopped',
              'msg': 'A work order based on device data was created.  The work order will expires in ' + expiry + ' minutes.'
            }
            cb(null, status)
          } else {
            status = {
              'type': 'warning',
              'state': 'stopped',
              'msg': 'Event Emitter is not currently running.'
            }
            cb(null, status)
          }
        }
      })
    } else {
      var completed = Math.round((lineNr / 825) * 100)
      status = {
        'type': 'success',
        'state': 'running',
        'msg': 'Event Emitted is currently busy. ' + completed + '% of events published.'
      }
      cb(null, status)
    }
  }
  // Publish an event to the Mqtt Broken on Watson IoT Platform.
  function publishEvent (event) {
    var eventStr = JSON.stringify(event)
    try {
      iotClient.publishDeviceEvent('Kone-Elevator', event.EquipmentNumber_FK, event.MessageType_FK, 'json', eventStr)
    } catch (err) {
      console.log('Error publishing event: ' + err)
    }
  }
  // Function to take a row in the CSV file and create a Json Document
  function processCsvRow (line) {
    var cleaned = line.replace(/"/g, '')
    var split = cleaned.split(',')
    // Process the header row
    if (lineNr === 0) {
      headers = split
      return
    }
    // Process the non-header rows
    if (lineNr > 0) {
      var waitFor = Math.floor((Math.random() * 100) + 100)
      var eventJson = createJsonObject(headers, split)
      var result = {
        waitFor: waitFor,
        eventJson: eventJson
      }
      return result
    }
  }
  // Utility function to create a json object from an array of values.
  function createJsonObject (headers, data) {
    var jsonObj = {}
    for (var i = 0; i < headers.length; i++) {
      if (i < data.length) {
        jsonObj[headers[i]] = data[i]
      }
    }
    return jsonObj
  }
}
