"use strict;"

var irc = require('slate-irc'),
  net = require('net'),
  debug = require('debug')('wikiedits'),
  regret = require('regret'),
  es = require('event-stream'),
  stream = require('stream'),
  util = require('util');

regret.add('wikipedia.edit',
  /\[\[(.+)\]\] (.*) \* (.*) \* \(\+?(\d+)\) (.*)/,
  '[[Maritime Labour Convention]]  http://en.wikipedia.org/w/index.php?diff=599013421&oldid=599013381 * L.tak * (+0) update',
  ['page', 'diff_url', 'username', 'delta', 'comment']);

module.exports = function(){
  return new Monitor();
};

function Monitor(opts){
  opts = opts || {};
  this.lang = opts.lang || 'en';
  this.project = opts.project || 'wikipedia';
  stream.Readable.call(this, {objectMode: true});
}
util.inherits(Monitor, stream.Readable);

Monitor.prototype._read = function(){
  var self = this;
  this.client = irc(net.connect({port: 6667, host: 'irc.wikimedia.org'}));
  this.channel = '#' + this.lang + '.' + this.project;

  this.client.on('data', function(msg){
    if(msg.command !== 'PRIVMSG') return;

    var message = msg.trailing.replace(/[\u0003]([0-9]*)/g, ''),
      edit = regret('wikipedia.edit', message);

    if(edit === null) return debug('skip', message);

    edit.diff_url = edit.diff_url.trim();
    edit.text = message;
    edit.lang = self.lang;
    edit.project = self.project;

    debug('emit', edit);
    self.emit('data', edit);
  });
  debug('join', this.channel);

  this.client.nick('wikiedits');
  this.client.user('wikiedits', 'dont mind me');
  this.client.join(this.channel);
};
