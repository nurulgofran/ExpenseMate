import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function SettlementSummary({ groupId }) {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    fetch(`/api/settlements/${groupId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => setSettlements(data))
      .catch(err => console.error(err));
  }, [groupId]);

  if (settlements.length === 0) {
    return <Typography variant="body1" color="text.secondary">No settlements needed.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" mb={2}>Final Settlements</Typography>
      <List>
        {settlements.map((s, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={`${s.fromUserName} owes ${s.toUserName} ${s.amount} EUR`}
              secondary={`Bank: ${s.toUserBank || 'Not Provided'}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default SettlementSummary;