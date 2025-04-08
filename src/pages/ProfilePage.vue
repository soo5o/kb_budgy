<template>
  <div class="container">
    <img src="@/assets/logo.png" width="180px" />
    <h3 class="text-center fw-bold mt-1 mb-3 ms-3">{{ name }}님</h3>
    <!-- 비밀번호 변경 -->
    <strong>비밀번호 변경</strong>
    <input
      type="password"
      class="form-control"
      placeholder="기존 비밀번호를 입력해주세요"
    />
    <input
      type="password"
      class="form-control"
      placeholder="새로운 비밀번호를 입력해주세요"
    />
    <input
      type="password"
      class="form-control"
      placeholder="새로운 비밀번호를 재입력해주세요"
    />
    <button class="btn w-100">변경</button>
    <button class="btn w-100" @click="logout">로그아웃</button>
  </div>
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
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
