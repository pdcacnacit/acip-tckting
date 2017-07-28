'use strict'

var watson = require('watson-developer-cloud')

var retrieveAndRankService = watson.retrieve_and_rank({
  username: process.env.RR_USERNAME,
  password: process.env.RR_PASSWORD,
  version: 'v1'
})

var request = require('request')

var options = {
//    url: 'https://acip-demo.mybluemix.net/rest/askquestion/q/Why%20I%20have%20frequent%20drops%20on%20Veeva%20App',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'clientInfo': 'ACIPrest',
        'Authorization': 'Basic YWNpcGVuZHVzZXI6cGFzc3dvcmQ='
    }
}

module.exports = function (Retrieverank) {
  Retrieverank.query = function (query, cb) {
    var params = {
      cluster_id: process.env.RR_CLUSTER_ID,
      collection_name: process.env.RR_COLLECTIONNAME,
      wt: 'json'
    }
    var solrClient = retrieveAndRankService.createSolrClient(params)

    var solrQuery = solrClient.createQuery()
    solrQuery.q(query)

    console.log('Print solrQuery')
    console.log(query)

    console.log('Sample request here [1]')
    var ACIPurl = 'https://acip-demo.mybluemix.net/rest/askquestion/q/' + query
    options.url = encodeURI(ACIPurl)
    console.log(options.url)
    request(options, function(err, res, body) {
      if (err) {
        console.log(err)
        cb (err)
      } else {
        var json = JSON.parse(body)
        console.log(json)
        cb(null, json)
      }
    })
/*
    console.log('Search for Answers here [1]')
    solrClient.search(solrQuery, function (err, searchResponse) {
      if (err) {
        cb(err)
      } else {
        cb(null, searchResponse)
      }
    })
*/
  }
}
