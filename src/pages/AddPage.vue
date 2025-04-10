<!-- AddPage.vue -->
<template>
  <div class="d-flex justify-content-center">
    <MoneyForm :onSubmitData="addMoneyItem" @cancel="goHome" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import MoneyForm from '@/components/MoneyForm.vue';

const router = useRouter();
const userStore = useUserStore();

const addMoneyItem = async (formData) => {
  const currentUserId = userStore.userInfo[0]?.id;

  try {
    await axios.post('http://localhost:3000/money', {
      ...formData,
      userId: currentUserId,
    });
    alert('성공');
    router.push('/detail');
  } catch (e) {
    console.log(e);
    alert('실패');
  }
};

const goHome = () => {
  router.push('/detail');
};
</script>
