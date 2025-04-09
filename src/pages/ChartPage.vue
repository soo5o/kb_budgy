<template>
  <div class="p-3">
    <div class="flex items-center mb-4">
      <label class="mr-2 font-medium">월 선택 : </label>&nbsp;
      <select v-model="selectedMonth" class="border rounded px-2 py-1 text-sm">
        <option v-for="month in months" :key="month" :value="month">
          {{ month }}
        </option>
      </select>
    </div>

    <!-- 수입/지출 표시 -->
    <div class="mb-2 font-medium text-right">
      <template v-if="selectedMonth === '전체'">
        {{ chartType === 'expense' ? '총 지출:' : '총 수입:' }}
        <span class="text-indigo-600">{{ totalAmount.toLocaleString() }}원</span>
      </template>
      <template v-else>
        {{ chartType === 'expense' ? '지출' : '수입' }}
        <span class="text-sm text-gray-500 ml-1">({{ selectedMonth }}) : </span>
        <span class="text-indigo-600">{{ totalAmount.toLocaleString() }}원</span>
      </template>
    </div>

    <!-- 버튼 부분 -->
    <div class="button-group" style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-bottom: 1rem">
      <button
        @click="chartType = 'expense'"
        :style="
          chartType === 'expense'
            ? 'background-color: #4FCCA4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold;'
            : 'background-color: white; color: #4FCCA4; border: 1px solid #4FCCA4; padding: 6px 12px; border-radius: 4px;'
        "
      >
        지출 차트
      </button>
      <button
        @click="chartType = 'income'"
        :style="
          chartType === 'income'
            ? 'background-color: #4FCCA4; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold;'
            : 'background-color: white; color: #4FCCA4; border: 1px solid #4FCCA4; padding: 6px 12px; border-radius: 4px;'
        "
      >
        수입 차트
      </button>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-container relative w-full max-w-md mx-auto" style="height: 240px">
      <canvas ref="chartCanvas" class="absolute top-0 left-0 w-full h-full"></canvas>
    </div>

    <!-- 필터링 -->
    <label class="ml-4 flex items-center text-sm">
      <input type="checkbox" v-model="showByCategory" class="mr-1" />
      카테고리별 보기
    </label>

    <!-- 기존 차트 아래에 리스트 추가 -->
    <div class="mt-4">
      <ul class="list-group">
        <template v-if="showByCategory">
          <li
            v-for="category in filteredCategories"
            :key="category"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <span
                class="rounded-circle me-2"
                :style="{
                  backgroundColor: backgroundColorMap[category],
                  width: '12px',
                  height: '12px',
                  display: 'inline-block',
                }"
              ></span>
              <span class="text-sm text-dark">{{ category }}</span>
            </div>
            <span class="rounded-pill text-sm ms-3"> {{ categoryMap[category].toLocaleString() }}원 </span>
          </li>
        </template>

        <template v-else>
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            class="list-group-item"
            @click="toggleTooltip(index)"
            style="cursor: pointer"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-truncate">
                <span
                  class="rounded-circle me-2"
                  :style="{
                    backgroundColor: backgroundColorMap[item.category],
                    width: '12px',
                    height: '12px',
                    display: 'inline-block',
                  }"
                ></span>
                <span class="text-muted small">{{ item.category }} · {{ item.date }}</span>
              </div>
              <span class="rounded-pill"> {{ item.amount.toLocaleString() }}원 </span>
            </div>

            <!-- 툴팁 -->
            <div
              v-if="tooltipIndex === index"
              class="mt-2 px-3 py-2 bg-gray-100 text-sm text-gray-700 rounded border border-gray-300"
            >
              {{ item.memo || '메모가 없습니다.' }}
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

Chart.register(...registerables);

const chartCanvas = ref(null);
let chartInstance = null;
const activeIndex = ref(null); // 클릭된 항목 인덱스 저장

const categoryMap = ref({});
const filteredCategories = ref([]);

