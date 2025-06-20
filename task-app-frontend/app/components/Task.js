'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
} from '../store/taskSlice';

import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

export default function Task() {
  const dispatch = useDispatch();

  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTask({ title, description })).unwrap();
      setTitle('');
      setDescription('');
      showSnackbar('Task added successfully!');
    } catch {
      showSnackbar('Error adding task', 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await dispatch(updateTask({ id, title: editTitle, description: editDescription })).unwrap();
      setEditingTaskId(null);
      setEditTitle('');
      setEditDescription('');
      showSnackbar('Task updated successfully!');
    } catch {
      showSnackbar('Error updating task', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      showSnackbar('Task deleted successfully!');
    } catch {
      showSnackbar('Error deleting task', 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  return (
    
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Button variant="contained" color="primary" type="submit">
            Add Task
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {tasks?.length > 0 ? (
          tasks.map((task) => (
            <Grid item xs={12} md={6} key={task.id}>
              <Card>
                <CardContent>
                  {editingTaskId === task.id ? (
                    <Stack spacing={2}>
                      <TextField
                        label="Edit Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Edit Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                      />
                      <Box>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Save />}
                          onClick={() => handleUpdate(task.id)}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {task.description}
                      </Typography>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(task)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No tasks found!</Typography>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
