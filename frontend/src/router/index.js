// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SelectionMenu from '../components/SelectionnerMenu.vue';
import Game from '../components/Partie.vue';

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
      categoryId: route.query.categoryId,
      categoryName: route.query.categorieName,
      difficulty: route.query.difficulty,
      nbQuestions: route.query.nbQuestions,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
