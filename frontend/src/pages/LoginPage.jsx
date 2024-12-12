import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, TextField, Button, Alert } from '@mui/material';
import Header from '../components/Header';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id); // Store the user ID
        navigate('/groups');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" mb={2} textAlign="center">Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>
          <Typography variant="body2" textAlign="center" mt={2}>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default LoginPage;