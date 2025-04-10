<template>
  <div class="card-group">
    <div class="card income-card ps-5">
      <h5 class="card-title fw-bold text-white">총 수입</h5>
      <p class="card-text">
        {{ totalIncome ? totalIncome.toLocaleString() : 0 }}원
      </p>
    </div>
    <div class="card expense-card ps-5">
      <h5 class="card-title fw-bold text-white">총 지출</h5>
      <p class="card-text">
        {{ totalExpense ? totalExpense.toLocaleString() : 0 }}원
      </p>
    </div>
  </div>
</template>

<script setup>
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
  border: 1px solid #dedede;
  background-color: #e4f4ef;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.card-text {
  color: #ffffff;
  font-weight: bold;
  font-size: 1.3rem;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}
.card-group {
  border: none;
}
.income-card {
  background-color: #5cdeb5;
}
.expense-card {
  background-color: #be86d8;
}
</style>
