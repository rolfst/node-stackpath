'use strict'
const http = require('http-debug').http
const https = require('http-debug').https

const test = require('tape')

const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

const time = Date.now().toString()

function bumpTime (n) {
  return time + '_' + n
}

if (process.env.DEBUG) {
  http.debug = 2
  https.debug = 2
}

test('put', function (t) {
  const time1 = bumpTime(1)
  stackpath.put('account', 'name=' + time1, function (err, res) {
    t.error(err, 'put (query string) without error')
    t.equal(res.data.account.name, time1, 'put (query string) updates field')
  })

  const time2 = bumpTime(2)
  stackpath.put('account/address', '{ "street1": "' + time2 + '" }', function (err, res) {
    t.error(err, 'put (json string) without error')
    t.equal(res.data.address.street1, time2, 'put (json string) updates field')
  })

  const time3 = bumpTime(3)
  stackpath.put('account/address', { street2: time3 }, function (err, res) {
    t.error(err, 'put (js object) without error')
    t.equal(res.data.address.street2, time3, 'put (json string) updates field')
  })
  t.end()
})
