<template>
  <header class="header">
    <img src="@/assets/logoHeader.png" alt="로고" class="logo" />
    <!-- 필요시 메뉴나 버튼 추가 -->
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 57px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(87, 87, 87, 0.1);
  z-index: 100;
}

.logo {
  height: 38px;
}
</style>
