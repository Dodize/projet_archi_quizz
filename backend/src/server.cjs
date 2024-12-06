const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth.cjs');
const account = require('./account.cjs');
const dotenv = require('dotenv');

const app = express();
const PORT = 3001;

dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', account);

app.listen(PORT, () => {
  console.log(`Serveur écoute sur le port ${PORT}`);
});