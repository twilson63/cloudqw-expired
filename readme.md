[![build status](https://secure.travis-ci.org/twilson63/cloudqw-expired.png)](http://travis-ci.org/twilson63/cloudqw-expired)
# cloudqw-expired

Expired is a Cloudq worker that removes all expired jobs from cloudq

# install

``` sh
npm install cloudqw-expired
```

# use

``` javascript
var config = {
  protocol: 'http',
  host: 'localhost:3000',
  pathname: '/expired',
  interval: 60000
}

exp(config, 'http://localhost:5984/cloudq');

```