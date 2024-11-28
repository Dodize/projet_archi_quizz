const express = require('express');
const router = express.Router();
const prisma = require('@prisma/client').PrismaClient;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prismaClient = new prisma();

// Route pour création de compte
router.post('/register', async (req, res) => {
  const { username, password, argent, avatar } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Vérifie si un utilisateur avec ce nom d'utilisateur existe déjà
    const existingUser = await prismaClient.joueur.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      // Si l'utilisateur existe, renvoyer une réponse d'erreur
      return res.status(400).json({ error: `Username "${username}" is already used.` });
    }

    // Création de l'utilisateur si le nom d'utilisateur est disponible
    const user = await prismaClient.joueur.create({
      data: {
        username: username,
        password: hashedPassword,
        argent: argent,
        avatar: avatar,
      },
    });

    res.json({ message: "User successfully created", user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
});

// Route pour connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const player = await prismaClient.joueur.findUnique({ where: { username: username }, });

    if (!player || !await bcrypt.compare(password, player.password)) {
      return res.status(401).json({ error: "Wrong password" });
    } else {
        const token = jwt.sign(
          { id: player.id, username: player.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
      res.json({ message: "Login successful", token });
    }

  } catch (error) {
    res.status(500).json({ error: "An error occurred during the connection." });
  }
});

module.exports = router;