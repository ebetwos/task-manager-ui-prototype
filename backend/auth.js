// auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // This will be our in-memory user store

function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Invalid input data');
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).send('Username already taken');
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error hashing password');
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    users.push({ username, hashedPassword });
    res.status(201).send({ token });
  });
}

function loginUser(req, res) {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) return res.status(401).send('Unauthorized');
  bcrypt.compare(password, user.hashedPassword, (err, result) => {
    if (err || !result) return res.status(401).send('Unauthorized');
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    res.status(200).send({ token });
  });
}

function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).end();
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).end();
    req.user = user;
    next();
  });
}

module.exports = {
  registerUser,
  loginUser,
  authenticateUser
};
