const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('@prisma/client').PrismaClient;
require('dotenv').config();
const router = express.Router();

const prismaClient = new prisma();

// Middleware pour vérifier le JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Route pour changer le mot de passe
router.post('/change-password', authenticateJWT, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "The two passwords are required." });
  }

  try {
    // Récupérer l'utilisateur via l'ID contenu dans le token
    const user = await prismaClient.joueur.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Vérifier si l'ancien mot de passe est correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "The old password is incorrect." });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe dans la base de données
    await prismaClient.joueur.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while changing the password." });
  }
});

// Route pour récupérer les informations du joueur
router.get("/user-informations", authenticateJWT, async (req, res) => {

  try {
    // Récupération des infos en bd à partir de l'id du joueur
    const user = await prismaClient.joueur.findUnique({
      where: { id: req.user.id },
      select: {
        username: true,
        argent: true,
        avatar: true,
        partiesJouees: {
          select: {
            id: true,
            nbQuestions: true,
            nbBonnesReponses: true,
            indicesUtilises: true,
            categorie: true
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);

  } catch (error) {
    console.error("An error occurred during the recuperation of the profile :", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route pour changer l'avatar
router.post('/update-avatar', authenticateJWT, async (req, res) => {
  let { avatar } = req.body;
  avatar = avatar.replace('/img/', '');
  
  if (!avatar) {
    return res.status(400).json({ error: "Avatar required" });
  }

  try {
    // Mettre à jour l'avatar dans la base de données
    const updatedUser = await prismaClient.joueur.update({
      where: { id: user.id },
      data: { avatar : avatar },
    });

    res.json({
      message: "Avatar changed successfully.",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("An error occurred while changing the avatar :", error);
    res.status(500).json({ error: "An error occurred while changing the avatar." });
  }
});

// Partie statistiques de la partie
router.post('/partie', authenticateJWT, async (req, res) => {
  const partieBD = await prismaClient.partie.create({
    data: {
      joueurId: req.user.id,
      nbQuestions: req.body.nbQuestions,
      nbBonnesReponses: req.body.nbBonnesReponses,
      indicesUtilises: req.body.nbIndices,
      categorie: req.body.categorie
    },
  });
  res.json({ message: "Data saved", partieBD });
});


// Route pour changer l'avatar
router.post('/update-avatar', authenticateJWT, async (req, res) => {
  let { avatar } = req.body;
  avatar = avatar.replace('/img/', '');
  
  if (!avatar) {
    return res.status(400).json({ error: "Avatar required" });
  }

  try {
    // Récupérer l'utilisateur via l'ID contenu dans le token
    const user = await prismaClient.joueur.findUnique({
      where: { id: req.user.id },
      data: { avatar : avatar },
    });

    res.json({
      message: "Avatar changed successfully.",
      avatar: updatedUser.avatar,
    });

  } catch (error) {
    console.error("An error occurred while changing the avatar :", error);
    res.status(500).json({ error: "An error occurred while changing the avatar." });
  }
});

// Route pour changer le nombre d'indices
router.post('/update-indices', authenticateJWT, async (req, res) => {
  let { indices } = req.body;
  
  if (!indices) {
    return res.status(400).json({ error: "Number of hints required" });
  }

  try {
    // Mise à jour du nombre d'indices en base de données
    const updatedUser = await prismaClient.joueur.update({
      where: { id: req.user.id },
      data: { argent : indices },
    });

    res.json({
      message: "Number of hints changed successfully.",
      indices: updatedUser.argent,
    });
    
  } catch (error) {
    console.error("An error occurred while changing the number of hints :", error);
    res.status(500).json({ error: "An error occurred while changing the number of hints." });
  }
});

module.exports = router;