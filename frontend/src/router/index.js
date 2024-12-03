// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SelectionMenu from '../components/SelectionnerMenu.vue';
import Partie from '../components/Partie.vue';
import Connexion from '../components/Connexion.vue';
import InfosCompte from '../components/InfosCompte.vue';
import Accueil from '../components/Accueil.vue';
import GameOver from '../components/GameOver.vue';

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil,
  },
  {
    path: '/selectionMenu',
    name: 'SelectionMenu',
    component: SelectionMenu,
  },
  {
    path: '/game',
    name: 'Game',
    component: Partie,
    props: route => ({
      categoryId: route.query.categoryId,
      categoryName: route.query.categorieName,
      difficulty: route.query.difficulty,
      nbQuestions: route.query.nbQuestions,
    }),
  },
  {
    path: '/gameOver',
    name: 'GameOver',
    component: GameOver,
    props: route => ({
      nbQuestions: route.query.nbQuestions,
      gameOverReason: route.query.gameOverReason,
    }),
  },
  {
    path: '/connection',
    name: 'Connection',
    component: Connexion,
  },
  {
    path: '/account',
    name: 'InfosCompte',
    component: InfosCompte,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware pour vérifier si la route nécessite une authentification
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  // Si l'utilisateur essayer d'accéder à une route protégée sans être connecté, redirection login
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Connection' });
  // Si connecté, on le laisse aller à la page
  } else {
    next();
  }
});

export default router;
