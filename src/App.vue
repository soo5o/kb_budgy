<script setup>
import Header from './components/Header.vue';
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();
userStore.loadUserInfo();
</script>

<template>
  <div class="container">
    <Header></Header>
    <router-view></router-view>
    <BottomNav v-if="userStore.userInfo.length > 0" />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  position: relative;
  padding-top: 60px;
  padding-bottom: 64px; /* BottomNav 높이만큼 여백 확보 */
  box-sizing: border-box;
}
</style>
