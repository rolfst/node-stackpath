'use strict'
const http = require('http-debug').http
const https = require('http-debug').https

const test = require('tape')

const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.ALIAS, process.env.KEY, process.env.SECRET)

if (process.env.DEBUG) {
  http.debug = 2
  https.debug = 2
}

test('get', function (t) {
  [ 'account.json',
    'account.json/address',
    'users.json',
    'zones.json' ]
    .forEach(function (endPoint) {
        // far from perfect but handles the above paths
      const key = (endPoint.indexOf('/') !== -1) ? endPoint.split('/')[1] : endPoint.split('.json')[0]

      stackpath.get(endPoint, function (err, res) {
        t.error(err, 'get ' + endPoint + ' without error')
        t.ok(res.data[key], 'get ' + endPoint + ' with data')
      })
    })

  stackpath.get('v3/reporting/logs.json', function (err, res) {
    t.error(err, 'get v3/reporting/logs.json without error')
    t.ok(res.next_page_key, 'get v3/reporting/logs.json with data')
  })
  t.end()
})
