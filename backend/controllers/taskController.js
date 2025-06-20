const taskModel = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await taskModel.createTask({ title, description, userEmail: req.userEmail });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasksForUser(req.userEmail);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await taskModel.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskModel.updateTask(req.params.id, req.body, req.userEmail);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskModel.deleteTask(req.params.id, req.userEmail);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
