const GroupModel = require('../models/GroupModel');
const UserModel = require('../models/UserModel');

class GroupsController {
  static async createGroup(req, res) {
    const { name, members } = req.body;
    if (!name) return res.status(400).send('Group name required');
    const group = await GroupModel.createGroup({name, creatorId: req.userId});
    if (Array.isArray(members)) {
      for (const m of members) {
        const user = await UserModel.findByEmail(m.email);
        if (user && user.id !== req.userId) {
          await GroupModel.addMember(group.id, user.id);
        }
      }
    }
    res.send(group);
  }

  static async getUserGroups(req, res) {
    const groups = await GroupModel.getUserGroups(req.userId);
    res.send(groups);
  }

  static async deleteGroup(req, res) {
    const { groupId } = req.params;
    const group = await GroupModel.getGroupById(groupId);
    if (!group) return res.status(404).send('Group not found');

    // Check if the current user is the creator
    if (group.creator_id !== req.userId) {
      return res.status(403).send('Forbidden: Only the creator can delete this group');
    }

    await GroupModel.deleteGroup(groupId);
    res.send({ message: 'Group deleted successfully' });
  }
}

module.exports = GroupsController;