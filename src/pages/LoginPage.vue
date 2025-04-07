<!-- LoginPage.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div class="container d-flex justify-content-center align-content-center">
      <h1 class="fw-bolder text-center mb-5">Login</h1>
      <div>
        <div class="m-2 fw-bold">Email</div>
        <input
          class="form-control"
          type="email"
          placeholder="Enter your Email"
          v-model="userInfo.email"
        />
      </div>
      <div>
        <div class="m-2 fw-bold">Password</div>
        <input
          class="form-control"
          type="password"
          placeholder="Enter your password"
          v-model="userInfo.password"
        />
      </div>
      <div class="text-danger mt-2">
        {{ msg }}
      </div>
      <button class="login-button mt-3 mb-3" type="submit">Login</button>
      <button class="sign-up-button" @click="moveSignup">Sign Up</button>
    </div>
  </form>
</template>
<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
const msg = ref('');
const userStore = useUserStore();
const userInfo = ref({
  email: '',
  password: '',
});

const moveSignup = () => {
  router.push('/signup');
};
const validateForm = () => {
  if (!userInfo.value.email) {
    msg.value = '이메일을 입력해주세요';
    return false;
  }
  if (!userInfo.value.password) {
    msg.value = '비밀번호를 입력해주세요';
    return false;
  }
  return true;
};
const handleSubmit = async () => {
  const matchData = await userStore.matchUserInfo(
    userInfo.value.email,
    userInfo.value.password
  );
  if (!matchData) {
    msg.value = '회원정보가 일치하지 않습니다';
    return;
  }
  if (validateForm()) {
    router.push('/home');
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
.login-button {
  background-color: #4fcca4;
  color: white;
}
.sign-up-button {
  background-color: rgb(174, 174, 174);
}
</style>
