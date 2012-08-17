var es = require('event-stream'),
  parseRows = require('JSONStream').parse(['rows', true]),
  request = require('request'),
  url = require('url');
  _ = require('underscore');

var bulkDelete = function(data, callback) {
  //console.log(data)
  var job = { _id: data.value._id, _rev: data.value._rev, _deleted: true };
  callback(null, job);
}

var cloudq = JSON.parse(process.env.CLOUDQ); //|| 'http://localhost:5984';

module.exports = function(err, doc, done) {
  cloudq.pathname = '/view/expired/today';
  var view = url.format(cloudq);
  cloudq.pathname = '/bulk';
  var bulk = url.format(cloudq);
  console.log(view);
  console.log(bulk);
  
  var postBulk = function(err, array){
    request.post(bulk, { json: { docs: array }}, function(e, r, b){
      // console.log(b);
      done(doc.id, null);
    });
  }

  es.pipeline(
    request(view),
    parseRows,
    es.map(bulkDelete),
    es.writeArray(postBulk)
  );

}