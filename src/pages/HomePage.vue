<!-- HomePage.vue -->
<template>
  <div class="d-flex justify-content-center mb-3">
    <div class="home-container">
      <TotalAssetBox class="mt-3" :total="netAsset"></TotalAssetBox>
      <RecentHistory :items="recentItems"></RecentHistory>
      <div class="text-end mt-3">
        <button class="btn btn-custom w-100" @click="goToDetail">더보기</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import TotalAssetBox from '@/components/TotalAssetBox.vue';
import RecentHistory from '@/components/RecentHistory.vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';

const moneyList = ref([]);
const userStore = useUserStore();
const router = useRouter();

const fetchData = async () => {
  const userId = computed(() => userStore.userInfo[0]?.id || 0);
  console.log(userId.value);

  if (!userId) {
    alert('로그인이 필요합니다!');
    router.push('/login');
    return;
  }

  const { data } = await axios.get(
    `http://localhost:3000/money?userId=${String(userId.value)}`
  );

  moneyList.value = data.sort(
    (a, b) => new Date(b.consumptionDate) - new Date(a.consumptionDate)
  );
};

onMounted(() => {
  fetchData();
});

const recentItems = computed(() => moneyList.value.slice(0, 5));

const netAsset = computed(() => {
  const income = moneyList.value
    .filter((i) => i.type === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);

  const expense = moneyList.value
    .filter((i) => i.type === 'expense')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);

  return income - expense;
});

const goToDetail = () => {
  router.push('/detail');
};
</script>

<style scoped>
.home-container {
  width: 100%;
  margin: 0 auto;
}
.btn-custom {
  background-color: #fdfdfd;
  color: #4fcca4;
  border: 1px solid #4fcca4;
  border-radius: 10px;
  padding: 1rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}
.btn-custom:hover {
  background-color: #4fcca4;
  color: white;
}
</style>
