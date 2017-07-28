'use strict'

var Cloudant = require('cloudant')
var watson = require('watson-developer-cloud')

var retrieveAndRank = watson.retrieve_and_rank({
  username: process.env.RR_USERNAME,
  password: process.env.RR_PASSWORD,
  version: 'v1'
})

module.exports = function (Answerunit) {
  var app = require('../../server/server')
  Answerunit.listAnswerIds = function (cb) {
    var dbUrl = Answerunit.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var answerUnitsDB = cloudant.db.use(process.env.ANSWERUNITS_DB)
    var options = {
      include_docs: true
    }
    answerUnitsDB.list(options, function (err, result) {
      if (err) {
        cb(err)
      } else {
        var response = [
        ]
        for (let row of result.rows) {
          if (row.doc.title) {
            let item = {
              id: row.id,
              title: row.doc.title
            }
            response.push(item)
          }
        }
        cb(null, response)
      }
    })
  }
  // Create an Answer Unit from the uploaded document
  Answerunit.reviewDocument = function (req, res, cb) {
    try {
      if (!req.files || req.files.length === 0) {
        cb('No file image specified.')
        return
      }

      var config = {
        retrieve_and_rank: {
          dry_run: true,
          service_instance_id: process.env.RR_SERVICE_ID,
          cluster_id: process.env.RR_CLUSTER_ID,
          search_collection: process.env.RR_COLLECTIONNAME
        }
      }

      var metadata = {
        metadata: [
          { name: 'fileName', value: req.files[0].originalname }
        ]
      }
      var documentConversion = watson.document_conversion({
        username: process.env.DOC_CONVERSION_USERNAME,
        password: process.env.DOC_CONVERSION_PASSWORD,
        version: 'v1',
        version_date: '2015-12-15'
      })

      documentConversion.index({
        file: req.files[0].buffer,
        config: config,
        metadata: metadata
      }, function (err, response) {
        if (err) {
          cb(err)
        } else {
          cb(null, response)
        }
      })
    } catch (err) {
      cb(err)
    }
  }
  Answerunit.indexDocument = function (req, res, reviewResponse, cb) {
    try {
      var params = {
        cluster_id: process.env.RR_CLUSTER_ID,
        collection_name: process.env.RR_COLLECTIONNAME
      }
/*
      console.log('TRACING ANSWER MATCHING HERE')
      console.log(reviewResponse)

      var doc = {
        id: reviewResponse.converted_document.answer_units[0].id,
        body: reviewResponse.converted_document.answer_units[0].content[1].text,
        title: reviewResponse.converted_document.answer_units[0].title
      }
*/
      var doc = {
        id: reviewResponse.rankedAnswers[0].id,
        body: reviewResponse.rankedAnswers[0].resolution,
        title: reviewResponse.rankedAnswers[0].topic
      }
      var solrClient = retrieveAndRank.createSolrClient(params)

      console.log('Indexing a document...')
      solrClient.add(doc, function (err, response) {
        if (err) {
          console.log('Error indexing document: ', err)
          cb(err)
        } else {
          console.log('Indexed a document.')
          solrClient.commit(function (err) {
            if (err) {
              console.log('Error committing change: ' + err)
              cb(err)
            } else {
              console.log('Successfully committed changes.')
              // Create a new Answer Unit entries to be stored in Cloudant
              let bulkRequest = {
                docs: []
              }
//              for (var au of reviewResponse.converted_document.answer_units) {
              for (var au of reviewResponse.rankedAnswers) {
                let answerUnit = {
/*
                  _id: au.id,
                  answerId: au.id,
                  title: au.title,
                  body: au.content[1].text,
                  bodySnippet: au.content[1].text.substring(0, 512),
                  sourceTitle: req.files[0].originalname,
                  estimatedTimeMinutes: au.estimatedTimeMinutes,
                  successHeuristic: au.successHeuristic,
*/
                  _id: au.answerID,
                  answerId: au.answerID,
                  title: au.topic,
                  body: au.resolution,
                  bodySnippet: au.resolution.substring(0, 512),
                  sourceTitle: req.files[0].originalname,
//                  estimatedTimeMinutes: au.estimatedTimeMinutes,
                  successHeuristic: au.score,
                  loopback__model__name: 'answerunit'
                }
//                bulkRequest.docs.push(answerUnit)
              }
              // Save the bulk Request
              var dbUrl = Answerunit.getDataSource().settings.url
              var cloudant = Cloudant(dbUrl)
              var answerUnitsDB = cloudant.db.use(process.env.ANSWERUNITS_DB)
              answerUnitsDB.bulk(bulkRequest, function (err, result) {
                if (err) {
                  cb(err)
                } else {
                  // Add the attachment to the doc here.
                  for (var added of result) {
                    answerUnitsDB.attachment.insert(
                      added.id,
                      req.files[0].originalname,
                      req.files[0].buffer,
                      req.files[0].mimetype,
                      { 'rev': added.rev },
                      function (err, attach) {
                        if (err) {
                          console.log(err)
                        } else {
                          console.log('Succesfully added attachement to answer unit with id ' + attach.id)
                        }
                      }
                    )
                  }
                  cb(null, result)
                }
              })
            }
          })
        }
      })
    } catch (err) {
      cb(err)
    }
  }
  // Query Retrieve and Rank and then match the Answer unit to the doc in the Answer Units DB
  Answerunit.query = function (query, cb) {
    var dbUrl = Answerunit.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var answerUnitsDB = cloudant.db.use(process.env.ANSWERUNITS_DB)

    console.log('Query Retrieve and Rank and then match the Answer unit to the doc in the Answer Units DB')
    app.models.Retrieverank.query(query, function (err, result) {
      if (err) {
        cb(err)
      } else {
//        console.log('AFTER Retrieverank query')
//        console.log(result)
//        console.log('CONTINUE FROM HERE')
        let answers = {
          answerCount: result.answers.length,
          rankedAnswers: []
        }
        for (var row of result.answers) {
          answers.rankedAnswers.push(row)
        }
        cb(null, answers)
/*
        try {

          let keys = []

          for (var doc of result.response.docs) {
            keys.push(doc.id)
          }

          answerUnitsDB.fetch({ 'keys': keys }, function (err, result1) {
            if (!err) {
              let answers = {
                answerCount: result1.rows.length,
                rankedAnswers: []
              }
              for (var row of result1.rows) {
                answers.rankedAnswers.push(row.doc)
              }
              cb(null, answers)
            } else {
              cb(err)
            }
          }) // fetch
        } catch (err) {
          cb(err)
        }
*/
      }
    })
  }
  // Retrieve the Attachement from the Answer Units Doc in the DB
  Answerunit.getAttachment = function (id, filename, contenttype, cb) {
    var dbUrl = Answerunit.getDataSource().settings.url
    var cloudant = Cloudant(dbUrl)
    var documentsDB = cloudant.db.use(process.env.ANSWERUNITS_DB)

    documentsDB.attachment.get(id, filename, function (err, body) {
      if (err) {
        cb(err)
      } else {
        cb(null, body, contenttype, 'SAMEORIGIN')
      }
    })
  }
}
