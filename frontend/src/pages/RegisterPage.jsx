import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, TextField, Button, Alert } from '@mui/material';
import Header from '../components/Header';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', bankDetails: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" mb={2} textAlign="center">Register</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
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
            <TextField
              label="Bank Details"
              name="bankDetails"
              value={formData.bankDetails}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Optional"
            />
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
          <Typography variant="body2" textAlign="center" mt={2}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;