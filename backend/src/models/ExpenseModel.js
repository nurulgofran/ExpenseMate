const db = require('../db/connection');

class ExpenseModel {
  static async addExpense({groupId, payerId, description, totalAmount, splits}) {
    const [expense] = await db('expenses')
      .insert({group_id: groupId, payer_id: payerId, description, total_amount: totalAmount})
      .returning('*');
    
    for (const s of splits) {
      await db('expense_splits').insert({
        expense_id: expense.id,
        user_id: s.userId,
        amount_owed: s.amountOwed
      });
    }

    return expense;
  }

  static async getGroupExpenses(groupId) {
    const expenses = await db('expenses')
      .join('users', 'expenses.payer_id', 'users.id')
      .where('group_id', groupId)
      .select('expenses.*', 'users.name as payerName');

    const expenseIds = expenses.map(e => e.id);
    const splits = await db('expense_splits')
      .whereIn('expense_id', expenseIds);

    return expenses.map(e => ({
      ...e,
      splits: splits.filter(s => s.expense_id === e.id)
    }));
  }
}

module.exports = ExpenseModel;