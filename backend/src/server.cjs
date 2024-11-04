const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth.cjs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Permet toutes les origines
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Serveur écoute sur le port ${PORT}`);
});