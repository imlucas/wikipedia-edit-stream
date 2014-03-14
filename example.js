var wikiedits = require('./'),
  es = require('event-stream'),
  mongo = require('stream-to-mongo')({
    db: 'mongodb://localhost:27017/dataset-wikipedia',
    collection: 'edits'
  });

mongo.on('error', function(err){
  console.error('dropped :(', err);
});
var client = wikiedits().on('data', function(data){
  mongo.write(data);
});
