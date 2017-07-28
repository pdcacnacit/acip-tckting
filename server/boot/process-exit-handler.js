'use strict'

var IoTEventListener = require('../utils/iot-event-listener')

process.stdin.resume()

function exitHandler (options, err) {
  if (options.cleanup) {
    console.log('Clean')
    IoTEventListener.disconnect()
  }
  if (err) console.log(err.stack)

  if (options.exit) process.exit()
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }))

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }))

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
