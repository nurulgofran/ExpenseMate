import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ExpenseMate
        </Typography>
        {token ? (
          <>
            <Button component={Link} to="/groups" color="inherit">Groups</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" color="inherit">Login</Button>
            <Button component={Link} to="/register" color="inherit">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;