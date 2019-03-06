const debug = require('debug')('mongo-setup:seed-admin');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const MongoLib = require('../lib/mongo');
const { config } = require('../config');

debug(config);

function buildAdminUser(password) {
  return {
    password,
    username: config.authAdminUser,
    email: config.authAdminEmail
  };
}

async function hasAdminUser(mongoDB) {
  const collection = 'users';
  const query = { username: config.authAdminUser }
  const options = {};
  const sort = {};
  const limit = 1;
  const skip = 0;
  const adminUser = await mongoDB.getAll(collection, query, options, sort, limit, skip);
  
  return adminUser && adminUser.length;
}

async function createAdminUser(mongoDB) {
  const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10);
  const userId = await mongoDB.create('users', buildAdminUser(hashedPassword));
  return userId;
}

async function seedAdmin () {
  try {
    const mongoDB = new MongoLib();
    
    if (await hasAdminUser(mongoDB)) {
      debug(chalk.yellow('Admin user already exists'));
      return process.exit(1);
    }

    const adminUserId = await createAdminUser(mongoDB);
    debug(chalk.green('Admin user created with id:', adminUserId));
    return process.exit(0);

  } catch (err) {
    debug(chalk.red(err))
    process.exit(1);
  }
}

seedAdmin();