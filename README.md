# wikipedia-edit-stream

[![build status](https://secure.travis-ci.org//imlucas/wikipedia-edit-stream.png)](http://travis-ci.org//imlucas/wikipedia-edit-stream)

## Examples

```
var wikiedits = require('./'),
  crypto = require('crypto'),
  es = require('event-stream'),
  mongo = require('stream-to-mongo')({
    db: 'mongodb://localhost:27017/wikipedia',
    collection: 'edits'
  });

var client = wikiedits().on('data', function(data){
  data._id = crypto.createHash('sha1')
    .update(data.page + '-' data.date.getTime())
    .toString('hex');

  mongo.write(data);
});

```

## Todo

- slate-irc-parser is using streams1, so update it so we can actually pipe

## License

MIT
