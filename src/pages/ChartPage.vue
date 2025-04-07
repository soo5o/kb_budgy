<template>
  <div class="p-4">
    <div class="flex items-center mb-4">
      <label class="mr-2 font-medium">월 선택:</label>
      <select v-model="selectedMonth" class="border rounded px-2 py-1 text-sm">
        <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
      </select>
    </div>

    <div class="mb-2 font-medium text-right">
      총 소비: <span class="text-indigo-600">{{ totalAmount.toLocaleString() }}원</span>
    </div>

    <div class="relative w-full" style="height: 220px">
      <canvas ref="chartCanvas" class="absolute top-0 left-0 w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useRoute } from 'vue-router';
import axios from 'axios';

Chart.register(...registerables);

const route = useRoute();
const chartCanvas = ref(null);
let chartInstance = null;

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

const categories = [
  '식비',
  '주거/통신',
  '교통',
  '여가/취미',
  '쇼핑/패션',
  '건강/의료',
  '가족/인간관계',
  '교육/자기계발',
  '금융/저축',
  '기타',
];

const backgroundColorMap = {
  식비: '#4f46e5',
  '주거/통신': '#06b6d4',
  교통: '#facc15',
  '여가/취미': '#f472b6',
  '쇼핑/패션': '#a78bfa',
  '건강/의료': '#34d399',
  '가족/인간관계': '#fb923c',
  '교육/자기계발': '#f43f5e',
  '금융/저축': '#22c55e',
  기타: '#0ea5e9',
};

const renderChart = async () => {
  const userId = route.params.userId;

  const res = await axios.get(`http://localhost:3000/money?userId=${userId}`);
  const allData = res.data;

  const filteredData =
    selectedMonth.value === '전체'
      ? allData
      : allData.filter((item) => item.consumptionDate.startsWith(selectedMonth.value));

  const categoryMap = {};
  categories.forEach((category) => {
    categoryMap[category] = 0;
  });

  filteredData.forEach((item) => {
    const amount = parseInt(item.amount);
    const category = categoryMap.hasOwnProperty(item.category) ? item.category : '기타';
    categoryMap[category] += amount;
  });

  totalAmount.value = filteredData.reduce((sum, item) => sum + parseInt(item.amount), 0);

  const filteredCategories = categories.filter((category) => categoryMap[category] > 0);
  const labels = filteredCategories;
  const values = filteredCategories.map((category) => categoryMap[category]);
  const backgroundColors = filteredCategories.map((c) => backgroundColorMap[c]);

  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14 },
          },
        },
      },
    },
  });
};

onMounted(renderChart);
watch(selectedMonth, renderChart);
</script>

<style scoped>
canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
