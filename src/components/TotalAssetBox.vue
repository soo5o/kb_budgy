<template>
  <div class="total-asset-box card text-white text-center mb-4 rounded p-3">
    <h4 class="card-title">총 자산</h4>
    <h5 class="card-text">{{ total.toLocaleString() }}원</h5>
  </div>
</template>

<script setup>
defineProps({
  total: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.total-asset-box {
  background: linear-gradient(135deg, #4fcca4 0%, #d3ded7 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  border: none;
}
h4 {
  font-weight: bold;
}
h5 {
  font-weight: bold;
}
</style>
