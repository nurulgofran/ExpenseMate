import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';

function ExpensesPage() {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    fetch(`/api/expenses/${groupId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  }, [groupId]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div>
      <Header />
      <h1>Expenses for Group {groupId}</h1>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>{e.description} - {e.total_amount} EUR (Paid by {e.payerName})</li>
        ))}
      </ul>
      <ExpenseForm groupId={groupId} onAdded={handleExpenseAdded} />
      <a href={`/groups/${groupId}/settlement`}>View Settlement</a>
    </div>
  );
}

export default ExpensesPage;