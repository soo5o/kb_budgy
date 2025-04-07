import { createRouter, createWebHistory } from 'vue-router';
import SplashPage from '@/pages/SplashPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ChartPage from '@/pages/ChartPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SplashPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/chart/:userId',
      name: 'chart',
      component: ChartPage,
    },
  ],
});

export default router;
