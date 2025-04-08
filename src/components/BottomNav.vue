<!-- 임시 !!! 절대 제대로 안나옴. App.vue 의 <router-view> 밑에 <BottomNav /> 추가-->
<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow z-50"
  >
    <ul class="flex justify-around items-center py-2">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        @click="goTo(tab.path)"
        class="flex flex-col items-center text-sm cursor-pointer"
      >
        <div :class="isActive(tab.path) ? 'text-indigo-600' : 'text-gray-500'">
          <!-- <component :is="tab.icon" class="w-6 h-6" /> -->
        </div>
        <span :class="isActive(tab.path) ? 'text-indigo-600' : 'text-gray-500'">
          {{ tab.name }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

// 아이콘 (Heroicons 기준 예시 - Tailwind에서 추천)
// import {
//   HomeIcon,
//   ChartBarIcon,
//   CalendarIcon,
//   TargetIcon,
//   UserIcon,
// } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();

const tabs = [
  { name: '홈', path: '/home' },
  { name: '소비분석', path: '/analysis' },
  { name: '달력', path: '/calendar' },
  { name: '미션', path: '/mission' },
  { name: '회원정보', path: '/profile' },
];

const goTo = (path) => {
  router.push(path);
};

const isActive = (path) => route.path === path;
</script>

<style scoped>
nav {
  height: 64px;
}
</style>
