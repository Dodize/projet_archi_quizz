const express = require('express');
const router = express.Router();
const prisma = require('@prisma/client').PrismaClient;
const bcrypt = require('bcryptjs');

const prismaClient = new prisma();

// Route de création de compte
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prismaClient.joueur.create({
      data: {
        username: username,
        password: hashedPassword,
        mail: "", // Initialisé comme null
        argent: 0,
      },
    });
    res.json({ message: "Utilisateur créé", user });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prismaClient.joueur.findUnique({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: "Connexion réussie", user });
    } else {
      res.status(401).json({ error: "Identifiants incorrects" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
});

module.exports = router;