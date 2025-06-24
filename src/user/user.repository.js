const prisma = require('../db/index');
const bcrypt = require('bcrypt');
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

const validation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character')
];

module.exports = { insertUser, findUser, validation };