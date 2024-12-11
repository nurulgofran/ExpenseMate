const db = require('../db/connection');

class GroupMembershipModel {
  static async isMember(groupId, userId) {
    const membership = await db('group_memberships').where({group_id: groupId, user_id: userId}).first();
    return !!membership;
  }
}

module.exports = GroupMembershipModel;