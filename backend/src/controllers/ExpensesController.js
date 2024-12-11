const ExpenseModel = require('../models/ExpenseModel');
const GroupMembershipModel = require('../models/GroupMembershipModel');
const GroupModel = require('../models/GroupModel');
const RealtimeUpdatesService = require('../services/RealtimeUpdatesService');

class ExpensesController {
  static async addExpense(req, res) {
    const { groupId, description, totalAmount, members } = req.body;
    if (!groupId || !description || !totalAmount) return res.status(400).send('Missing fields');
    const isMember = await GroupMembershipModel.isMember(groupId, req.userId);
    if (!isMember) return res.status(403).send('Not a group member');

    // If members not specified, assume split among all members equally
    const groupMembers = await GroupModel.getMembers(groupId);
    const involvedMembers = Array.isArray(members) && members.length > 0 ? 
      groupMembers.filter(m => members.includes(m.id)) : groupMembers;
    const splitAmount = parseFloat(totalAmount) / involvedMembers.length;
    const splits = involvedMembers.map(m => ({userId: m.id, amountOwed: splitAmount}));

    const expense = await ExpenseModel.addExpense({
      groupId,
      payerId: req.userId,
      description,
      totalAmount: parseFloat(totalAmount),
      splits
    });

    const responseExpense = {
      ...expense,
      payerName: groupMembers.find(m => m.id === req.userId).name
    };

    RealtimeUpdatesService.expenseAdded(groupId, responseExpense);
    res.send(responseExpense);
  }

  static async getGroupExpenses(req, res) {
    const { groupId } = req.params;
    if (!await GroupMembershipModel.isMember(groupId, req.userId)) {
      return res.status(403).send('Not a group member');
    }
    const expenses = await ExpenseModel.getGroupExpenses(groupId);
    res.send(expenses);
  }
}

module.exports = ExpensesController;