#!/usr/bin/env node

const StackPathCDN = require('../')
const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)

/***
 * Get account information.
 */
stackpath.get('account', function (err, results) {
  console.log('GET account.json')
  if (err) {
        // error handling
    console.trace(err)
  } else {
        // print results
    console.dir(results)
  }
})

/***
 * Get account address information.
 */
stackpath.get('account/address', function (err, results) {
  console.log('account/address')
  if (err) {
        // error handling
    console.trace(err)
  } else {
        // print results
    console.dir(results)
  }
})

stackpath.get('reports/stats/hourly', function (err, results) {
  console.log('reports/stats/hourly summary')
  if (err) {
        // error handling
    console.trace(err)
  } else {
        // print results
    console.dir(results.data.summary)
  }
})
