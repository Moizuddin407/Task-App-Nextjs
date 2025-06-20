'use client';

import { Container, Typography, Box, Divider } from '@mui/material';
import Task from './components/Task';
import ProtectedRoute from './components/protectedRoute.js';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Card,
  CardContent,
} from '@mui/material';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('./auth/signin');
    }
  }, [router]);

  return (
    <ProtectedRoute>
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to TaskApp 🚀
        </Typography>

        <Typography variant="h6" gutterBottom>
          Manage your tasks. Stay productive. Look good doing it.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Task />
        </Box>

        <Divider sx={{ my: 5 }} />

        <Typography variant="h4" gutterBottom>
          About Me 👨‍💻
        </Typography>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                sx={{ width: 100, height: 100, fontSize: 40 }}
              >
                A
              </Avatar>
              <Box>
                <Typography variant="h5">MOIZ UDDIN</Typography>
                <Typography color="text.secondary">
                  Full-Stack Engineer | Data Architect | Creative Technologist
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ mt: 3 }}>
              I craft intuitive web apps with clean code, build intelligent backend systems, and love exploring cutting-edge tools in cloud and data.
              I also enjoy theater, debating, and solving problems that matter. 💡
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
