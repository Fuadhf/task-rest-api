const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { insertUser, findUser } = require('./user.repository');

const checkUser = async username => {
  const user = await findUser(username);
  return user;
}

const register = async (username, password) => {
  await checkUser(username);
  if (user) {
    throw { message: 'Username already exist' }
  }

  const newUser = await insertUser(username, password);
  return newUser;
};

const login = async (username, password, res) => {
  const user = await checkUser(username);
  if (!user) {
    throw ('User not found')
  }

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) {
    return res.status(401).json({
      message: 'Invalid password'
    });
  }

  const token = jwt.sign({ 
    id: user.id, username: user.username 
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log(token)

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });

  return user;
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  });
  res.json({ message: 'Logout successfully'});
};

module.exports = { register, login, logout };