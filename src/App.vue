<script setup>
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(() => {
  userStore.loadUserInfo();
});
</script>

<template>
  <div class="container">
    <router-view></router-view>
    <BottomNav></BottomNav>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  position: relative;
  padding-bottom: 64px; /* BottomNav 높이만큼 여백 확보 */
  box-sizing: border-box;
}
</style>
