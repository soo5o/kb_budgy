<!-- DetailPage.vue -->
<template>
  <div class="d-flex justify-content-center">
    <div class="detail-container">
      <MoneySummary :totalIncome="totalIncome" :totalExpense="totalExpense"></MoneySummary>
      <nav class="navbar navbar-light mt-3">
        <form class="container-fluid justify-content-start">
          <button
            :style="{
              backgroundColor: filterType === 'daily' ? '#4fcca4' : 'white',
              color: filterType === 'daily' ? 'white' : 'black',
              borderColor: filterType === 'daily' ? '' : 'rgb(174, 174, 174)',
            }"
            @click="filterType = 'daily'"
            class="btn me-2"
            type="button"
          >
            일일
          </button>
          <button
            :style="{
              backgroundColor: filterType === 'weekly' ? '#4fcca4' : 'white',
              color: filterType === 'weekly' ? 'white' : 'black',
              borderColor: filterType === 'weekly' ? '' : 'rgb(174, 174, 174)',
            }"
            @click="filterType = 'weekly'"
            class="btn me-2"
            type="button"
          >
            주간
          </button>
          <button
            :style="{
              backgroundColor: filterType === 'monthly' ? '#4fcca4' : 'white',
              color: filterType === 'monthly' ? 'white' : 'black',
              borderColor: filterType === 'monthly' ? '' : 'rgb(174, 174, 174)',
            }"
            @click="filterType = 'monthly'"
            class="btn me-2"
            type="button"
          >
            월간
          </button>

          <AddButton></AddButton>
        </form>
      </nav>
      <hr />
      <div v-for="(items, date) in groupedData" :key="date" class="mb-3">
        <h6 class="mb-2 fw-bold">{{ formatDate(date) }}</h6>
        <ul class="list-group">
          <li
            v-for="item in items"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-center p-3"
            @click="EditDelete(item.id)"
            style="cursor: pointer"
          >
            <div>
              <strong>{{ categoryEmoji(item.category) }}&nbsp;</strong>
              <small class="text-muted">{{ item.memo || '메모 없음' }}</small>
            </div>
            <span class="fw-bold" :style="{ color: item.type === 'income' ? '#4fcca4' : 'black' }">
              {{ item.type === 'income' ? '+' : '-' }}{{ Number(item.amount).toLocaleString() }}원
            </span>

            <!-- 수정 삭제 -->
            <div v-if="EditDeleteId === item.id">
              <button id="editMoneyItemButton" class="btn btn-success me-2" @click.stop="goToEditPage">수정</button>
              <button id="deleteMoneyItemButton" class="btn btn-danger" @click.stop="deleteMoneyItem">삭제</button>
            </div>
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
const EditDeleteId = ref([]);

// 수정, 삭제할 아이템
const EditDelete = (id) => {
  EditDeleteId.value = EditDeleteId.value === id ? null : id;
  console.log(`해당 항목 ID: ${id}`);
};

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

  const { data } = await axios.get(`http://localhost:3000/money?userId=${String(userId.value)}`);

  moneyList.value = data.sort((a, b) => new Date(b.consumptionDate) - new Date(a.consumptionDate));
};

//총 수입 계산하는 함수
const totalIncome = computed(() => {
  return moneyList.value.filter((item) => item.type === 'income').reduce((acc, cur) => acc + Number(cur.amount), 0);
});

//총 지출 계산하는 함수
const totalExpense = computed(() => {
  return moneyList.value.filter((item) => item.type === 'expense').reduce((acc, cur) => acc + Number(cur.amount), 0);
});

//날짜 포맷 함수
const formatDate = (dateStr) => {
  if (filterType.value === 'weekly') return dateStr;
  if (filterType.value === 'monthly') return `${dateStr.split('-')[1]}월`;
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
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

// 수정 화면으로 이동
const goToEditPage = () => {
  const id = EditDeleteId.value;
  router.push({ name: 'EditPage', params: { id } });
};

// 항목 삭제 함수
const deleteMoneyItem = async () => {
  const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
  if (isConfirmed) {
    try {
      console.log(EditDeleteId.value);
      await axios.delete(`http://localhost:3000/money/${EditDeleteId.value}`);
      console.log(`ID ${EditDeleteId.value} 삭제 완료`);
      await fetchData(); // 삭제 후 목록 갱신
      EditDeleteId.value = null; // 삭제 UI 닫기
    } catch (err) {
      console.error('삭제 중 오류:', err);
    }
  } else {
    console.log('사용자가 삭제를 취소함');
  }
};

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
  width: 100%;
  margin: 0 auto;
}
hr {
  color: gray;
  box-shadow: 1px 1px 1px gray;
}
form {
  position: relative;
}
</style>
