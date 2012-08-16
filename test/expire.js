var expire = require('../expire');

expire(null, {id: 1}, function(id){
  console.log(id)
});