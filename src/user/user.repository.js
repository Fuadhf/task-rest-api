const prisma = require('../db/index');
const bcrypt = require('bcrypt');
const { JSDOM } = require('jsdom')
const { window } = new JSDOM('');
const DOMurify = require('dompurify')(window);
const { body } = require('express-validator');

const insertUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  });
  return newUser;
};

const findUser = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });
  return user;
};

const sanitazeInput = value => {
  if (!value) return value;
  return DOMurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

const validation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 30 }).withMessage('Username max 30 character')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username only letters, numbers and underscore allowed')
    .customSanitizer(sanitazeInput),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 character')
    .matches(/[A-Z]/).withMessage('Password must contain capital leters')
    .matches(/0-9/).withMessage('Password must contain number')
];

module.exports = { insertUser, findUser, validation };