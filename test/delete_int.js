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

test('delete', function (t) {
  stackpath.get('sites', function (err, res) {
    if (err) {
      throw err
    }
    const id = res.data.zones[res.data.zones.length - 1].id
    stackpath.delete('sites/' + id + '/cache', function (err, res) {
      t.error(err, 'delete w/o error')
      t.equal(res.code, 200, 'delete successful')
    })

        // delete multiple
    stackpath.get('reports/popularfiles', function (err, res) {
      if (err) {
        throw err
      }
      const file1 = res.data.popularfiles.shift().uri
      const file2 = res.data.popularfiles.shift().uri
      stackpath.delete('sites/' + id + '/cache', [file1, file2],
                function (err, res) {
                  t.error(err, 'delete via Array w/o error')
                  t.equal(res.code, 200, 'delete via Array successful')
                })
      stackpath.delete('sites/' + id + '/cache', { 'files': [file1, file2] },
                function (err, res) {
                  t.error(err, 'delete via Object w/o error')
                  t.equal(res.code, 200, 'delete via Object successful')
                })
    })
  })

  t.end()
})
