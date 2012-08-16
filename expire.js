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

var cloudq = url.format(process.env.CLOUDQ); // || 'http://localhost:5984';
//var cloudq = 'http://gmms-cloudq.herokuapp.com';

module.exports = function(err, doc, done) {
  var view = cloudq + '/view/expired/today',
      bulk = cloudq + '/bulk';
  //console.log(view);
  //console.log(bulk);

  var postBulk = function(err, array){
    request.post(url.format(bulk), { json: { docs: array }}, function(e, r, b){
      console.log(b);
      done(doc.id, null);
    });
  }
  
  es.pipeline(
    request(url.format(view)),
    parseRows,
    es.map(bulkDelete),
    es.writeArray(postBulk)
  );

}