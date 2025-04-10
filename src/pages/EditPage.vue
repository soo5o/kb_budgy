<!-- EditPage.vue -->
<template>
  <div class="d-flex jusifiy-content-center">
    <MoneyForm :item="item" :onSubmitData="editMoneyItem" @cancel="goHome"></MoneyForm>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import MoneyForm from '@/components/MoneyForm.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const item = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  const id = route.params.id;
  const { data } = await axios.get(`http://localhost:3000/money/${id}`);
  item.value = data;
  console.log(item.value);
});

const editMoneyItem = async (formData) => {
  const currentUserId = userStore.userInfo[0]?.id;
  isLoading.value = true;
  try {
    await axios.put(`http://localhost:3000/money/${formData.id}`, {
      ...formData,
      userId: currentUserId,
    });
    alert('수정 완료!');
    router.push('/detail');
  } catch (e) {
    console.log(e);
    alert('수정 실패');
  } finally {
    isLoading.value = false;
  }
};

const goHome = () => {
  router.push('/detail');
};
</script>
