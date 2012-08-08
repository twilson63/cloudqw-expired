var exp = require('../'),
  nock = require('nock');

nock('http://localhost:3000')
  .get('/expired')
  .reply(200, "{\"klass\":\"Foo\",\"args\":[],\"id\":\"b3f217dcfb32870686d169134e009b91\"}", { 'content-type': 'application/json',
  date: 'Wed, 08 Aug 2012 13:55:05 GMT',
  connection: 'keep-alive',
  'transfer-encoding': 'chunked' });

var config = {
  protocol: 'http',
  host: 'localhost:3000',
  pathname: '/expired',
  interval: 60000
}

exp(config, 'http://localhost:5984/cloudq');
