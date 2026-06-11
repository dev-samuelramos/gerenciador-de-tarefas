import express from 'express';
import Task from './Task.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.id });
  await task.save();
  res.status(201).json(task);
});

router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Tarefa removida' });
});

export default router;
