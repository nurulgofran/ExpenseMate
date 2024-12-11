const db = require('../db/connection');

class UserModel {
  static async createUser({name, email, hashedPassword, bankDetails}) {
    const [user] = await db('users').insert({
      name, email, password: hashedPassword, bank_details: bankDetails
    }).returning('*');
    return user;
  }

  static async findByEmail(email) {
    return db('users').where({email}).first();
  }

  static async findById(id) {
    return db('users').where({id}).first();
  }
}

module.exports = UserModel;