<!-- SignUpPage.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div class="container d-flex justify-content-center align-content-center">
      <h1 class="fw-bolder text-center mb-5">회원가입</h1>
      <div>
        <div class="m-2 fw-bold">이름</div>
        <input
          class="form-control"
          type="text"
          placeholder="이름을 입력해주세요."
          v-model="userInfo.name"
        />
      </div>
      <div>
        <div class="m-2 fw-bold">이메일</div>
        <input
          class="form-control"
          type="email"
          placeholder="이메일을 입력해주세요."
          v-model="userInfo.email"
        />
      </div>
      <div>
        <div class="m-2 fw-bold">비밀번호</div>
        <input
          class="form-control"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          v-model="userInfo.password"
        />
      </div>
      <div>
        <div class="m-2 fw-bold">비밀번호 확인</div>
        <input
          class="form-control"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          v-model="confirmPassword"
        />
      </div>
      <div class="text-danger mt-2 ms-1">
        {{ msg }}
      </div>
      <button class="login-button mt-3 mb-3 fw-bold" type="submit">가입</button>
      <button class="sign-up-button fw-bold" @click="cancel">취소</button>
    </div>
  </form>
</template>
<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const userStore = useUserStore();

const router = useRouter();
const msg = ref('');
const confirmPassword = ref('');
const userInfo = ref({
  name: '',
  email: '',
  password: '',
});

const cancel = () => {
  router.push('/login');
};
const validateForm = () => {
  if (!userInfo.value.email) {
    msg.value = '이메일을 입력해주세요.';
    return false;
  }
  if (!userInfo.value.password) {
    msg.value = '비밀번호를 입력해주세요.';
    return false;
  }
  if (userInfo.value.password.length < 8) {
    msg.value = '비밀번호를 8글자 이상으로 설정해주세요.';
    return false;
  }
  if (userInfo.value.password != confirmPassword.value) {
    msg.value = '비밀번호가 일치하지 않습니다.';
    return false;
  }
  msg.value = '';
  return true;
};
const handleSubmit = async () => {
  if (!validateForm()) return;
  const checkAccount = await userStore.checkAccount(userInfo.value.email);
  if (!checkAccount) {
    console.log(checkAccount);
    msg.value = '이미 가입된 계정입니다.';
    return;
  }
  const response = await userStore.addUserInfo(userInfo.value);
  if (response) {
    alert('회원가입 완료! 로그인을 해주세요.');
    router.push('/login');
  }
};
</script>
<style scoped>
h1 {
  color: rgb(71, 71, 71);
}
input {
  height: 50px;
  background-color: #f9f9f9;
}
.container {
  height: 100vh;
  flex-direction: column;
}
button {
  height: 45px;
  color: white;
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 3px rgb(232, 232, 232);
}
button:hover {
  color: #f3f3f3;
  filter: brightness(1.05);
}
.login-button {
  background-color: #4fcca4;
  color: white;
}
.sign-up-button {
  background-color: rgb(174, 174, 174);
}
</style>
