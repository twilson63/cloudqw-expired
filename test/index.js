var exp = require('../'),
  url = require('url'),
  nock = require('nock');

console.log(url.format(JSON.parse(process.env.CLOUDQ)));

//nock.recorder.rec();
nock('http://localhost:3000')
  .get('/')
  .reply(200, "{\"klass\":\"Foo\",\"args\":[],\"id\":\"b3f217dcfb32870686d169134e009b91\"}");

nock('http://localhost:3000')
  .get('/expired')
  .reply(200, "{\"klass\":\"Foo\",\"args\":[],\"id\":\"b3f217dcfb32870686d169134e009b91\"}");

nock('http://localhost:3000')
  .get('/view/expired/today')
  .reply(200, "{\"rows\": [{\"value\": {\"_id\": 1, \"_rev\": 1}}]}");

nock('http://localhost:3000')
  .post('/bulk', "{\"docs\":[{\"_id\":1,\"_rev\":1,\"_deleted\":true}]}")
  .reply(200, "{ \"status\": \"success\"}");

var config = JSON.parse(process.env.CLOUDQ);

exp(config, function() {
  console.log('no errors...')
  process.exit(0);
});

