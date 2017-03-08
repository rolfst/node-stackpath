const StackPathCDN = require('../index')
const stackpath = new StackPathCDN(process.env.STACKPATH_ALIAS, process.env.STACKPATH_KEY, process.env.STACKPATH_SECRET)
const async = require('async')
const postName = Date.now().toString() + 'timer'
const timers = []

// fetch zoneid for timers
stackpath.get('sites', function (err, res) {
  if (err) {
    console.error(err)
    throw err
  }

  // const zones = res.data.zones

    // timers
  timer('GET /reports/popularfiles', function (callback) {
    stackpath.get('reports/popularfiles', function (err, res) {
      callback(err)
    })
  })

  timer('GET /logs', function (callback) {
    stackpath.get('/logs', function (err, res) {
      callback(err)
    })
  })

  timer('PUT /account/address', function (callback) {
    stackpath.put('account/address', 'street2=' + postName, function (err, res) {
      callback(err)
    })
  })

   // run timers
  async.series(timers)
})

// timer function
function timer (label, test) {
  timers.push(function (callback) {
    const start = new Date()
    process.stdout.write(label + ': ')
    test(function (err) {
      if (err) {
        console.log('FAILED')
        console.trace(err)
        return
      }
      console.log('%s ms', new Date() - start)
      callback()
    })
  })
}
