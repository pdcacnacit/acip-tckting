/*
* IBM Confidential
* OCO Source Materials
* (C) Copyright IBM Corp. 2015, 2016
* The source code for this program is not published or otherwise divested of its trade secrets, irrespective of what has been deposited with the U.S. Copyright Office.
*/
'use strict'

var debug = require('debug')('loopback:init-retrieverank')

var watson = require('watson-developer-cloud')
var Promise = require('promise')

var retrieveAndRankService = watson.retrieve_and_rank({
  username: process.env.RR_USERNAME,
  password: process.env.RR_PASSWORD,
  version: 'v1'
})

module.exports = function (app, cb) {
  debug('Initialize the Retrieve and Rank Service.')
  try {
    checkSolrCluster().then(function (result) {
      debug(result)
      if (result.createNew) {
        createSolrCluster().then(function (cluster) {
          debug(cluster)
          createConfig().then(function (result) {
            debug(result)
            createCollection().then(function (result) {
              debug(result)
              cb()
            })
          })
        })
      } else {
        checkConfig().then(function (result) {
          debug(result)
          if (result.createNew) {
            createConfig().then(function (result) {
              createCollection().then(function (result) {
                debug(result)
                cb()
              })
            })
          } else {
            checkCollection().then(function (result) {
              debug(result)
              if (result.createNew) {
                createCollection().then(function (result) {
                  debug(result)
                  cb()
                })
              } else {
                cb()
              }
            })
          }
        })
      }
    }, function (err) {
      console.log(err)
    })
  } catch (err) {
    console.log(err)
  }

  function checkSolrCluster () {
    return new Promise(function (resolve, reject) {
      debug('Checking Solr Cluster ' + process.env.RR_CLUSTERNAME)
      retrieveAndRankService.listClusters({}, function (err, clusters) {
        var status = 'NOT_AVAILABLE'
        if (err) {
          reject(err)
        } else {
          if (clusters.clusters.length > 0) {
            var createNew = true
            for (let cluster of clusters.clusters) {
              if (cluster.cluster_name === process.env.RR_CLUSTERNAME) {
                process.env.RR_CLUSTER_ID = cluster.solr_cluster_id
                status = cluster.solr_cluster_status
                createNew = false
              }
            }
            if (status === 'READY') {
              debug('Cluster is ready.')
              resolve({status: status, createNew: createNew})
            } else {
              pollCluster().then(function (status) {
                resolve({status: status, createNew: createNew})
              })
            }
          } else {
            resolve({status: status, createNew: true})
          }
        }
      })
    })
  }

  function checkConfig () {
    return new Promise(function (resolve, reject) {
      debug('Checking Solr Config.')
      retrieveAndRankService.listConfigs({
        cluster_id: process.env.RR_CLUSTER_ID
      }, function (err, configs) {
        if (err) {
          reject(err)
        } else {
          if (configs.solr_configs.length > 0) {
            var createNew = true
            for (let config of configs.solr_configs) {
              if (config === process.env.RR_CONFIGNAME) {
                createNew = false
              }
            }
            resolve({createNew: createNew})
          } else {
            resolve({createNew: true})
          }
        }
      })
    })
  }

  function checkCollection () {
    return new Promise(function (resolve, reject) {
      debug('Checking Collection ' + process.env.RR_COLLECTIONNAME)
      retrieveAndRankService.listCollections({ cluster_id: process.env.RR_CLUSTER_ID },
      function (err, collections) {
        if (err) {
          reject(err)
        } else {
          if (collections.collections.length > 0) {
            var createNew = true
            for (let collection of collections.collections) {
              if (collection === process.env.RR_COLLECTIONNAME) {
                createNew = false
              }
            }
            resolve({createNew: createNew})
          } else {
            resolve({createNew: true})
          }
        }
      })
    })
  }

  function createSolrCluster () {
    return new Promise(function (resolve, reject) {
      debug('Creating Solr Cluster ' + process.env.RR_CLUSTERNAME)
      retrieveAndRankService.createCluster({
        cluster_size: '1',
        cluster_name: process.env.RR_CLUSTERNAME
      }, function (err, result) {
        if (err) {
          reject(err)
        }
        process.env.RR_CLUSTER_ID = result.solr_cluster_id
        debug('Cluster ' + process.env.RR_CLUSTER_ID + ' was created.')
        pollCluster().then(function () {
          resolve()
        })
      })
    })
  }

  function pollCluster () {
    console.log('Waiting on R&R Cluster to become available.  System will poll every 10 seconds for 5 minutes or until cluster is ready.')

    var timeout = 360000
    var interval = 10000
    var endTime = Number(new Date()) + (timeout || 2000)

    var checkCondition = function (resolve, reject) {
      retrieveAndRankService.pollCluster({ cluster_id: process.env.RR_CLUSTER_ID }, function (err, result) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          debug('Cluster is ' + result.solr_cluster_status)
          if (result.solr_cluster_status === 'READY') {
            resolve({status: 'READY'})
          } else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject)
          } else {
            console.log('Timedout!  Please restart the system once the Cluster is ready.')
            reject(new Error('timed out for polling cluster availability.'))
          }
        }
      })
    }

    return new Promise(checkCondition)
  }

  function createConfig () {
    return new Promise(function (resolve, reject) {
      debug('Creating Solr Config ' + process.env.RR_CONFIGNAME)
      var params = {
        cluster_id: process.env.RR_CLUSTER_ID,
        config_name: process.env.RR_CONFIGNAME,
        config_zip_path: './dist/server/config/solr_config.zip'
      }
      retrieveAndRankService.uploadConfig(params, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  function createCollection () {
    return new Promise(function (resolve, reject) {
      debug('Creating a Collection ' + process.env.RR_COLLECTIONNAME)
      retrieveAndRankService.createCollection(
        {
          cluster_id: process.env.RR_CLUSTER_ID,
          collection_name: process.env.RR_COLLECTIONNAME,
          config_name: process.env.RR_CONFIGNAME
        }, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
