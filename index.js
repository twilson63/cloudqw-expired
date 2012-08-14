var Worker = require('cloudq-worker').Worker,
  es = require('event-stream'),
  parseRows = require('JSONStream').parse(['rows', true]),
  request = require('request'),
  url = require('url');
  _ = require('underscore');

// cloudq expired worker
//
// This worker picks up a job from a given queue and
// posts the job to a specified url 
// then runs the callback when completed
//
// var exp = require('cloudqw-expired');
// exp(config, function(err, res){
//  console.log('passed job to ' + urlObj.href);
//});

module.exports = function(qConfig, callback) {
  var view = _.clone(qConfig),
  bulk = _.clone(qConfig);
  view.pathname = '/view/expired/today';
  bulk.pathname = '/bulk';

  var bulkDelete = function(data, callback) {
    var job = { _id: data.value._id, _rev: data.value._rev, _deleted: true };
    callback(null, job);
  }

  var worker = new Worker(qConfig, function(err, doc, done) {
    var postBulk = function(err, array){
      request.post(url.format(bulk), { json: { docs: array }}, function(e, r, b){
        done(doc.id, callback);
      });
    }
    es.pipeline(
      request(url.format(view)),
      parseRows,
      es.map(bulkDelete),
      es.writeArray(postBulk)
    );

  });
}