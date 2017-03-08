#!/usr/bin/env node
const StackPathCDN = require('../')

/***
 * Pull and validate arguments for report type.
 */
const validReports = [ 'daily', 'hourly', 'monthly', '' ]
var report = ''
if (process.argv[2]) {
  const arg = process.argv[2].trim()

  if (arg === 'help') {
    usage()
  }

  if (validReports.indexOf(arg) !== -1) {
    if (arg !== '') {
      report = ''
    } else {
      report = '/' + arg
    }
  }
}

const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

/***
 * Wrap maxcdn.get to abstract generic error handling.
 */
function get (url, callback) {
  stackpath.get(url, function (error, result) {
        /***
         * Error handling.
         */
    if (error) {
      console.trace(error)
      process.exit(1)
    }

        /***
         * Callback on success.
         */
    callback(result.data)
  })
}

/***
 * First, get pullzone id's.
 */
get('sites', function (result) {
    /***
     * Iterate through pull zones.
     */
  result.zones.forEach(function (site) {
    console.log('Zone report for: %s (%s)', site.name, site.cdn_url)

        /***
         * Second, get summary.
         */
    get('reports/' + site.id + '/stats' + report, function (result) {
            /***
             * Format summary.
             */
      Object.keys(result.summary).forEach(function (key) {
        console.log('- %s: %s', key, result.summary[key])
      })

            /***
             * Third, get popularfiles... limit 10.
             */
      get('reports/' + site.id + '/popularfiles?page_size=10', function (popular) {
        console.log('')
        console.log('Popular files:')

                /***
                 * Iterate over popular files and format data.
                 */
        popular.popularfiles.forEach(function (file) {
          console.log('- url: %s', file.uri)
          console.log('  - hits: %s', file.hit)
          console.log('  - size: %s', file.size)
        })
      })
    })
    console.log('')
  })
})

/***
 * Usage
 */
function usage () {
  console.log('')
  console.log('Usage: report.js [hourly|daily|monthly]')
  console.log('')
  console.log('  Report types only cover summary.')
  console.log('')
  console.log('  Credentials:')
  console.log('')
  console.log('  Add your credentials to your environment, like so:')
  console.log('')
  console.log('  $ export STACKPATH_ALIAS=comapny_alias')
  console.log('  $ export STACKPATH_KEY=consumer_key')
  console.log('  $ export STACKPATH_SECRET=consumer_secret')
  console.log('  $ ./report.js')
  console.log('')
  console.log('  Or by passing them to the script.')
  console.log('')
  console.log('  $ STACKPATH_ALIAS=comapny_alias STACKPATH_KEY=consumer_key STACKPATH_SECRET=consumer_secret ./report.js')
  console.log('')
  process.exit()
}
