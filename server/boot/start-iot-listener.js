'use strict'

var IoTEventListener = require('../utils/iot-event-listener')

module.exports = function (app, cb) {
  console.log('Checking for an existing temporary work order')
  checkForTemporaryWorkOrder(function () {
    console.log('Initializing the IoT Event Listener...')
    IoTEventListener.listen()
    cb()
  })

  function checkForTemporaryWorkOrder (cb) {
    var Workorder = app.models.workorder
    var Similarity = app.models.similarity
    Workorder.findById('10000001', function (err, workOrder) {
      try {
        if (err) {
          console.log('Error checking temporary work order: ' + err)
        } else {
          if (workOrder) {
            console.log('Found an existing temporary work order.')
            var created = new Date(workOrder.createdTimeStamp)
            var now = new Date()
            var age = Math.round((now - created) / (1000 * 60))
            var expiry = (60 - age) * (1000 * 60)
            console.log('Work order is ' + age + ' minutes old, setting expiry to ' + expiry)
            setTimeout(function () {
              Workorder.destroyById(workOrder.workOrderId, function (err) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('Temporary Work Order successfully deleted')
                  Similarity.destroyById(workOrder.workOrderId, function (err) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log('Temporary Similarity successfully deleted')
                    }
                  })
                }
              })
            }, expiry)
          } else {
            console.log('No Existing work order found')
          }
        }
      } catch (err) {
        console.log(err)
      }
      cb()
    })
  }
}
