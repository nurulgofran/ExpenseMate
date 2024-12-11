const db = require('../db/connection');

class ExpenseSplitModel {
  // Might not need many methods, as handled by ExpenseModel
  static async getExpenseSplits(expenseId) {
    return db('expense_splits').where({expense_id: expenseId});
  }
}

module.exports = ExpenseSplitModel;