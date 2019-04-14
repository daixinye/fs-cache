const fs = require('fs')
const path = require('path')

const OPTIONS = { encoding: 'utf-8' }
const ERROR = {
  ERROR: new Error(`cache: the value expired or not exist`)
}

class Cache {
  constructor (options = { basepath: './.cache' }) {
    const { basepath } = options
    this._basepath = path.resolve(__dirname, basepath)
  }

  set (key, value, ttl) {
    return new Promise((resolve, reject) => {
      let expires = Date.now() + ttl * 1000

      if (fs.existsSync(this._basepath)) {
        fs.readFile(this._basepath, OPTIONS, (e, data) => {
          if (e) {
            reject(e)
          }
          data = JSON.parse(data)
          data[key] = { value, expires }
          fs.writeFile(this._basepath, JSON.stringify(data, 0, 2), e => {
            if (e) {
              reject(e)
            }
            resolve(expires)
          })
        })
      } else {
        let data = {}
        data[key] = { value, expires }
        fs.writeFile(this._basepath, JSON.stringify(data, 0, 2), e => {
          if (e) {
            reject(e)
          }
          resolve(expires)
        })
      }
    })
  }

  get (key = '') {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this._basepath)) {
        fs.readFile(this._basepath, OPTIONS, (e, data) => {
          data = JSON.parse(data)
          const isCacheValid = key in data && data[key].expires > Date.now()
          if (isCacheValid) {
            resolve(data[key].value)
          } else {
            reject(
              ERROR.ERROR
            )
          }
        })
      } else {
        reject(ERROR.ERROR)
      }
    })
  }
}

module.exports = Cache