const chartType = ref('expense'); // 'expense' 또는 'income'
const showByCategory = ref(true); // true면 카테고리별, false면 항목별
const filteredItems = ref([]); // 항목별로 보여줄 리스트

const userStore = useUserStore();

const tooltipIndex = ref(null);

const toggleTooltip = (index) => {
  tooltipIndex.value = tooltipIndex.value === index ? null : index;
};

const selectedMonth = ref('전체');
const totalAmount = ref(0);

const months = ref([
  '전체',
  '2025-01',
  '2025-02',
  '2025-03',
  '2025-04',
  '2025-05',
  '2025-06',
  '2025-07',
  '2025-08',
  '2025-09',
  '2025-10',
  '2025-11',
  '2025-12',
]);

const categories = ['식비', '주거', '교통', '취미', '쇼핑', '건강', '가족', '교육', '금융', '기타'];

const backgroundColorMap = {
  식비: '#4f46e5', // 인디고
  주거: '#06b6d4', // 시안
  교통: '#facc15', // 밝은 노랑
  취미: '#f472b6', // 연한 핑크
  쇼핑: '#a78bfa', // 연보라
  건강: '#34d399', // 청록
  가족: '#fb923c', // 오렌지
  교육: '#f43f5e', // 강렬한 핑크
  금융: '#22c55e', // 초록
  기타: '#0ea5e9', // 하늘
};

const renderChart = async () => {
  userStore.loadUserInfo();
  const user = userStore.userInfo[0];

  if (!user) {
    alert('접근 권한이 없습니다.');
    return;
  }

  const userId = user.id;
  const res = await axios.get(`http://localhost:3000/money?userId=${userId}`);
  const allData = res.data;

  const targetData = allData.filter((item) => {
    const matchMonth = selectedMonth.value === '전체' || item.consumptionDate.startsWith(selectedMonth.value);
    const matchType = chartType.value ? item.type === chartType.value : true;
    return matchMonth && matchType;
  });

  const map = {};
  categories.forEach((category) => {
    map[category] = 0;
  });

  targetData.forEach((item) => {
    const amount = parseInt(item.amount);
    if (!isNaN(amount)) {
      const category = map.hasOwnProperty(item.category) ? item.category : '기타';
      map[category] += amount;
    }
  });

  totalAmount.value = targetData.reduce((sum, item) => {
    const amount = parseInt(item.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);

  categoryMap.value = map;

  filteredItems.value = targetData
    .map((item) => ({
      category: item.category,
      content: item.content,
      amount: parseInt(item.amount),
      date: item.consumptionDate,
      memo: item.memo || '',
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  filteredCategories.value = categories.filter((category) => categoryMap.value[category] > 0);
  let labels = filteredCategories.value;
  let values = labels.map((category) => categoryMap.value[category]);
  let backgroundColors = labels.map((c) => backgroundColorMap[c]);

  // 데이터 없으면 '회식' 차트 표시
  if (values.length === 0) {
    labels = [''];
    values = [1];
    backgroundColors = ['#D1D5DB']; // 회색 느낌
  }

  // 🔥 클릭한 항목만 hoverOffset을 크게
  const hoverOffsets = values.map((_, idx) => (idx === activeIndex.value ? 50 : 10));

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          hoverOffset: hoverOffsets, // ✨ 포인트: 여기에서 조각별 hover 크기 조정
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 14 } },
        },
      },
    },
    // 👇 클릭 이벤트 핸들러 추가
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        activeIndex.value = index === activeIndex.value ? null : index; // 토글
        renderChart(); // 다시 렌더링
      }
    },
  });
};

onMounted(renderChart);
watch([selectedMonth, chartType], renderChart);
</script>

<style scoped>
canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.chart-container {
  height: 240px;
  position: relative;
  padding: 16px;
  background-color: #ffffff;
  margin: 16px auto;
  transition: transform 0.2s ease;
}
</style>
