// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SelectionMenu from '../components/SelectionnerMenu.vue';
import Game from '../components/Game.vue';
import Connexion from '../components/Connexion.vue';

const routes = [
  {
    path: '/',
    name: 'SelectionMenu',
    component: SelectionMenu,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    props: route => ({
      category: route.query.category,
      difficulty: route.query.difficulty,
      nbQuestions: route.query.nbQuestions,
    }),
  },
  {
    path: '/connection',
    name: 'Connection',
    component: Connexion,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
