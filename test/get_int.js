'use strict'
const http = require('http-debug').http
const https = require('http-debug').https

const test = require('tape')

const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

if (process.env.DEBUG) {
  http.debug = 2
  https.debug = 2
}

test('get', function (t) {
  [ 'account',
    'account/address',
    'users',
    'sites' ]
    .forEach(function (endPoint) {
        // far from perfect but handles the above paths
      const key = (endPoint.indexOf('/') !== -1) ? endPoint.split('/')[1] : endPoint.split('.json')[0]

      stackpath.get(endPoint, function (err, res) {
        t.error(err, 'get ' + endPoint + ' without error')
        t.ok(res.data[endPoint === 'sites' ? 'zones' : key], 'get ' + endPoint + ' with data')
      })
    })

  stackpath.get('logs', function (err, res) {
    t.error(err, 'get /logs without error')
    t.ok(res.next_page_key, 'get /logs with data')
  })
  t.end()
})
