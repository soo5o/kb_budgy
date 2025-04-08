<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.loadUserInfo();
});
</script>

<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
