'use strict'
const http = require('http-debug').http
const https = require('http-debug').https

const test = require('tape')

const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

const time = Date.now().toString()

if (process.env.DEBUG) {
  http.debug = 2
  https.debug = 2
}

test('post', function (t) {
  const zone = {
    name: time,
    url: 'http://www.example.com'
  }
  stackpath.post('sites', zone, function (err, res) {
    console.log(res)
    t.error(err, 'post (js object) without error')
    t.ok(res.data.pullzone.id, 'post with response')
    stackpath.delete('sites/' + res.data.pullzone.id, function (eerr, rres) {
      t.error(eerr, 'delete without error')
      t.equal(rres.code, 200, 'delete successful')
    })
  })
  t.end()
})
