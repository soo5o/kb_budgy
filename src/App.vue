<script setup>
import AddPage from './pages/AddPage.vue';

components: {
  AddPage;
}
</script>

<template>
  <div class="container">
    <router-view></router-view>
    <AddPage></AddPage>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
