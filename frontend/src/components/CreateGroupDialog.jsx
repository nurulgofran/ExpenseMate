import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';

function CreateGroupDialog({ open, onClose, onCreated }) {
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    setError('');

    // Parse member emails by comma or newline
    const members = memberEmails
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0)
      .map(email => ({ email }));

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name: groupName.trim(), members })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to create group');
        return;
      }
      onCreated(); // Refresh groups
      onClose();
    } catch (err) {
      console.error(err);
      setError('An error occurred while creating the group');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Member Emails (comma separated)"
          value={memberEmails}
          onChange={(e) => setMemberEmails(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="user1@example.com, user2@example.com"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroupDialog;