const express = require('express');
const router = express.Router();
const prisma = require('@prisma/client').PrismaClient;
const bcrypt = require('bcryptjs');

const prismaClient = new prisma();

// Route pour création de compte
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Vérifie si un utilisateur avec ce nom d'utilisateur existe déjà
    const existingUser = await prismaClient.joueur.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      // Si l'utilisateur existe, renvoyer une réponse d'erreur
      return res.status(400).json({ error: `Le nom d'utilisateur "${username}" est déjà utilisé.` });
    }

    // Création de l'utilisateur si le nom d'utilisateur est disponible
    const user = await prismaClient.joueur.create({
      data: {
        username: username,
        password: hashedPassword,
        argent: 0,
      },
    });

    res.json({ message: "Utilisateur créé", user });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

// Route pour connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("id :");
    console.log(username);
    const user = await prismaClient.joueur.findUnique({ where: { username } });
    console.log(user)

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