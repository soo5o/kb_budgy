<!-- ProfilePage.vue -->
<template>
  <div class="container">
    <button class="btn fw-bold logout-btn" @click="logout">로그아웃</button>
    <img src="@/assets/logo.png" width="120px" />
    <h3 class="text-center fw-bold mt-1 mb-3 ms-3">{{ name }}님</h3>
    <div class="w-100 ps-2 fw-bold">개인정보 변경</div>
    <div v-if="!validatePwd" class="w-100">
      <input
        type="password"
        class="form-control p-2"
        placeholder="현재 비밀번호를 입력해주세요"
        v-model="currentPwd"
      />
      <div class="text-danger ms-1 mt-1" v-if="alertDisplay">
        비밀번호가 일치하지 않습니다.
      </div>
      <button class="w-100 fw-bold check-btn btns" @click="checkPwd">
        확인
      </button>
    </div>
    <div class="w-100" v-else>
      <input type="text" class="form-control p-2" v-model="nextInfo.name" />
      <input
        type="password"
        class="form-control p-2 mt-2 mb-3"
        placeholder="새로운 비밀번호를 입력해주세요"
        v-model="nextInfo.password"
      />
      <input
        type="password"
        class="form-control p-2"
        placeholder="새로운 비밀번호를 재입력해주세요"
        v-model="rePwd"
      />
      <div class="text-danger ms-1 mt-1">{{ msg }}</div>
      <button class="fw-bold w-100 change-btn btns" @click="changeInfo">
        변경하기
      </button>
      <button
        class="fw-bold w-100 cancel-btn btns"
        @click="validatePwd = false"
      >
        취소
      </button>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
const currentPwd = ref('');
const nextInfo = ref({
  name: '',
  password: '',
});
const rePwd = ref('');
const msg = ref('');
const alertDisplay = ref(false);
const validatePwd = ref(false);
const router = useRouter();
const userStore = useUserStore();
const myInfo = userStore.userInfo[0];
const name = computed(() => userStore.userInfo[0]?.name || '');

nextInfo.value.name = myInfo.name;
function logout() {
  localStorage.clear(); // 전체 로컬스토리지 초기화
  userStore.clearUser(); // Pinia나 Vuex 쓴다면 user 상태도 초기화
  router.push('/login'); // 로그인 페이지로 이동
}
const checkPwd = () => {
  const myPwd = computed(() => userStore.userInfo[0]?.password || '');
  if (myPwd.value === currentPwd.value) {
    validatePwd.value = true;
    alertDisplay.value = false;
    currentPwd.value = '';
  } else {
    alertDisplay.value = true;
  }
};
const validateInfoForm = () => {
  if (nextInfo.value.name.length == 0) {
    msg.value = '이름을 한 글자 이상으로 설정해주세요.';
    return false;
  }
  if (nextInfo.value.password.length == 0 && rePwd.value.length == 0) {
    msg.value = '';
    return true;
  }
  if (nextInfo.value.password.length < 8) {
    msg.value = '비밀번호를 8글자 이상으로 설정해주세요.';
    return false;
  }
  if (nextInfo.value.password != rePwd.value) {
    msg.value = '비밀번호가 일치하지 않습니다.';
    return false;
  }
  msg.value = '';
  return true;
};
const changeInfo = async () => {
  if (validateInfoForm()) {
    const response = await userStore.changeUserInfo(myInfo, nextInfo.value);
    if (response) {
      alert('개인정보 수정 완료!');
      validatePwd.value = false;
      nextInfo.value.password = '';
      rePwd.value = '';
      router.push('/profile');
    }
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
.btns {
  height: 45px;
  color: white;
  border-radius: 10px;
  border: none;
  box-shadow: 0 2px 3px rgb(232, 232, 232);
  margin-top: 10px;
}
.change-btn,
.check-btn {
  background-color: #4fcca4;
}
.cancel-btn {
  background-color: rgb(174, 174, 174);
}
.btns:hover {
  color: #f3f3f3;
  filter: brightness(1.05);
}
.logout-btn {
  position: absolute;
  top: 30px;
  right: 0;
  font-size: 0.9rem;
  color: #7d7d7d;
  padding: 5px 8px;
}
.logout-btn:hover {
  color: #4fcca4;
}
</style>
