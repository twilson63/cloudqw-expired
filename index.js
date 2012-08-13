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

  var view = '/view/expired/today';
  var worker = new Worker(qConfig, function(err, doc, done) {
    var bulk = _.clone(qConfig);
    bulk.pathname = '/bulk';
    
    var postBulk = function(err, array){
      request.post(bulk.href, { json: { docs: array }}, function(e, r, b){
        done(doc.id, callback);
      });
    }

    es.pipeline(
      request(couchUrl + view),
      parseRows,
      es.map(bulkDelete),
      es.writeArray(postBulk)
    );

  });
}