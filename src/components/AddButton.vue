<template>
  <button @click="goToAddPage" class="addBtn">
    <i class="fa-solid fa-plus"></i>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToAddPage = () => {
  router.push('/add');
};
</script>

<style scoped>
.addBtn {
  background-color: #4fcca4;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  position: fixed;
  bottom: 12%;
  right: 3%;
  z-index: 1000;
}
</style>
