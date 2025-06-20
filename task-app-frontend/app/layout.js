'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
} from '@mui/material';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { Provider } from 'react-redux';
import store from './store/store.js';

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('light');
  const pathname = usePathname();
  const router = useRouter();

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/pages/auth/signin');
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#f50057' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#f7f7f7' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  TaskApp
                </Typography>

                <Link href="/" passHref>
                  <Button color="inherit">Home</Button>
                </Link>

                <Link href="/pages/add-task" passHref>
                  <Button color="inherit">Add Task</Button>
                </Link>

                <Link href="/pages/about" passHref>
                  <Button color="inherit">About</Button>
                </Link>

                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>

                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{ ml: 2 }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>{children}</Container>

            {pathname === '/' && (
              <Fab
                color="primary"
                aria-label="add"
                href="/pages/add-task"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
              >
                <AddIcon />
              </Fab>
            )}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
