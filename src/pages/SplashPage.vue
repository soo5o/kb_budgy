<template>
  <div class="splash-container">
    <transition name="fade">
      <img
        v-if="showLogo"
        src="@/assets/logo.png"
        alt="Logo"
        class="logo"
        width="200px"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const showLogo = ref(true);
const router = useRouter();

onMounted(() => {
  // 1초 후 로고 서서히 사라짐
  setTimeout(() => {
    showLogo.value = false;
  }, 1000);

  // 3초 후 로그인 페이지 이동
  setTimeout(() => {
    router.push('/login');
  }, 3000);
});
</script>

<style scoped>
.splash-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: white;
}

/* fade 트랜지션 정의 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logo {
  width: 150px;
  height: auto;
}
</style>
