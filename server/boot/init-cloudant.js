/*
* IBM Confidential
* OCO Source Materials
* (C) Copyright IBM Corp. 2015, 2016
* The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
'use strict'

var Cloudant = require('cloudant')
var wslEnv = require('../utils/wsl-env')
var CloudantInitializer = require('../utils/cloudant-initializer')
var cloudantConfig = require('../config/cloudant-config.json')
// The following are the data files that needs to be loaded into the databases
var customersData = require('../config/customers.json')
var similaritiesData = require('../config/similarities.json')
var workordersData = require('../config/workorders.json')

var debug = require('debug')('loopback:init-cloudant')

module.exports = function (app, cb) {
  debug('Initializing Cloudant')
  var dataToLoad = {
    customers: customersData,
    similarities: similaritiesData,
    workorders: workordersData
  }
  // Get the credentials from the VCAP file sitting in the environment
  var re = new RegExp('Cloudant.*')
  var cloudantCredentials = wslEnv.getAppEnv().getService(re)['credentials']

  // Initialize Cloudant with my account.
  var cloudant = Cloudant({account: cloudantCredentials.username, password: cloudantCredentials.password})
  // Instanciate the Cloudant Initializer
  var cloudantInitializer = new CloudantInitializer(cloudant, cloudantConfig)

  cloudantInitializer.checkCloudant().then(function (checkResult) {
    var needSync = cloudantInitializer.needSync(checkResult)
    if (needSync) {
      cloudantInitializer.syncCloudantConfig(checkResult).then(function (createResult) {
        debug(createResult)
        console.log('*** Synchronization completed. ***')
        console.log('*** Application will be terminated.  Next time it starts up, all the data will be loaded. ***')
        process.exit()
      })
    } else {
      dataInitialization(checkResult, function (err) {
        if (err) {
          console.log(err)
          cb(err)
        } else {
          cb()
        }
      })
    }
  }, function (err) {
    console.log(err)
  })

  function dataInitialization (checkResult, cb) {
    console.log('*** In Data Initialization ***')
    var dataCollection = {}
    var dataCollectionCnt = 0
    for (let db of checkResult) {
      if (db.rows <= 1) {
        console.log('*** Data Will be loaded into DB ' + db.dbName)
        var data = dataToLoad[db.dbName]
        if (data) {
          dataCollection[db.dbName] = data
          dataCollectionCnt++
        }
      }
    }
    if (dataCollectionCnt > 0) {
      cloudantInitializer.syncData(dataCollection).then(function (dataLoadResult) {
        console.log('*** Data Load completed. ***')
        cb()
      }, function (err) {
        console.log(err)
        cb()
      })
    } else {
      console.log('*** Data Load Not Required. ***')
      cb()
    }
  }
}
