<template>
  <div class="card-group">
    <div class="card">
      <h5 class="card-title">총 수입</h5>
      <p class="card-text">
        {{ totalIncome ? totalIncome.toLocaleString() : 0 }}원
      </p>
    </div>
    <div class="card">
      <h5 class="card-title">총 지출</h5>
      <p class="card-text">
        {{ totalExpense ? totalExpense.toLocaleString() : 0 }}원
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
defineProps({
  totalIncome: {
    type: Number,
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
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
