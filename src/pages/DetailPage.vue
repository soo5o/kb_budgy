<template>
  <div class="d-flex justify-content-center">
    <div class="detail-container">
      <MoneySummary
        :totalIncome="totalIncome"
        :totalExpense="totalExpense"
      ></MoneySummary>
      <nav class="navbar navbar-light mt-3">
        <form class="container-fluid justify-content-start">
          <button
            @click="filterType = 'daily'"
            :class="[
              'btn me-2',
              filterType === 'daily' ? 'btn-success' : 'btn-outline-secondary',
            ]"
            type="button"
          >
            일일
          </button>
          <button
            @click="filterType = 'weekly'"
            :class="[
              'btn me-2',
              filterType === 'weekly' ? 'btn-success' : 'btn-outline-secondary',
            ]"
            type="button"
          >
            주간
          </button>
          <button
            @click="filterType = 'monthly'"
            :class="[
              'btn me-2',
              filterType === 'monthly'
                ? 'btn-success'
                : 'btn-outline-secondary',
            ]"
            type="button"
          >
            월간
          </button>

          <AddButton></AddButton>
        </form>
      </nav>
      <hr />
      <div v-for="(items, date) in groupedData" :key="date" class="mb-3">
        <h6 class="mb-2">{{ formatDate(date) }}</h6>
        <ul class="list-group">
          <li
            v-for="item in items"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ categoryEmoji(item.category) }}&nbsp;</strong>
              <small class="text-muted">{{ item.memo || '메모 없음' }}</small>
            </div>
            <span
              :class="item.type === 'income' ? 'text-primary' : 'text-danger'"
            >
              {{ item.type === 'income' ? '+' : '-'
              }}{{ Number(item.amount).toLocaleString() }}원
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddButton from '@/components/AddButton.vue';
import MoneySummary from '@/components/MoneySummary.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DatePicker } from 'v-calendar';

dayjs.extend(isoWeek);
components: {
  AddButton, MoneySummary, DatePicker;
}

const router = useRouter();
const userStore = useUserStore();
const moneyList = ref([]);
const filterType = ref('daily');
const dateRange = ref([]);

onMounted(() => {
  fetchData();
});

watch(
  () => router.fullPath,
  () => {
    fetchData();
  }
);

const fetchData = async () => {
  const userId = computed(() => userStore.userInfo[0]?.id || 0);
  console.log(userId.value);

  if (!userId) {
    alert('로그인 안됨!');
    router.push('/login');
  }

  const { data } = await axios.get(
    `http://localhost:3000/money?userId=${String(userId.value)}`
  );

  moneyList.value = data.sort(
    (a, b) => new Date(b.consumptionDate) - new Date(a.consumptionDate)
  );
};

//총 수입 계산하는 함수
const totalIncome = computed(() => {
  return moneyList.value
    .filter((item) => item.type === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

//총 지출 계산하는 함수
const totalExpense = computed(() => {
  return moneyList.value
    .filter((item) => item.type === 'expense')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});

//날짜 포맷 함수
const formatDate = (dateStr) => {
  if (filterType.value === 'weekly') return dateStr;
  if (filterType.value === 'monthly') return `${dateStr.split('-')[1]}월`;
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
    ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  })`;
};

//날짜별 리스트
const groupedData = computed(() => {
  const group = {};
  moneyList.value.forEach((item) => {
    const date = dayjs(item.consumptionDate);
    let key;

    switch (filterType.value) {
      case 'daily':
        key = date.format('YYYY-MM-DD');
        break;
      case 'weekly':
        key = `${date.year()}년 ${date.isoWeek()}주차`;
        break;
      case 'monthly':
        key = date.format('YYYY-MM');
        break;
      case 'range':
        key = date.format('YYYY-MM-DD');
      default:
        key = date.format('YYYY-MM-DD');
    }

    if (!group[key]) {
      group[key] = [];
    }
    group[key].push(item);
  });
  return group;
});

//이모지 매핑 함수
const categoryEmoji = (category) => {
  const map = {
    교통: '🚌',
    식비: '🍚',
    주거: '🏠',
    취미: '🎉',
    건강: '🩺',
    기타: '🧷',
    가족: '👪',
    교육: '👜',
    금융: '💳',
  };
  return map[category] || '💸';
};
</script>

<style scoped>
.detail-container {
  width: 480px;
  padding: 2rem;
}
hr {
  color: gray;
  box-shadow: 1px 1px 1px gray;
}
form {
  position: relative;
}
</style>
