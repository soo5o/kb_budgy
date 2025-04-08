<template>
  <div class="detail-container">
    <MoneySummary></MoneySummary>
    <nav class="navbar navbar-light mt-3">
      <form class="container-fluid justify-content-start">
        <button class="btn btn-outline-success me-2" type="button">일일</button>
        <button class="btn btn-outline-secondary me-2" type="button">
          주간
        </button>
      </form>
    </nav>
    <AddButton></AddButton>
    <hr />
    <div v-for="(items, date) in groupedData" :key="date">
      <h6>{{ formatDate(date) }}</h6>
    </div>
  </div>
</template>

<script setup>
import AddButton from '@/components/AddButton.vue';
import MoneySummary from '@/components/MoneySummary.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
components: {
  AddButton, MoneySummary;
}

const router = useRouter();
const userStore = useUserStore();
const userId = computed(() => userStore.userInfo[0]?.id || 0);
console.log(userId.value);

const moneyList = ref([]);

onMounted(async () => {
  if (!userId) {
    alert('로그인 안됨!');
    router.push('/login');
  }

  const { data } = await axios.get(
    `http://localhost:3000/money?userId=${userId}`
  );

  moneyList.value = data.sort(
    (a, b) => new Date(b.consumptionDate) - a.consumptionDate
  );
});

//날짜 포맷 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
    ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  })`;
};

//날짜별 리스트
const groupedData = computed(() => {
  const group = {};
  moneyList.value.forEach((item) => {
    const date = item.comsumptionDate;
    if (!group[date]) {
      group[date] = [];
    }
    group[date].push(item);
  });
  return group;
});
</script>

<style scoped>
.detail-container {
  width: 480px;
  height: 100vh;
  position: relative;
  padding: 2rem;
}
hr {
  color: gray;
  box-shadow: 1px 1px 1px gray;
}
</style>
