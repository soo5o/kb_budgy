<template>
  <nav class="bottom-nav" v-if="!isHiddenPage">
    <div class="d-flex w-100 h-100">
      <a
        v-for="tab in tabs"
        :key="tab.name"
        class="btn-tabbar"
        :class="{ selected: currentPath === tab.path }"
        @click.prevent="router.push(tab.path)"
        href="#"
      >
        <span class="ico">
          <i :class="tab.icon"></i>
        </span>
        <span class="txt">{{ tab.name }}</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const currentPath = computed(() => route.path);

const tabs = [
  { name: '홈', path: '/home', icon: 'fa-solid fa-house' },
  { name: '소비분석', path: '/chart', icon: 'fa-solid fa-chart-column' },
  { name: '달력', path: '/calendar', icon: 'fa-solid fa-calendar-days' },
  { name: '미션', path: '/mission', icon: 'fa-solid fa-bullseye' },
  { name: '회원정보', path: '/profile', icon: 'fa-solid fa-user' },
];

// 스플래시, 로그인, 회원가입 페이지에서는 숨김
const hiddenPaths = ['/', '/login', '/signup'];
const isHiddenPage = computed(() => hiddenPaths.includes(route.path));
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  z-index: 9999;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.btn-tabbar {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #6b7280;
  background-color: transparent;
}

.btn-tabbar .ico {
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 0.25rem;
}

.btn-tabbar.selected {
  color: #4fcca4;
  font-weight: bold;
  background-color: #e0e7ff;
}
</style>
