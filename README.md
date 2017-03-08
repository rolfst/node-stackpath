# node-maxcdn

StackPath API for Node.js

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

> Note: Unit tests have been run agaist latest 4.x and 5.x versions of Node.js.

## Install

```
$ npm install stackpath
```

## Usage

#### Initialize

```
var maxcdn = require('maxcdn').create('COMPANY_ALIAS', 'CONSUMER_KEY', 'CONSUMER_SECRET');
```

#### `maxcdn.get`

```
maxcdn.get('reports/stats.json/daily', function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    console.dir(results);
});
```

#### `maxcdn.put`

```
var updates = {
    street1: '555 Some St.',
    street2: 'Suite #1'
};
maxcdn.put('account.json/address', updates, function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    console.dir(results);
});
```

#### `maxcdn.post`

```
maxcdn.post('zones/pull.json', { name: 'testname', url: 'http://www.example.com' }, function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    console.dir(results);
});
```

#### `maxcdn.del`

> Has alias of `maxcdn.delete`.

```
var zoneId = '121212';

// full cache
maxcdn.del('zones/pull.json/'+zoneId+'/cache', function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    if (results.code === 200) {
        console.log('SUCCESS!');
    }
});

// specific files
var files = { files: [ '/master.css', '/another.css' ] };
maxcdn.del('zones/pull.json/'+zoneId+'/cache', files, function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    if (results[0].code === 200) {
        console.log('SUCCESS: %s', files.files[0]);
    }
    if (results[1].code === 200) {
        console.log('SUCCESS: %s', files.files[1]);
    }
});
```

## Running Tests

#### Unit Tests

```
$ make setup test
```

#### Integration Tests

```
$ ALIAS=alias KEY=key SECRET=secret make setup int
```

> **Troubleshooting:**
>
> Ensure that you `ALIAS`, `KEY` and `SECRET` values are correct and that you're running integration on a host with a whitelisted IP address.

