'use strict'
var Cloudant = require('cloudant')

module.exports = function (Similarity) {
  var app = require('../../server/server')

  Similarity.getSimilarWorkOrders = function (id, cb) {
    var dbUrl = app.models.Workorder.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var workOrdersDB = cloudant.db.use(process.env.WORKORDERS_DB)

    Similarity.findById(id, function (err, similarities) {
      if (err) {
        cb(err)
      } else {
        if (similarities) {
          var response = {
            similarities: {},
            attachedWorkOrders: []
          }
          for (var sim of similarities.similarityList) {
            response.similarities[sim.workOrderId] = sim
          }
          let keys = similarities.workOrderIdList
          workOrdersDB.fetch({ 'keys': keys }, function (err, result) {
            if (!err) {
              for (var workOrder of result.rows) {
                response.attachedWorkOrders.push(workOrder.doc)
              }
              cb(null, response)
            } else {
              cb(err)
            }
          }) // fetch
        } else {
          let empty = {
            attachedWorkOrders: []
          }
          cb(null, empty)
        }
      }
    })
  }
}
