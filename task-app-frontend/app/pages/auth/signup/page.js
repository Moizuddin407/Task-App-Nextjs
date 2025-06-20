'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" color="primary">Sign Up</Button>
        </Stack>
      </form>
    </Container>
  );
}
