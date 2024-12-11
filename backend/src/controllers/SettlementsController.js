const SettlementService = require('../services/SettlementService');
const GroupMembershipModel = require('../models/GroupMembershipModel');

class SettlementsController {
  static async getSettlements(req, res) {
    const { groupId } = req.params;
    if (!await GroupMembershipModel.isMember(groupId, req.userId)) {
      return res.status(403).send('Not a group member');
    }
    const settlements = await SettlementService.calculateFinalSettlements(groupId);
    res.send(settlements);
  }
}

module.exports = SettlementsController;