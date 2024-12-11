import React from 'react';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';
import GroupList from '../components/GroupList';

function GroupsPage() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ExpenseMate
          </Typography>
          {/* In a real app, check for authentication and show user's name or logout button */}
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Your Groups</Typography>
          {/* A button to create a new group, if desired */}
          <Button variant="contained" color="primary">Create Group</Button>
        </Box>
        <GroupList />
      </Container>
    </>
  );
}

export default GroupsPage;