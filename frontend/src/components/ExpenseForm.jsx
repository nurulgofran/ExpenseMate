import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, TextField, Button, FormControlLabel, Checkbox, FormGroup, Switch, Grid } from '@mui/material';

function ExpenseForm({ groupId, onAdded }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [customSplitsEnabled, setCustomSplitsEnabled] = useState(false);
  const [customAmounts, setCustomAmounts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch group members
    fetch(`/api/groups/${groupId}/members`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => {
      setMembers(data);
      // By default, select all members?
      // Or none? Let's start with none selected.
      // The user must pick who is involved.
      // setSelectedMembers(data.map(m => m.id)); // or empty for user choice
    })
    .catch(err => console.error(err));
  }, [groupId]);

  const handleMemberToggle = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
      const { [userId]: removed, ...rest } = customAmounts;
      setCustomAmounts(rest);
    } else {
      setSelectedMembers([...selectedMembers, userId]);
      if (customSplitsEnabled) {
        // Initialize custom amount with equal portion?
        setCustomAmounts(prev => ({ ...prev, [userId]: '' }));
      }
    }
  };

  const handleCustomSplitToggle = (e) => {
    const enabled = e.target.checked;
    setCustomSplitsEnabled(enabled);
    if (enabled) {
      // Initialize customAmounts for currently selected members
      const initialAmounts = {};
      for (const id of selectedMembers) {
        initialAmounts[id] = '';
      }
      setCustomAmounts(initialAmounts);
    } else {
      // Disable custom splits, clear customAmounts
      setCustomAmounts({});
    }
  };

  const handleCustomAmountChange = (userId, value) => {
    setCustomAmounts(prev => ({ ...prev, [userId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim() || !totalAmount) {
      setError('Description and total amount are required');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Select at least one member to share this expense');
      return;
    }

    let body = {
      groupId,
      description: description.trim(),
      totalAmount: parseFloat(totalAmount)
    };

    if (customSplitsEnabled) {
      // Validate sum
      const sum = Object.values(customAmounts).reduce((acc, val) => acc + parseFloat(val || 0), 0);
      if (Math.abs(sum - parseFloat(totalAmount)) > 0.001) {
        setError('The custom splits must sum up exactly to the total amount.');
        return;
      }
      // Prepare splits array
      const splits = selectedMembers.map(uid => ({
        userId: uid,
        amountOwed: parseFloat(customAmounts[uid] || 0)
      }));
      body.splits = splits;
    } else {
      // Send selectedMembers for equal split
      body.members = selectedMembers;
    }

    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setError(data.error || 'Failed to add expense');
          return;
        }
        onAdded(data);
        setDescription('');
        setTotalAmount('');
        setSelectedMembers([]);
        setCustomSplitsEnabled(false);
        setCustomAmounts({});
      })
      .catch(err => {
        console.error(err);
        setError('An error occurred while adding the expense');
      });
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" mb={2}>Add Expense</Typography>
      {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
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
          label="Total Amount (EUR)"
          type="number"
          value={totalAmount}
          onChange={e => setTotalAmount(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <Typography variant="subtitle1" mt={2} mb={1}>Select Members Involved:</Typography>
        <FormGroup>
          {members.map(m => (
            <FormControlLabel
              key={m.id}
              control={
                <Checkbox
                  checked={selectedMembers.includes(m.id)}
                  onChange={() => handleMemberToggle(m.id)}
                />
              }
              label={`${m.name} (${m.email})`}
            />
          ))}
        </FormGroup>

        {selectedMembers.length > 0 && (
          <>
            <FormControlLabel
              control={<Switch checked={customSplitsEnabled} onChange={handleCustomSplitToggle} />}
              label="Enable Custom Splits"
              sx={{ mt: 2 }}
            />

            {customSplitsEnabled && (
              <>
                <Typography variant="body2" color="textSecondary" mt={1} mb={1}>
                  Enter each member's share so that the total equals {totalAmount || '...'} EUR
                </Typography>
                <Grid container spacing={2}>
                  {selectedMembers.map(uid => {
                    const member = members.find(m => m.id === uid);
                    return (
                      <Grid item xs={12} sm={6} key={uid}>
                        <TextField
                          label={`${member.name}'s Share (EUR)`}
                          type="number"
                          fullWidth
                          value={customAmounts[uid] || ''}
                          onChange={e => handleCustomAmountChange(uid, e.target.value)}
                          required
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
          </>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Expense
        </Button>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;