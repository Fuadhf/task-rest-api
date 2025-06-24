// Layer untuk handle request dan response
// biasanya juga handle body

const express = require('express');
const { getAllTask, createNewTask, getTaskById, deleteTaskById, editTaskById } = require('./product.service');
const authenticate = require('../middleware/middleware.auth')
const router = express.Router();

router.get('/tasks', authenticate, async (req, res, next) => {
  const userId = req.user.id;
  const {search, status, dueDate } = req.query;
  try {
    const tasks = await getAllTask(userId, search, status, dueDate);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get('/task/:id', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id;
    const task = await getTaskById(id);
    
    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/task', authenticate, async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    const uId = req.user.id;
    const task = await createNewTask( uId, title, description, dueDate);

    res.status(201).json({ 
      data: task,
      message: 'Add task successfuly'});
  } catch (err) {
    next(err);
  }
});

router.put('/task/:id', authenticate, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    console.log(taskId)
    const { title, description, dueDate, status } = req.body;
    const task = await editTaskById(taskId, title, description, dueDate, status);
    
    res.status(200).json({
      data: task,
      message: 'Update task successfuly'
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/task/:id', authenticate, async (req, res, next) => {
  try {
    const taskId= req.params.id;
    await deleteTaskById(taskId);
    res.status(200).json({
      status: 'success',
      message: 'Delete Task successfuly'
    })
  } catch (err) {
    next(err);
  }
});



module.exports = router;