import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Header from '../components/Header';
import GroupList from '../components/GroupList';
import CreateGroupDialog from '../components/CreateGroupDialog';

function GroupsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger refresh on GroupList

  const handleGroupCreated = () => {
    // Increment refreshKey to re-run GroupList useEffect
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">Your Groups</Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenCreateDialog(true)}>
            Create Group
          </Button>
        </Box>
        <GroupList refreshKey={refreshKey} />
      </Container>
      <CreateGroupDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreated={handleGroupCreated}
      />
    </>
  );
}

export default GroupsPage;