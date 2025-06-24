const express = require('express');
const { register, login, logout } = require('./user.auth');
const { validation } = require('./user.repository');
const { validationResult } = require('express-validator');
const router = express.Router();

router.post('/register', validation, async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      error: error.array()
    })
  }

  try {
    const { username, password } = req.body;
    const regist  =  await register(username, password);
    res.status(201).json({
      data: regist,
      message: 'Registered successfully'
    });
  } catch (err) {
    res.status(500).json({
      message: 'Register failed',
      error: err.message 
    });
  }
});

router.post('/login', async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json({
      error: errors.array()
    });
  }

  try {
    const { username, password } = req.body;
    await login(username, password, res);
    res.status(200).json({
      message: 'Login successfully'
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Failed to login'
    });
  }
});

router.post('/logout', logout);

module.exports = router;