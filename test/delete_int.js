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

test('delete', function (t) {
  stackpath.get('zones/pull.json', function (err, res) {
    if (err) {
      throw err
    }
    const id = res.data.pullzones[res.data.pullzones.length - 1].id
    stackpath.delete('zones/pull.json/' + id + '/cache', function (err, res) {
      t.error(err, 'delete w/o error')
      t.equal(res.code, 200, 'delete successful')
    })

        // delete multiple
    stackpath.get('reports/popularfiles.json', function (err, res) {
      if (err) {
        throw err
      }
      const file1 = res.data.popularfiles.shift().uri
      const file2 = res.data.popularfiles.shift().uri
      stackpath.delete('zones/pull.json/' + id + '/cache', [file1, file2],
                function (err, res) {
                  t.error(err, 'delete via Array w/o error')
                  t.equal(res.code, 200, 'delete via Array successful')
                })
      stackpath.delete('zones/pull.json/' + id + '/cache', { 'files': [file1, file2] },
                function (err, res) {
                  t.error(err, 'delete via Object w/o error')
                  t.equal(res.code, 200, 'delete via Object successful')
                })
    })
  })

  t.end()
})
