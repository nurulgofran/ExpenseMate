import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Header from '../components/Header';
import GroupList from '../components/GroupList';

function GroupsPage() {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Your Groups</Typography>
          {/* Add group creation feature in future */}
          <Button variant="contained" color="primary">Create Group</Button>
        </Box>
        <GroupList />
      </Container>
    </>
  );
}

export default GroupsPage;