import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Box, 
  Typography,
  Link as MuiLink 
} from '@mui/material';
import { Link } from 'react-router-dom';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
    <Paper>
      <List>
        {groups.map((g) => (
          <ListItem key={g.id}>
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
  );
}

export default GroupList;