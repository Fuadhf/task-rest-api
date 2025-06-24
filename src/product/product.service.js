// bertujuan untuk handle business logic

const { findTask, findTaskById, insertTask, deleteTask, editTask } = require('./product.repository');

const getAllTask = async (userId, search, status, dueDate) => {
  const tasks = await findTask(userId, search, status, dueDate);
  
  if (!tasks || tasks.length === 0) {
    const error = new Error ('No task found');
    error.statusCode = 404;
    throw error;
  }
  return tasks;
};

const createNewTask = async (uId, title, description, dueDate) => {
  const task = await insertTask(uId, title, description, dueDate); 

  if (!title) {
    const error = new Error ('Title cannot be empty');
    error.statusCode = 400;
    throw error;
  }
  return task;
};

const getTaskById = async (id) => {
  const taskId = await findTaskById(id);
  
  if (!taskId) {
    const error = new Error ('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return taskId;
};

const editTaskById = async (id, title, description, dueDate, status) => {
  await getTaskById(id);
  const task = await editTask(id, title, description, dueDate, status);

  if (!title) {
    const error = new Error ('Title cannot be empty');
    error.statusCode = 400;
    throw error;
  }

  return task;
};

const deleteTaskById = async (id) => {
  await getTaskById(id);
  await deleteTask(id);
};

module.exports = { getAllTask, createNewTask, getTaskById, deleteTaskById, editTaskById };