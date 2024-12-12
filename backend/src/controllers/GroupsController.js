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

  static async addMemberAfterCreation(req, res) {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to add member' });
    }

    const group = await GroupModel.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify creator permissions
    if (group.creator_id !== req.userId) {
      return res.status(403).json({ message: 'Only the creator can add new members' });
    }

    const userToAdd = await UserModel.findByEmail(email);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Avoid adding the creator or duplicates
    if (userToAdd.id === req.userId) {
      return res.status(400).json({ message: 'Cannot add yourself again' });
    }

    const members = await GroupModel.getMembers(groupId);
    if (members.find(m => m.id === userToAdd.id)) {
      return res.status(400).json({ message: 'User already a member of this group' });
    }

    await GroupModel.addMember(groupId, userToAdd.id);
    res.json({ 
      message: 'Member added successfully', 
      user: { id: userToAdd.id, email: userToAdd.email }
    });
  }
}

module.exports = GroupsController;