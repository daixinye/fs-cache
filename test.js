const Cache = require('./index')
const cache = new Cache()

cache.set('hello', 'world', 100)
cache
  .get('hello')
  .then(data => console.log(data))
  .catch(e => console.error(e))
