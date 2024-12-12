import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';

function AddMemberDialog({ open, onClose, onMemberAdded, groupId }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');

    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to add member');
        return;
      }
      onMemberAdded(); // Refresh or handle success
      onClose();
    } catch (err) {
      console.error(err);
      setError('An error occurred while adding the member');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Member</DialogTitle>
      <DialogContent>
        {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
        <TextField
          label="Member Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberDialog;