import { createRouter, createWebHistory } from 'vue-router';
import Connexion from '../components/Connexion.vue';

const routes = [
  {
    path: '/',
    redirect: '/connexion'
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;