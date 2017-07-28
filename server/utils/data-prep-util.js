'use strict'

var workOrders = require('../config/workorders.json')
var predictiveOptions = require('../config/predictive_options.json')
var docs = []

for (var wo of workOrders.docs) {
  var predictionData = getRandomValues()
  wo.predictionData = predictionData
  wo.equipmentSerial = predictionData[0]
  docs.push(wo)
}
console.log(JSON.stringify(docs))

function getRandomValues () {
  var data = []
  for (var key in predictiveOptions) {
    var idx = getRandomIndex(predictiveOptions[key])
    if (!predictiveOptions[key][idx]) {
      console.log(key + ' ' + idx)
    }
    data.push(predictiveOptions[key][idx])
  }
  return data
}

function getRandomIndex (someArray) {
  var idx = Math.floor(Math.random() * someArray.length) + 1
  return idx - 1
}
