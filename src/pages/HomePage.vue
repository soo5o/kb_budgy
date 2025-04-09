<!-- HomePage.vue -->
<template>
  <div class="d-flex justify-content-center">
    <div class="home-container"></div>
  </div>
</template>
<script setup>
import TotalAssetBox from '@/components/TotalAssetBox.vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import axios from 'axios';

const moneyList = ref([]);
const userStore = useUserStore();
const router = useRouter();

const fetchData = async() => {
  const userId = userStore.userInfo[0]?.id || 0;

  if (!userId) {
    alert('로그인이 필요합니다!');
    router.push('/login');
    return;
  }

  const {data} = await axios.get(`http://localhost:3000/money?userId=${useId}`);

  moneyList.value = data.sort((a, b) => new Date(b.consumptionDate) - )
}
import { computed, useId } from 'vue';

const netAsset = computed(() => {});
</script>

<style scoped>
.home-container {
  width: 480px;
  padding: 2rem;
}
</style>
