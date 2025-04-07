<template>
  <h1>Mission Page</h1>
  <div id="viewGoal" class="card">
    <h3 class="card-title">목표 금액</h3>
    <h1 class="card-text">50,000</h1>
  </div>
  <br />
  <div class="d-flex justify-content-around">
    <input type="button" value="목표 삭제" />
    <input type="button" value="목표 수정" />
    <!-- 해당 userId를 id값으로 하는 goal 데이터 있으면 수정,삭제버튼 -->
  </div>
  <!-- v-if 사용해서 해당 userId를 id값으로 
   하는 goal 데이터 없으면 목표 추가버튼 -->
  <div class="d-flex justify-content-around">
    <input type="button" value="목표 추가" />
  </div>
  <br />

  <div id="viewContinuous" class="card">
    <h2 class="card-title">~일째 미션 성공 중...</h2>
  </div>
  <div id="viewCalendar">
    <v-calendar
      ref="calendar"
      v-model="focus"
      color="primary"
      :type="type"
      :locale="'ko-KR'"
      :events="events"
      :format="customFormat"
      @click:date="viewDay"
      @change="updateRange"
    >
    </v-calendar>
  </div>
</template>

<script setup></script>

<style scoped></style>
