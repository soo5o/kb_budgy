<template>
  <h1>Mission Page</h1>
  <div id="viewGoal" class="card">
    <h3 class="card-title">목표 금액</h3>
    <h1 class="card-text">50,000</h1>
  </div>
  <br />
  <div class="d-flex justify-content-around">
    <input type="button" class="btn btn-secondary" value="목표 삭제" />
    <input type="button" class="btn btn-success" value="목표 수정" />
    <!-- 해당 userId를 id값으로 하는 goal 데이터 있으면 수정,삭제버튼 -->
  </div>
  <!-- v-if 사용해서 해당 userId를 id값으로 
   하는 goal 데이터 없으면 목표 추가버튼 -->
  <div class="d-flex justify-content-around">
    <input type="button" class="btn btn-success" value="목표 추가" />
  </div>
  <br />

  <div id="viewContinuous" class="card">
    <h2 class="card-title">~일째 미션 성공 중...</h2>
  </div>
  <div id="viewCalendar">
    <v-date-picker v-model="selectedDate" is-inline :attributes="attrs">
    </v-date-picker>
  </div>
</template>

<script setup>
// pinia에서 user정보 가져오기
// 로그인 안 되어있으면 로그인하라는 문구 띄우기
import { ref, computed } from 'vue';
const selectedDate = ref(null);

const successDate = ref([new Date('2025-04-06'), new Date('2025-04-01')]);
const attrs = computed(() => [
  {
    key: 'mission-success',
    highlight: {
      color: 'green',
      fillMode: 'outline',
    },
    dates: successDate.value,
  },
]);
</script>

<style scoped></style>
