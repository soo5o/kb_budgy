<template>
  <button @click="goToAddPage" class="addBtn">+</button>
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
  position: absolute;
  top: 5%;
  right: 5%;
}
</style>
