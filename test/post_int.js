'use strict'
const http = require('http-debug').http
const https = require('http-debug').https

const test = require('tape')

const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET)

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
  stackpath.post('zones/pull.json', zone, function (err, res) {
    t.error(err, 'post (js object) without error')
    t.ok(res.data.pullzone.id, 'post with response')
    stackpath.delete('zones/pull.json/' + res.data.pullzone.id, function (eerr, rres) {
      t.error(eerr, 'delete without error')
      t.equal(rres.code, 200, 'delete successful')
    })
  })
  t.end()
})
