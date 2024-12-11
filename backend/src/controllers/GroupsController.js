const GroupModel = require('../models/GroupModel');
const UserModel = require('../models/UserModel');

class GroupsController {
  static async createGroup(req, res) {
    const { name, members } = req.body;
    if (!name) return res.status(400).send('Group name required');
    const group = await GroupModel.createGroup({name, creatorId: req.userId});
    // Add additional members
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
}

module.exports = GroupsController;