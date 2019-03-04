const MongoLib = require('../lib/mongo');

class UsersService {
  constructor () {
    this.collection = 'users';
    this.mongoDb = new MongoLib();
  }

  async getUsers(pararmeters) {
    const query = pararmeters;
    const users = await this.mongoDb.getAll(this.collection, query);
    return users || [];
  }
}

module.exports = UsersService;