#!/usr/bin/env node
/*********************************************************
 * Example script for uploading ssl certs to StackPath.
 *
 *
 * Setup to run this script:
 *
 * $ npm install stackpath http-debug
 *
 ********************************************************/

const path = require('path')
const https = require('http-debug').https
const fs = require('fs')
const format = require('util').format
const StackPathCDN = require('../')

if (process.argv.length < 4) {
  console.log('Usage: %s ZONEID CERT KEY [CA BUNDLE]')
  process.exit(1)
}

const zid = process.argv[2]
const crt = fs.readFileSync(path.resolve(process.argv[3]), {encoding: 'utf8'}).trim()
const key = fs.readFileSync(path.resolve(process.argv[4]), {encoding: 'utf8'}).trim()

let ca
if (process.argv[5]) {
  ca = fs.readFileSync(path.resolve(process.argv[5]), {encoding: 'utf8'}).trim()
}

const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

const certs = {
  ssl_crt: crt,
  ssl_key: key
}

if (typeof ca !== 'undefined') {
  certs.ca = ca
}

https.debug = parseInt(process.env.DEBUG, 10) || 0
stackpath.post(format('/zones/%s/ssl', zid), certs, function (err, res) {
  if (err) console.trace(err)
  console.dir(res)
})
