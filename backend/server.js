const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { registerUser, loginUser, authenticateUser } = require('./auth');

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/signup', registerUser);
app.post('/login', loginUser);
app.get('/protected', authenticateUser, (req, res) => {
  res.status(200).send('Protected resource');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
