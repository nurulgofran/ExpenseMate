import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Box, 
  Typography,
  Link as MuiLink,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddMemberDialog from './AddMemberDialog';

function GroupList({ refreshKey }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const fetchGroups = () => {
    fetch('/api/groups', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, [refreshKey]);

  const handleDelete = async (groupId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Could not delete group'}`);
        return;
      }
      fetchGroups();
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the group.');
    }
  };

  const currentUserId = localStorage.getItem('userId');

  const handleOpenAddMember = (groupId) => {
    setSelectedGroupId(groupId);
    setOpenAddMemberDialog(true);
  };

  const handleMemberAdded = () => {
    // Refresh groups after adding a member
    fetchGroups();
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (groups.length === 0) {
    return <Typography variant="body1" color="text.secondary">No groups found. Create one to get started!</Typography>;
  }

  return (
    <>
      <Paper>
        <List>
          {groups.map((g) => (
            <ListItem key={g.id}
              secondaryAction={
                <>
                  {g.creator_id == currentUserId && (
                    <>
                      <IconButton edge="end" aria-label="add-member" onClick={() => handleOpenAddMember(g.id)}>
                        <PersonAddIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(g.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </>
              }
            >
              <ListItemText
                primary={g.name}
                secondary={
                  <MuiLink component={Link} to={`/groups/${g.id}/expenses`} variant="body2" color="primary">
                    View Expenses
                  </MuiLink>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {selectedGroupId && (
        <AddMemberDialog
          open={openAddMemberDialog}
          onClose={() => setOpenAddMemberDialog(false)}
          onMemberAdded={handleMemberAdded}
          groupId={selectedGroupId}
        />
      )}
    </>
  );
}

export default GroupList;