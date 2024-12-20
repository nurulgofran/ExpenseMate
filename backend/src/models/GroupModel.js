const db = require('../db/connection');

class GroupModel {
  static async createGroup({name, creatorId}) {
    const [group] = await db('groups').insert({name, creator_id: creatorId}).returning('*');
    await db('group_memberships').insert({group_id: group.id, user_id: creatorId});
    return group;
  }

  static async getUserGroups(userId) {
    return db('groups')
      .join('group_memberships', 'groups.id', 'group_memberships.group_id')
      .where('group_memberships.user_id', userId)
      .select('groups.*');
  }

  static async getGroupById(groupId) {
    return db('groups').where('id', groupId).first();
  }

  static async addMember(groupId, userId) {
    await db('group_memberships').insert({group_id: groupId, user_id: userId});
  }
  
  static async getMembers(groupId) {
    return db('group_memberships')
      .join('users', 'group_memberships.user_id', 'users.id')
      .where('group_memberships.group_id', groupId)
      .select('users.id', 'users.name', 'users.email', 'users.bank_details');
  }

  static async deleteGroup(groupId) {
    // Due to ON DELETE CASCADE in the schema, related memberships, expenses, and splits will be removed automatically.
    await db('groups').where('id', groupId).del();
  }
}

module.exports = GroupModel;