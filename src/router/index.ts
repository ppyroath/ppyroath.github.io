import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/pgr',
    name: 'PGR',
    component: () => import('../views/PgrView.vue'),
  },
  {
    path: '/wuwa',
    name: 'WuWa',
    component: () => import('../views/WuwaView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
