<script setup>
import Header from './components/Header.vue';
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from '@/stores/user.js';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const userStore = useUserStore();
userStore.loadUserInfo();

const route = useRoute();
const noPaddingRoutes = ['/', '/login', '/signup'];

const containerClass = computed(() => {
  return noPaddingRoutes.includes(route.path)
    ? 'container no-padding'
    : 'container with-padding';
});
</script>

<template>
  <div :class="containerClass">
    <Header v-if="!noPaddingRoutes.includes(route.path)" />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <BottomNav
      v-if="
        userStore.userInfo.length > 0 && !noPaddingRoutes.includes(route.path)
      "
    />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
}

/* 기본 패딩 적용 */
.with-padding {
  padding-top: 60px;
  padding-bottom: 64px;
}

/* 로그인/회원가입/홈 화면용: 패딩 없음 */
.no-padding {
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
