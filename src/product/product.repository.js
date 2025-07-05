const prisma = require('../db');
const { body } = require('express-validator');
const { JSDOM } = require('jsdom')
const { window } = new JSDOM('');
const DOMPurify = require('dompurify')(window);

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

const sanitazeInput = value => {
  if (!value) return value;
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b', 'i', 'a'],
    ALLOWED_ATTR: ['href']
  })
}

const validation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title max 100 characters')
    .matches(/^[a-zA-Z0-9 .,!?-]+$/).withMessage('Title only letters, numbers and basic punctuation')
    .customSanitizer(sanitazeInput),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 2000 }).withMessage('Description max 2000 characters')
    .customSanitizer(value => sanitazeInput(value))
]

module.exports = { findTask, findTaskById, insertTask, deleteTask, editTask, validation };