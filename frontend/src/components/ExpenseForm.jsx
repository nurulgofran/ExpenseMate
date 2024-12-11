import React, { useState } from 'react';

function ExpenseForm({ groupId, onAdded }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splits, setSplits] = useState([]); 
  // TODO: For now, assume equal splits. Advanced UI for custom splits can be developed later.

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        groupId,
        description,
        totalAmount: parseFloat(totalAmount),
        members: selectedMembers,
        // If needed, send custom splits. For now, assume equal.
      })
    })
      .then(res => res.json())
      .then(data => {
        onAdded(data);
        setDescription('');
        setTotalAmount('');
        setSelectedMembers([]);
        setSplits([]);
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <div>
        <label>Description:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Amount (EUR):</label>
        <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} required />
      </div>
      <p>TODO: Implement member selection and custom splits UI</p>
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;