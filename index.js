var irc = require('slate-irc');
var net = require('net');
var debug = require('debug')('wikiedits');
var regret = require('regret');
var stream = require('stream');
var util = require('util');

regret.add('wikipedia.edit',
  /\[\[(.+)\]\] (.*) \* (.*) \* \(\+?(\d+)\) (.*)/,
  '[[Maritime Labour Convention]]  http://en.wikipedia.org/w/index.php?diff=599013421&oldid=599013381 * L.tak * (+0) update',
  ['page', 'diff_url', 'username', 'delta', 'comment']);

function Monitor(opts) {
  if (!(this instanceof Monitor)) {
    return new Monitor(opts);
  }
  opts = opts || {};
  this.lang = opts.lang || 'en';
  this.project = opts.project || 'wikipedia';
  stream.Readable.call(this, {
    objectMode: true
  });
}
util.inherits(Monitor, stream.Readable);

Monitor.prototype._read = function() {
  var self = this;
  this.client = irc(net.connect({
    port: 6667,
    host: 'irc.wikimedia.org'
  }));
  this.channel = '#' + this.lang + '.' + this.project;

  this.client.on('data', function(msg) {
    if (msg.command !== 'PRIVMSG') {
      return;
    }

    var message = msg.trailing.replace(/[\u0003]([0-9]*)/g, '');
    var edit = regret('wikipedia.edit', message);

    if (edit === null) {
      debug('skip', message);
      return;
    }

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

module.exports = Monitor;
