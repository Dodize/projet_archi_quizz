// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SelectionMenu from '../components/SelectionnerMenu.vue';
import Partie from '../components/Partie.vue';
import Statistiques from '../components/Statistiques.vue';
import Connexion from '../components/Connexion.vue';
import InfosCompte from '../components/InfosCompte.vue';

const routes = [
  {
    path: '/',
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
    path: '/test',
    name: 'Test',
    component: Statistiques
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
