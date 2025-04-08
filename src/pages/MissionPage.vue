<template>
  <!-- 로딩 완료 후-->
  <div class="allWrap" v-if="!isLoading">
    <h1>Mission Page</h1>
    <br />
    <div id="viewGoal" class="card">
      <h4>{{ info[0].name }}님의 목표 금액</h4>
      <h1>{{ parseInt(userGoal.goal_amount).toLocaleString() }}</h1>
    </div>
    <br />
    <div class="d-flex justify-content-around">
      <input type="button" class="btn btn-secondary" value="목표 삭제" />
      <input type="button" class="btn btn-color" value="목표 수정" />
      <!-- 해당 userId를 id값으로 하는 goal 데이터 있으면 수정,삭제버튼 -->
    </div>
    <!-- v-if 사용해서 해당 userId를 id값으로 
   하는 goal 데이터 없으면 목표 추가버튼 -->
    <div class="d-flex justify-content-around">
      <input type="button" class="btn btn-color" value="목표 추가" />
    </div>
    <br />

    <div id="viewContinuous" class="card">
      <h2 class="card-title">~일째 미션 성공 중...</h2>
    </div>
    <br />
    <div id="viewCalendar">
      <v-date-picker v-model="selectedDate" is-inline :attributes="attrs">
      </v-date-picker>
    </div>
  </div>
  <!-- 로딩 중 -->
  <div v-else class="loading">
    <h2>로딩 중입니다...</h2>
  </div>
</template>

<script setup>
// pinia에서 user정보 가져오기
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
const router = useRouter();
const isLoading = ref(true);

const userStore = useUserStore();
userStore.loadUserInfo(); // 페이지 로드 시 저장된 유저 정보 불러오기

const info = computed(() => userStore.userInfo);

//db.json에 있는 goal들 불러오기
const goals = ref([]);
const userGoal = ref(undefined);
const successDate = ref([]);
onMounted(async () => {
  try {
    await userStore.loadUserInfo();
    console.log('유저 정보 로드됨:', info.value);
    if (!info.value) {
      console.log('로그인x.');
      // alert('로그인 후 이용 가능합니다.');
      // router.go(-1);
      return;
    }
    console.log('로그인', info.value[0].id);

    const response = await axios.get('http://localhost:3000/goal');
    goals.value = response.data;
    userGoal.value = goals.value.find((g) => g.userId == info.value[0].id);
    successDate.value = userGoal.value.successDate;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const selectedDate = ref(null);
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

<style scoped>
.allWrap {
  margin: 1rem;
  padding: 1rem;
  text-align: center;
}

#viewGoal h1,
#viewGoal h4 {
  text-align: left;
  margin: 1rem;
  padding: 0.2rem;
  font-weight: bolder;
}
#viewContinuous {
  padding: 1rem;
  font-weight: bold;
}
.card-title {
  font-weight: bold;
}
.btn-color {
  background-color: #4fcca4;
  color: #ffffff;
}
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
  color: #4fcca4;
}
</style>
