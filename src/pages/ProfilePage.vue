<template>
  <div class="container">
    <button class="btn fw-bold logout-btn" @click="logout">로그아웃</button>
    <img src="@/assets/logo.png" width="150px" />
    <h3 class="text-center fw-bold mt-1 mb-3 ms-3">{{ name }}님</h3>
    <div class="w-100 ps-2 fw-bold">개인정보 변경</div>
    <div v-if="!validatePwd" class="w-100">
      <input
        type="password"
        class="form-control p-2"
        placeholder="현재 비밀번호를 입력해주세요"
        v-model="currentPwd"
      />
      <div class="text-danger" v-if="alertDisplay">
        비밀번호가 일치하지 않습니다.
      </div>
      <button class="btn w-100 fw-bold" @click="checkPwd">확인</button>
    </div>
    <div class="w-100" v-else>
      <input type="text" class="form-control p-2" v-model="currentName" />
      <button class="btn w-100 fw-bold">이름 변경</button>
      <input
        type="password"
        class="form-control p-2 mt-2 mb-3"
        placeholder="새로운 비밀번호를 입력해주세요"
        v-model="nextPwd"
      />
      <input
        type="password"
        class="form-control p-2"
        placeholder="새로운 비밀번호를 재입력해주세요"
        v-model="rePwd"
      />
      <button class="btn w-100 fw-bold">비밀번호 변경</button>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
const currentPwd = ref('');
const currentName = ref('');
const nextPwd = ref('');
const rePwd = ref('');
const alertDisplay = ref(false);
const validatePwd = ref(false);
const router = useRouter();
const userStore = useUserStore();
const name = ref('');
name.value = userStore.userInfo[0].name;
currentName.value = userStore.userInfo[0].name;
function logout() {
  localStorage.clear(); // 전체 로컬스토리지 초기화
  userStore.clearUser(); // Pinia나 Vuex 쓴다면 user 상태도 초기화
  router.push('/login'); // 로그인 페이지로 이동
}
const checkPwd = () => {
  const myPwd = userStore.userInfo[0].password;
  console.log(myPwd);
  if (myPwd === currentPwd.value) {
    validatePwd.value = true;
    alertDisplay.value = false;
  } else {
    alertDisplay.value = true;
  }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
button:hover {
  color: #5d5d5d;
}
.logout-btn {
  position: absolute;
  top: 30px;
  right: 0;
  font-size: 0.9rem;
  color: #7d7d7d;
  padding: 5px 8px;
}
</style>
