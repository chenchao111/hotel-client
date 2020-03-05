var request = require('request')
const fs = require('fs')

function requestGet(url) {
  return new Promise((resolve, reject) => { 
    request.get(url, function (error, response, data) { 
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  }) 
}
function requestPost(url, data) {
  return new Promise((resolve, reject) => {
    request.post({url, form:data}, (error, response, data) => { 
      if (error) {
        return reject(error)
      } else {
        return resolve(data)
      }
    })
  }) 
}

function sha1(str) { 
  var crypto = require('crypto');
  var sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

const myReadFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(JSON.parse(res))
    })
  })
}
module.exports = {
  requestGet,
  sha1,
  myReadFile,
  requestPost
}