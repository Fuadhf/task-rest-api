const prisma = require('../db');

const findTask = async (userId, search, status, dueDate) => {
  console.log(status)
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(status && { status }),
      ...(dueDate && { due_date: new Date(dueDate) })
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  return tasks;
};

const findTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });
  return task;
};

const insertTask = async (uId, title, description, dueDate) => {
  const deadline = new Date();
  deadline.setHours(29, 59, 59, 999);
  const task = await prisma.task.create({
    data: {
      title,
      description,
      due_date: dueDate ? new Date(dueDate) : deadline,
      userId: uId
    }
  });
  return task;
};

const deleteTask = async (id) => {
  await prisma.task.delete({
    where: {
      id
    }
  });
};

const editTask = async (id, title, description, dueDate, status) => {
  const task = await prisma.task.update({
    where: {
      id
    },
    data: {
      title,
      description,
      due_date: dueDate,
      status
    }
  });
  return task;
}

module.exports = { findTask, findTaskById, insertTask, deleteTask, editTask };