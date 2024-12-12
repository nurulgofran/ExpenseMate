import React, { useState } from 'react';
import { Paper, Box, Typography, TextField, Button } from '@mui/material';

function ExpenseForm({ groupId, onAdded }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        groupId,
        description,
        totalAmount: parseFloat(totalAmount)
      })
    })
      .then(res => res.json())
      .then(data => {
        onAdded(data);
        setDescription('');
        setTotalAmount('');
      })
      .catch(err => console.error(err));
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" mb={2}>Add Expense</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount (EUR)"
          type="number"
          value={totalAmount}
          onChange={e => setTotalAmount(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Typography variant="body2" color="textSecondary" mt={1}>
          TODO: Implement member selection and custom splits
        </Typography>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Expense
        </Button>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;