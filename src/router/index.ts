import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/pgr/:tab(events|tools)?',
    name: 'PGR',
    component: () => import('../views/PgrView.vue'),
  },
  {
    path: '/wuwa/:tab(events|tools)?',
    name: 'WuWa',
    component: () => import('../views/WuwaView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
