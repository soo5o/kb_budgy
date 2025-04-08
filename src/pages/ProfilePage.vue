<template>
  프로필 페이지
  <h2>{{ name }}님</h2>
  <button class="btn btn-outline-danger" @click="logout">로그아웃</button>
</template>
<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
const userStore = useUserStore();
const name = ref('');
name.value = userStore.userInfo[0].name;
function logout() {
  localStorage.clear(); // 전체 로컬스토리지 초기화
  userStore.clearUser(); // Pinia나 Vuex 쓴다면 user 상태도 초기화
  router.push('/login'); // 로그인 페이지로 이동
}
</script>
