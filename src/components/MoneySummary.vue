<template>
  <div class="card-group">
    <div class="card">
      <h5 class="card-title">총 수입</h5>
      <p class="card-text">51651651원</p>
    </div>
    <div class="card">
      <h5 class="card-title">총 지출</h5>
      <p class="card-text">16515131원</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
//총 수입 계산하는 함수
const totalIncome = computed(() => {
  moneyList.value
    .filter((item) => item.type === 'income')
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
});
</script>

<style scoped>
.card {
  background-color: #e4f4ef;
  margin-top: 2rem;
  padding: 2rem;
}
.card-text {
  color: gray;
}
</style>
