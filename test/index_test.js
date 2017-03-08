'use strict'
const test = require('tape')

// OAuth stub.
function oaStub () {
  const callback = arguments[arguments.length - 1]

  const res = JSON.stringify({
    foo: 'bar',
    arguments: arguments
  })

  callback(undefined, res, '')
}

const OAuth = require('oauth').OAuth
OAuth.prototype.get = oaStub
OAuth.prototype.put = oaStub
OAuth.prototype.post = oaStub
OAuth.prototype.delete = oaStub

test('stackpath.create', function (t) {
  const stackpath = require('../index')

    // setup
  t.throws(function () {
    stackpath.create()
  })

  t.doesNotThrow(function () {
    stackpath.create('alias', 'key', 'secret')
  })

  t.end()
})

test('StackPathCDN', function (t) {
  const StackPathCDN = require('../index')

    // setup
  t.throws(function () {
    return new StackPathCDN()
  })

  t.doesNotThrow(function () {
    return new StackPathCDN('alias', 'key', 'secret')
  })

  const m = new StackPathCDN('alias', 'key', 'secret')
  t.equal(m.alias, 'alias', 'setup:: alias')
  t.equal(m.key, 'key', 'setup:: key')
  t.equal(m.secret, 'secret', 'setup:: secret')

    // _makeUrl
  t.equal(m._makeUrl('foobar'), 'https://api.stackpath.com/v1/alias/foobar', '_makeURl')
  t.equal(m._makeUrl('/foobar'), 'https://api.stackpath.com/v1/alias/foobar', '_makeURl')

    // _makeQuerystring
  t.equal(m._makeQuerystring({ foo: 'bar' }), 'foo=bar', '_makeQuerystring:: object')
  t.equal(m._makeQuerystring('{ "foo": "bar" }'), 'foo=bar', '_makeQuerystring:: json')
  t.equal(m._makeQuerystring('foo=bar'), 'foo=bar', '_makeQuerystring:: querystring')

    // _makeObject
  t.equal(m._makeObject({ foo: 'bar' }).foo, 'bar', '_makeObject:: object')
  t.equal(m._makeObject('{ "foo": "bar" }').foo, 'bar', '_makeObject:: json')
  t.equal(m._makeObject('foo=bar').foo, 'bar', '_makeQuery:: querystring')

    // _parse
  m._parse(function (err, data) {
    t.equal('SyntaxError', err.name, '_parse:: parse error')
    t.equal(data.statusCode, 500)
  })(undefined, 'foobar', '')

  m._parse(function (err, data) {
    t.ok(err, '_parse:: json w/ err')
    t.ok(data, '_parse:: json w/ data')
  })(new Error(), '{ "foo": "bar" }', '')

  m._parse(function (err, data) {
    t.error(err, '_parse:: no error')
    t.ok(data, '_parse:: json w/ data')
  })(undefined, '{ "foo": "bar" }', '')

    // get
  m.get('path', function (err, data) {
    t.error(err, 'get w/o error')
    t.equal(data.foo, 'bar', 'get w/ data')
    t.equal(data.arguments[0], 'https://api.stackpath.com/v1/alias/path', 'get w/ path')
  })

    // put
  m.put('path', { data: 'data' }, function (err, data) {
    t.error(err, 'put w/o error')
    t.equal(data.foo, 'bar', 'put w/ data')
    t.equal(data.arguments[0], 'https://api.stackpath.com/v1/alias/path', 'put w/ path')
    t.deepEqual(data.arguments[3], { data: 'data' }, 'put sends data')
  })

    // post
  m.post('path', { data: 'data' }, function (err, data) {
    t.error(err, 'post w/o error')
    t.equal(data.foo, 'bar', 'post w/ data')
    t.equal(data.arguments[0], 'https://api.stackpath.com/v1/alias/path', 'post w/ path')
    t.deepEqual(data.arguments[3], { data: 'data' }, 'post sends data')
  })

    // delete
  m.delete('path', function (err, data) {
    t.error(err, 'delete w/o error')
    t.equal(data.foo, 'bar', 'delete w/ data')
    t.equal(data.arguments[0], 'https://api.stackpath.com/v1/alias/path', 'delete w/ path')
    t.notOk(data.arguments[3], 'delete sends data')
  })

  m.delete('path', 'path1', function (err, data) {
    t.error(err, 'delete (via Array) w/o error')
    t.equal(data.foo, 'bar', 'delete (via Array) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files=path1',
                'delete (via Array) w/ path')
    t.notOk(data.arguments[3], 'delete (via Array) sends data')
  })

  m.delete('path', ['path1', 'path2'], function (err, data) {
    t.error(err, 'delete (via Array) w/o error')
    t.equal(data.foo, 'bar', 'delete (via Array) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files[0]=path1&files[1]=path2',
                'delete (via Array) w/ path')
    t.notOk(data.arguments[3], 'delete (via Array) sends data')
  })

  m.delete('path', { files: ['path1', 'path2'] }, function (err, data) {
    t.error(err, 'delete (via Object) w/o error')
    t.equal(data.foo, 'bar', 'delete (via Object) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files[0]=path1&files[1]=path2',
                'delete (via Object) w/ path')
    t.notOk(data.arguments[3], 'delete (via Object) sends data')
  })

  m.del('path', function (err, data) {
    t.error(err, 'del w/o error')
    t.equal(data.foo, 'bar', 'del w/ data')
    t.equal(data.arguments[0], 'https://api.stackpath.com/v1/alias/path', 'del w/ path')
    t.notOk(data.arguments[3], 'del sends data')
  })

  m.del('path', 'path1', function (err, data) {
    t.error(err, 'delete (via Array) w/o error')
    t.equal(data.foo, 'bar', 'delete (via Array) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files=path1',
                'delete (via Array) w/ path')
    t.notOk(data.arguments[3], 'delete (via Array) sends data')
  })

  m.del('path', ['path1', 'path2'], function (err, data) {
    t.error(err, 'del (via Array) w/o error')
    t.equal(data.foo, 'bar', 'del (via Array) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files[0]=path1&files[1]=path2',
                'del (via Array) w/ path')
    t.notOk(data.arguments[3], 'del (via Array) sends data')
  })

  m.del('path', { files: ['path1', 'path2'] }, function (err, data) {
    t.error(err, 'del (via Object) w/o error')
    t.equal(data.foo, 'bar', 'del (via Object) w/ data')
    t.equal(data.arguments[0],
                'https://api.stackpath.com/v1/alias/path?files[0]=path1&files[1]=path2',
                'del (via Object) w/ path')
    t.notOk(data.arguments[3], 'del (via Object) sends data')
  })

  t.end()
})
