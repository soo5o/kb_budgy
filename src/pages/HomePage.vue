<!-- HomePage.vue -->
<template>
  <h1>홈 페이지</h1>
  위에 헤더, 아래에 내비게이션 바 필요!
  {{ info }}
  {{ id }}
</template>
<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();
userStore.loadUserInfo(); // 페이지 로드 시 저장된 유저 정보 불러오기

const info = userStore.userInfo;
const id = info.length > 0 ? info[0].id : null; // 예시
</script>
