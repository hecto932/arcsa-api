const debug = require('debug')('arcsa-api:user-service');
const MongoLib = require('../lib/mongo');

class UsersService {
  constructor () {
    this.collection = 'users';
    this.mongoDb = new MongoLib();
  }

  async getUsers({ query, options, sort }) {
    sort.name = query.sortByName === 'desc' ? -1 : 1;
    sort.age = query.sortByAge === 'desc' ? -1 : 1;
    delete query.sortByName;
    const users = await this.mongoDb.getAll(this.collection, query, options, sort);
    return users || [];
  }

  async get({ userId, projection }) {
    const user = await this.mongoDb.get(this.collection, userId, projection);
    return user || false;
  }

  async createUser({ user }) {
    const createUserId = await this.mongoDb.create(this.collection, user);
    return createUserId;
  }

  async updateUser({ userId, user }) {
    debug(userId, user);
    const userUpdatedId = this.mongoDb.update(this.collection, userId, user);
    return userUpdatedId;
  }

  async deleteUser({ userId }) {
    const userDeletedId = this.mongoDb.delete(this.collection, userId);
    return userDeletedId;
  }
}

module.exports = UsersService;