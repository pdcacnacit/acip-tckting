'use strict'

var Cloudant = require('cloudant')
var Async = require('async')
var app = require('../../server/server')

var workOrderTemplate = require('../../server/config/workOrderTemplate.json')
var similaritiesTemplate = require('../../server/config/similaritiesTemplate.json')

module.exports = function (Workorder) {
  Workorder.getServiceHistory = function (keys, cb) {
    var dbUrl = Workorder.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var workOrdersDB = cloudant.db.use(process.env.WORKORDERS_DB)

    workOrdersDB.fetch({ 'keys': keys }, function (err, result) {
      if (!err) {
        let response = []
        for (var row of result.rows) {
          response.push(row.doc)
        }
        cb(null, response)
      } else {
        cb(err)
      }
    })
  }

  Workorder.getWorkOrderById = function (id, cb) {
    var Prediction = app.models.prediction
    Workorder.findById(id, function (err, workOrder) {
      if (err) {
        console.log(err)
        cb(err)
      } else {
        // call the prediction service to get the predicted component that will fail.
        var predictionData = workOrder.predictionData
        Prediction.predict(predictionData, function (err, prediction) {
          if (!err) {
            workOrder.prediction = prediction
            cb(null, workOrder)
          } else {
            console.log(err)
            cb(err)
          }
        })
      }
    })
  }

  Workorder.getWorkOrderIdList = function (cb) {
    var dbUrl = Workorder.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var workOrdersDB = cloudant.db.use(process.env.WORKORDERS_DB)

    workOrdersDB.view('workOrdersDesign', 'workorder-view', function (err, result) {
      if (err) {
        cb(err)
      } else {
        cb(null, result)
      }
    })
  }

  Workorder.getComponentCodePrediction = function (id, cb) {
    Workorder.findById(id, function (err, workOrder) {
      if (err) {
        cb(err)
      } else {
        var predictionData = workOrder.predictionData
        var Prediction = app.models.prediction
        Prediction.predict(predictionData, function (err, prediction) {
          if (err) {
            cb(err)
          } else {
            cb(null, prediction)
          }
        })
      }
    })
  }

  Workorder.completeWorkorder = function (workOrderId, cb) {
    if (workOrderId !== '10000001') {
      cb({ 'error': 'Only a Work Order that was created from IoT data can be completed' })
      return
    }
    var similarity = app.models.similarity
    Workorder.destroyById(workOrderId, function (err) {
      if (err) {
        console.log(err)
        cb(err)
      } else {
        console.log('Temporary Work Order successfully deleted')
        similarity.destroyById(workOrderId, function (err) {
          if (err) {
            console.log(err)
            cb(err)
          } else {
            console.log('Temporary Similarity successfully deleted')
            cb()
          }
        })
      }
    })
  }

  Workorder.createWorkOrderFromTemplate = function (serialNr, cb) {
    var similarity = app.models.similarity
    var monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dece'
    ]
    similarity.create(similaritiesTemplate, function (err, result) {
      if (err) {
        console.log(err)
        cb(err)
      } else {
        console.log('Similarities Template Create Successfully...')
        var now = new Date()
        workOrderTemplate.dateString = monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear()
        workOrderTemplate.createdTimeStamp = now
        workOrderTemplate.equipmentSerial = serialNr
        Workorder.create(workOrderTemplate, function (err, result) {
          if (err) {
            console.log(err)
            cb(err)
          } else {
            console.log('Workorder successully created')
            // Delete this order after an hour
            console.log('Timer to delete work order is started...')
            setTimeout(function () {
              Workorder.destroyById(workOrderTemplate.workOrderId, function (err) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('Temporary Work Order successfully deleted')
                  similarity.destroyById(similaritiesTemplate.workOrderId, function (err) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log('Temporary Similarity successfully deleted')
                    }
                  })
                }
              })
            }, 3600000)
            cb(null, 'Workorder successfully create.')
          }
        })
      }
    })
  }

  Workorder.getWordordersListAudited = function (cb) {
    Workorder.find(function (err, result) {
      if (err) {
        cb(err)
      } else {
        var response = []
        var queue = Async.queue(auditWorkOrderConnections, 1)
        // assign a callback
        queue.drain = function () {
          cb(null, response)
        }
        for (var wo of result) {
          queue.push(wo, function (err, audited) {
            if (err) {
              console.log(err)
            } else {
              console.log(new Date() + ' ' + wo.id)
              response.push(audited)
            }
          })
        }
      }
    })
  }

  function auditWorkOrderConnections (workOrder, cb) {
    var results = []
    setTimeout(function () {
      checkCustomer(workOrder.customerName, function (result) {
        results.push(result)
        if (workOrder.isClosed) {
          setTimeout(function () {
            checkSolution(workOrder.solutionAnswerId, function (result) {
              results.push(result)
              workOrder.audit = results
              cb(null, workOrder)
            })
          }, 500)
        } else {
          workOrder.audit = results
          cb(null, workOrder)
        }
      })
    }, 500)
  }

  function checkCustomer (customerName, cb) {
    var Customer = app.models.Customer
    Customer.findById(customerName, function (err, customer) {
      if (err) {
        var issue = {
          'type': 'customer',
          'outcome': 'error',
          'message': 'Customer ' + customerName + ' not found.',
          'reason': err
        }
        cb(issue)
      } else {
        setTimeout(function () {
          checkServiceHistory(customer.serviceHistory, function (results) {
            var success = {
              'type': 'customer',
              'outcome': 'success',
              'serviceHistory': results
            }
            cb(success)
          })
        }, 500)
      }
    })
  }

  function checkSolution (answerUnitId, cb) {
    var AnswerUnit = app.models.Answerunit
    AnswerUnit.findById(answerUnitId, function (err, answerUnit) {
      if (err) {
        var issue = {
          'type': 'solution',
          'outcome': 'error',
          'message': 'Solution does not reference a valid Answer Unit',
          'reason': err
        }
        cb(issue)
      } else {
        var success = {
          'type': 'solution',
          'outcome': 'success',
          'answerUnitId': answerUnitId
        }
        cb(success)
      }
    })
  }

  function checkServiceHistory (workOrderIds, cb) {
    var results = []
    var Workorder = app.models.Workorder
    for (var id of workOrderIds) {
      Workorder.findById(id, function (err, workOrder) {
        if (err) {
          var issue = {
            'type': 'history',
            'outcome': 'error',
            'message': 'Service history work order ' + id + ' does not exist',
            'reason': err
          }
          results.push(issue)
        } else {
          var success = {
            'type': 'history',
            'outcome': 'success',
            'serviceHistoryId': id
          }
          results.push(success)
        }
        if (results.length >= workOrderIds.length) {
          cb(results)
        }
      })
    }
  }
}
