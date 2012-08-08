var Worker = require('cloudq-worker').Worker,
  es = require('event-stream'),
  parseRows = require('JSONStream').parse(['rows', true]),
  request = require('request');

// cloudq expired worker
//
// This worker picks up a job from a given queue and
// posts the job to a specified url 
// then runs the callback when completed
//
// var exp = require('cloudqw-expired');
// exp(config, urlObj.href, function(err, res){
//  console.log('passed job to ' + urlObj.href);
//});

module.exports = function(qConfig, couchUrl, callback) {
  var bulkDelete = function(data, callback) {
    var job = { _id: data.value._id, _rev: data.value._rev, _deleted: true };
    callback(null, job);
  }

  var view = '/_design/expired/_view/today';
  var worker = new Worker(qConfig, function(err, doc, done) {
    var postToCouch = function(err, array){
      request.post(couchUrl + '/_bulk_docs', { json: { docs: array }}, function(e, r, b){
        done(doc.id, callback);
      });
    }

    es.pipeline(
      request(couchUrl + view),
      parseRows,
      es.map(bulkDelete),
      es.writeArray(postToCouch)
    );

  });
}