<template>
  <!-- 로딩 완료 후-->
  <div class="allWrap" v-if="!isLoading">
    <h1>Mission Page</h1>
    <br />
    <div class="hasGoal" v-if="userGoal && userGoal.goal_amount != null">
      <div id="viewGoal" class="card">
        <h4>{{ info[0].name }}님의 목표 금액</h4>
        <h1>{{ parseInt(userGoal.goal_amount).toLocaleString() }}</h1>
      </div>
      <br />
      <div class="d-flex justify-content-around">
        <input
          type="button"
          class="btn btn-secondary"
          value="목표 삭제"
          @click="deleteGoal(info[0].id)"
        />
        <input
          type="button"
          class="btn btn-color"
          value="목표 수정"
          @click="modifyGoal(info[0].id, 30000)"
        />
        <!-- 해당 userId를 id값으로 하는 goal 데이터 있으면 수정,삭제버튼 -->
      </div>
      <br />
      <div id="viewContinuous" class="card">
        <h3 class="card-title">
          <i class="fa-solid fa-thumbs-up" style="color: #4fcca4"></i> 이번 달,
          성공한 날 {{ successLength }}일!
        </h3>
      </div>
      <br />
    </div>

    <!-- v-if 사용해서 해당 userId를 id값으로 
   하는 goal 데이터 없으면 목표 추가버튼 -->
    <div class="noGoal" v-else-if="userGoal">
      <div id="viewGoal" class="card">
        <h4>{{ info[0].name }}님</h4>
        <h3>목표를 추가해주세요</h3>
      </div>
      <br />
      <div class="d-flex justify-content-around">
        <input
          type="button"
          class="btn btn-color"
          value="목표 추가"
          @click="showModal = true"
        />
        <AddGoalModal
          :visible="showModal"
          :userId="info[0].id"
          :successDate="successDate"
          @goal-added="addGoal"
          @close="showModal = false"
        />
      </div>
    </div>
    <br />

    <div id="viewCalendar">
      <v-date-picker
        v-model="selectedDate"
        is-inline
        :attributes="attrs"
        style="width: 400px"
      >
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
import { ref, computed, onMounted } from 'vue';
import AddGoalModal from '@/components/AddGoalModal.vue';
const showModal = ref(false);

import axios from 'axios';
const isLoading = ref(true);

const userStore = useUserStore();
userStore.loadUserInfo(); // 페이지 로드 시 저장된 유저 정보 불러오기

const info = computed(() => userStore.userInfo);

//db.json에 있는 goal 전부 불러오기
const goals = ref([]);
//userId에 해당하는 goal
const userGoal = ref(undefined);
const successDate = ref([]);
const successLength = ref([]);
const userMoneyList = ref([]); //userId 기준 쓴 돈 기록들
const savedDate = ref([]); //저장해둔 성공날짜들
const mergedDates = ref([]); //savedDate와 successDate 중복값 제거 후 합칠 것

onMounted(async () => {
  try {
    await userStore.loadUserInfo();
    console.log('유저 정보 로드됨:', info.value);
    if (!info.value) {
      console.log('로그인x.');
      return;
    }
    console.log('로그인', info.value[0].id);

    const response = await axios.get('http://localhost:3000/goal');
    goals.value = response.data;
    //로그인된 user id로 user의 goal 찾기
    userGoal.value = goals.value.find((g) => g.id == info.value[0].id);
    if (userGoal.value) {
      //미션 성공일 계산
      savedDate.value = userGoal.value.saved_date; //저장되어있는 날짜

      //userId로 해당 user의 moneyList 가져옴
      const responseMoney = await axios.get(
        'http://localhost:3000/money?userId=' +
          info.value[0].id +
          '&type=expense'
      );
      userMoneyList.value = responseMoney.data;

      //moneyList 있으면 날짜별로 money구하기
      const dayConsume = {};

      userMoneyList.value.forEach((item) => {
        const date = item.consumptionDate;
        const amount = parseInt(item.amount);
        if (!dayConsume[date]) {
          dayConsume[date] = 0;
        }
        dayConsume[date] += amount;
      });

      //goal의 goal_amount보다 money가 더 적으면 successDate 배열에 넣기
      for (const consume in dayConsume) {
        if (userGoal.value.goal_amount >= dayConsume[consume]) {
          successDate.value.push(consume);
        }
      }
      //savedDate와 successDate 겹치는 값 없애기 위해 합쳐서 set으로 중복값 제거
      mergedDates.value = [
        ...new Set([...successDate.value, ...savedDate.value]),
      ];

      //이번 달 성공일수 계산
      function calSuccess() {
        let todayMonth = new Date().getMonth(); //현재 달 구하기
        let length = 0;
        for (let mgDate of mergedDates.value) {
          let mgDateMonth = new Date(mgDate).getMonth();
          if (todayMonth == mgDateMonth) {
            length++;
          }
        }
        successLength.value = length;
      }
      calSuccess();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
const selectedDate = ref(new Date()); //오늘 기준으로 달력 표시
const attrs = computed(() => [
  {
    key: 'mission-success',
    highlight: {
      color: 'green',
      fillMode: 'outline',
    },
    dates: mergedDates.value,
  },
]);

//클릭이벤트(목표 추가, 목표 수정, 목표 삭제)
async function deleteGoal(userId) {
  try {
    //이전에 목표 성공한 내역들 저장하고 goal_amount null로
    const data = {
      id: userId,
      goal_amount: null,
      saved_date: mergedDates.value,
    };
    const response = await axios.put(
      `http://localhost:3000/goal/${userId}`,
      data
    );
    console.log(userGoal.value);
    userGoal.value.goal_amount = null; //화면에 반영하기 위해 userGoal 비워주기
  } catch (err) {
    console.log('deleteGoal error: ', err);
  }
}
async function modifyGoal(userId, amount) {
  try {
    const data = {
      id: userId,
      goal_amount: amount,
      saved_date: successDate.value,
    };
    const response = await axios.put(
      `http://localhost:3000/goal/${userId}`,
      data
    );
    userGoal.value = data; //화면에 반영하기 위해 userGoal 수정
  } catch (err) {
    console.log('modifyGoal error: ', err);
  }
}
async function addGoal() {
  try {
    showModal.value = false;
    isLoading.value = true;
    location.reload();
  } catch (err) {
    console.log('addGoal error: ', err);
  }
}
</script>

<style scoped>
.allWrap {
  margin: 1rem;
  padding: 1rem;
  text-align: center;
}

#viewGoal h3,
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
  color: #4caf50;
}
</style>
