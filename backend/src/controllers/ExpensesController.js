const ExpenseModel = require('../models/ExpenseModel');
const GroupMembershipModel = require('../models/GroupMembershipModel');
const GroupModel = require('../models/GroupModel');
const RealtimeUpdatesService = require('../services/RealtimeUpdatesService');

class ExpensesController {
  static async addExpense(req, res) {
    const { groupId, description, totalAmount, members, splits } = req.body;
    if (!groupId || !description || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const isMember = await GroupMembershipModel.isMember(groupId, req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Not a group member' });
    }

    const groupMembers = await GroupModel.getMembers(groupId);

    let finalSplits;
    if (Array.isArray(splits) && splits.length > 0) {
      // Validate custom splits
      const sum = splits.reduce((acc, s) => acc + parseFloat(s.amountOwed), 0);
      if (Math.abs(sum - parseFloat(totalAmount)) > 0.001) {
        return res.status(400).json({ message: 'Custom splits do not sum up to total amount' });
      }
      finalSplits = splits.map(s => ({ 
        userId: s.userId, 
        amountOwed: parseFloat(s.amountOwed) 
      }));
    } else {
      // Handle equal splits
      const involvedMembers = Array.isArray(members) && members.length > 0
        ? groupMembers.filter(m => members.includes(m.id))
        : groupMembers;

      if (involvedMembers.length === 0) {
        return res.status(400).json({ message: 'No members selected for splitting' });
      }

      const splitAmount = parseFloat(totalAmount) / involvedMembers.length;
      finalSplits = involvedMembers.map(m => ({
        userId: m.id, 
        amountOwed: splitAmount
      }));
    }

    const expense = await ExpenseModel.addExpense({
      groupId,
      payerId: req.userId,
      description,
      totalAmount: parseFloat(totalAmount),
      splits: finalSplits
    });

    const responseExpense = {
      ...expense,
      payerName: groupMembers.find(m => m.id === req.userId).name
    };

    RealtimeUpdatesService.expenseAdded(groupId, responseExpense);
    res.json(responseExpense);
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