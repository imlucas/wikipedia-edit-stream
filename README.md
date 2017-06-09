# wikipedia-edit-stream

> Listen for page edit notifications from Wikipedia IRC
> and push them into a MongoDB collection to use as a test dataset.

All changes to WikiMedia Foundation installations of MediaWiki publish
a message per change event to a [corresponding IRC channel][0] given a language
and project name, e.g. `en.wikipedia`, `fr.wikipedia`, `en.wikibooks`, etc:

![](https://cldup.com/6mZRhvNT03.png)

To test various pieces of the MongoDB ecosystem, we need datasets of all shapes
and sizes, which makes the freely available, high volume change data from WikiMedia
extremely useful as we can deploy new releases and configurations of MongoDB
and start putting it under the real-world pressures instead of synthetic micro-benchmarks
or machine generated datasets.

![](docs/wikipedia-edit-stream-compass.png)

## Configuration

The following customizations are available by setting environment variables.

`MONGODB_URL` MongoDB deployment to persist changes to, e.g. `mongodb://username:password@hostname:port/db`.

`MONGODB_COLLECTION` Collection to populate [Default: `edits`].

`LANGUAGE` Two letter language code of the WikiMedia project [Default: `en`].

`PROJECT` The WikiMedia project id to listen to [Default: `wikipedia`].


## Deploy Your Own

[![](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/mongodb-js/wikipedia-edit-stream)

## CLI

```bash
npm i -g wikipedia-edit-stream mongodb-runner cross-env;
mongodb-runner start --name=wikipedia --port=27018;
cross-env DEBUG=wikipedia* MONGODB_URL=mongodb://localhost:27018/wikipedia wikipedia-edit-stream;
```

Within a few minutes, you will start seeing debug messages in the terminal as edit notifications are received from IRC, parsed, and inserted into MongoDB! Open http://localhost:3000/ to view a simple count of the number of edits in your collection.

## License

Apache 2.0

![](docs/wikipedia-edit-stream-compass.gif)

[0]: https://meta.wikimedia.org/wiki/Help:Recent_changes#Recent_changes_stream
