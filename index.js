var Worker = require('cloudq-worker').Worker,
  expire = require('./expire');

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
  new Worker(qConfig, expire);
  callback(null, 'Worker is running...');
}