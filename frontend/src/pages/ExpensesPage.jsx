import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import { Container, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material';

function ExpensesPage() {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`/api/expenses/${groupId}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  }, [groupId]);

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" mb={2}>Expenses for Group {groupId}</Typography>
        {expenses.length > 0 ? (
          <List>
            {expenses.map(e => (
              <ListItem key={e.id}>
                <ListItemText
                  primary={`${e.description} - ${e.total_amount} EUR`}
                  secondary={`Paid by ${e.payerName}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No expenses recorded yet.
          </Typography>
        )}
        <ExpenseForm groupId={groupId} onAdded={handleExpenseAdded} />
        <Box mt={2}>
          <Button component={Link} to={`/groups/${groupId}/settlement`} variant="outlined">
            View Settlement
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default ExpensesPage;