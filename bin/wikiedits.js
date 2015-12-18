#!/usr/bin/env node
var debug = require('debug')('wikiedits');
var wikiedits = require('../');
var URL = require('mongodb-url').get('mongodb://localhost:27017/wikiedits');
var createMongoWriteStream = require('stream-to-mongo');

wikiedits({
  lang: process.env.LANGUAGE || 'en',
  project: process.env.PROJECT || 'wikipedia'
})
.pipe(createMongoWriteStream({
  db: URL,
  collection: process.env.MONGODB_COLLECTION || 'edits'
}));


var http = require('http');
var ms = require('ms');

if (process.env.HEROKU_URL) {
  debug('will ping `%s` every 5 minutes...', process.env.HEROKU_URL);
  setInterval(function() {
    http.get(process.env.HEROKU_URL);
  }, ms('5 minutes'));
}

var port = process.env.PORT || 3000;

var express = require('express');
var mongodb = require('mongodb');

var app = express();
var server = http.createServer(app);
var _db;

app.use(function(req, res, next) {
  if (_db) {
    req.locals = {
      db: _db
    };
    next();
    return;
  }
  mongodb.connect(URL, function(err, db) {
    if (err) return next(err);

    _db = db;
    req.locals = {
      db: _db
    };
    next();
  });
});

app.get('/', function(req, res, next) {
  req.locals.db.collection('edits').count(function(err, c) {
    if (err) return next(err);

    res.send({count: c});
  });
});

/* eslint no-console:0 */
server.listen(port, function() {
  console.log('wikiedits up: %s:%s', process.env.HEROKU_URL || 'http://localhost', port);
});
