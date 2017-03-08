#!/usr/bin/env node

const path = require('path')
const StackPathCDN = require('../')

if (process.argv.length === 2) {
  usage()
}

const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

/***
 * Pull Zone ID from CLI arguments.
 */
const zoneId = process.argv[2]

/***
 * Optionally, pull files from CLI arguments.
 */
const files = process.argv.slice(3, process.argv.length)

/***
 * URL to StackPathCDN API.
 */
const url = path.join('sites', zoneId, 'cache')

/***
 * Define callback for OAuth requests to StackPathCDN.
 */
function callback (error, res) {
    /***
     * Error handling.
     */
  if (error) {
    console.trace(error)
    return
  }

    /***
     * Report success.
     */
  console.log('Cache successfully cleared!', res)
}

if (files === 0) {
    /***
     * If no files are passed, purge full cache.
     */
  stackpath.delete(url, callback)
} else {
    /***
     * Otherwise, only purge files specified.
     */
  stackpath.delete(url, { files: files }, callback)
}

/***
 * Usage
 */
function usage () {
  console.log('')
  console.log('Usage: clear_cache.js ZONEID [FILES]')
  console.log('')
  console.log('  Credentials:')
  console.log('')
  console.log('  Add your credentials to your environment, like so:')
  console.log('')
  console.log('  $ export STACKPATH_ALIAS=comapny_alias')
  console.log('  $ export STACKPATH_KEY=consumer_key')
  console.log('  $ export STACKPATH_SECRET=consumer_secret')
  console.log('  $ ./clear_cache.js 121212 /master.css /another.css')
  console.log('')
  console.log('  Or by passing them to the script.')
  console.log('')
  console.log('  $ STACKPATH_ALIAS=comapny_alias STACKPATH_KEY=consumer_key STACKPATH_SECRET=consumer_secret ./clear_cache.js \'')
  console.log('       121212 /master.css /another.css')
  console.log('')
  process.exit()
}
