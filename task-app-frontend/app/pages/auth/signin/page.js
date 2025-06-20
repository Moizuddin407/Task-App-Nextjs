'use client';

import { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseApp from '../../../utils/firebaseClient.js'; // 🔥 Make sure this file exists!
import Link from 'next/link';

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', form);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleToken = await result.user.getIdToken();

      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: googleToken,
      });

      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      setError('Google sign-in failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Sign In 🔐
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoogleLogin}
          >
            Sign In with Google
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }} />

      <Typography align="center">
        Don’t have an account?{' '}
        <Link href="/pages/auth/signup" passHref>
          <Typography
            component="span"
            color="primary"
            fontWeight="bold"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign up here
          </Typography>
        </Link>
      </Typography>
    </Container>
  );
}
