import { createRouter, createWebHistory } from 'vue-router';
import MissionPage from '@/pages/MissionPage.vue';
import SplashPage from '@/pages/SplashPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import HomePage from '@/pages/HomePage.vue';
import AddPage from '@/pages/AddPage.vue';
import DetailPage from '@/pages/DetailPage.vue';
import ChartPage from '@/pages/ChartPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SplashPage,
    },
    {
      path: '/mission',
      name: 'mission',
      component: MissionPage,
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
      path: '/add',
      name: 'add',
      component: AddPage,
    },
    {
      path: '/detail',
      name: 'detail',
      component: DetailPage,
    },
    {
      path: '/chart/:userId',
      name: 'chart',
      component: ChartPage,
    },
  ],
});

export default router;
