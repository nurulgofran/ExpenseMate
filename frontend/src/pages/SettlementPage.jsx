import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SettlementSummary from '../components/SettlementSummary';
import { Container, Typography } from '@mui/material';

function SettlementPage() {
  const { groupId } = useParams();

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" mb={2}>Settlement for Group {groupId}</Typography>
        <SettlementSummary groupId={groupId} />
      </Container>
    </>
  );
}

export default SettlementPage;