const debug = require('debug')('arcsa-api:mongo-lib');
const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb://${USER && PASSWORD ? `${USER}:${PASSWORD}@` : ''}${config.dbHost}:${config.dbPort}/${DB_NAME}`;

class MongoLib {
  constructor () {
    // debug(`${MONGO_URI}`);
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect(err => {
        if (err) {
          debug(err);
          reject(err)
        }
        debug(`Connected successfully to mongo`);
        resolve(this.client.db(this.dbName));
      });
    });
  }

  getAll(collection, query, options, sort, limit, skip) {
    debug(query);
    debug(options);
    debug(sort)
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query, options)
        .sort(sort)
        .limit(limit || 0)
        .skip(skip || 0)
        .toArray();
    })
  }

  get(collection, id, projections) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .findOne({ _id: ObjectId(id) }, projections)
    });
  }

  create(collection, data) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .insertOne(data)
    })
    .then(result => result.insertedId);
  }

  update(collection, id, data) {
    debug(collection, id, data);
    return this.connect().then(db => {
      return db
        .collection(collection)
        .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
    })
    .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .deleteOne({ _id: ObjectId(id) })
    })
    .then(() => id);
  }
}

module.exports = MongoLib;