// This service computes who owes who after all expenses are recorded.
// Steps:
// 1. Sum up how much each user paid and how much each user owes.
// 2. Compute net balance per user (amount_paid - amount_owes).
// 3. Those with negative balance owe money; those with positive balance are owed money.
// 4. Simplify transactions by matching payers and payees until all balances are zeroed.

const db = require('../db/connection');
const GroupModel = require('../models/GroupModel');

class SettlementService {
  static async calculateFinalSettlements(groupId) {
    // Get all expenses and splits
    const expenses = await db('expenses')
      .join('users as payer', 'expenses.payer_id', 'payer.id')
      .where('group_id', groupId)
      .select('expenses.*', 'payer.name as payerName', 'payer.id as payerId');
    const expenseIds = expenses.map(e => e.id);
    const splits = await db('expense_splits')
      .join('users', 'expense_splits.user_id', 'users.id')
      .whereIn('expense_id', expenseIds)
      .select('expense_splits.*', 'users.name as userName', 'users.id as userId', 'users.bank_details');

    // Compute total paid and owed per user
    const userTotals = {};

    // Initialize all users from group
    const members = await GroupModel.getMembers(groupId);
    for (const m of members) {
      userTotals[m.id] = { userId: m.id, name: m.name, bankDetails: m.bank_details, paid: 0, owes: 0 };
    }

    for (const e of expenses) {
      // Payer paid total_amount
      userTotals[e.payerId].paid += parseFloat(e.total_amount);
    }

    for (const s of splits) {
      // Each user owes their split
      userTotals[s.userId].owes += parseFloat(s.amount_owed);
    }

    // Compute net balance
    // Positive: owed money. Negative: owes money.
    const debtors = [];
    const creditors = [];

    for (const uId in userTotals) {
      const user = userTotals[uId];
      const balance = user.paid - user.owes;
      user.balance = balance;
      if (balance < 0) {
        debtors.push(user);
      } else if (balance > 0) {
        creditors.push(user);
      }
    }

    const settlements = [];
    // Match debtors and creditors
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const amount = Math.min(-debtor.balance, creditor.balance);

      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.name,
        toUserId: creditor.userId,
        toUserName: creditor.name,
        amount: amount,
        toUserBank: creditor.bankDetails
      });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (debtor.balance === 0) d++;
      if (creditor.balance === 0) c++;
    }

    return settlements;
  }
}

module.exports = SettlementService;