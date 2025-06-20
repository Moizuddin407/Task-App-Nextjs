'use client';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Divider,
} from '@mui/material';

export default function AboutPage() {
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        About Me 👨‍💻
      </Typography>
      <Divider sx={{ mb: 3 }} />

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
  );
}


