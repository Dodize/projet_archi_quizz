// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SelectionMenu from '../components/SelectionnerMenu.vue';
import Partie from '../components/Partie.vue';
import Connexion from '../components/Connexion.vue';
import InfosCompte from '../components/InfosCompte.vue';
import Acceuil from '../components/Acceuil.vue';
import GameOver from '../components/GameOver.vue';

const routes = [
  {
    path: '/',
    name: 'Acceuil',
    component: Acceuil,
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
