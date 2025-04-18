<template>
  <!-- 로딩 완료 후-->
  <div class="container" v-if="!isLoading">
    <br />
    <div class="hasGoal" v-if="userGoal && userGoal.goal_amount != null">
      <div id="viewGoal" class="card">
        <h4 class="text-center">{{ info[0].name }}님의 목표 금액</h4>
        <h3 class="fw-bold text-center">
          {{ parseInt(userGoal.goal_amount.amount).toLocaleString() }}원
        </h3>
        <br />
        <h5 class="text-center fw-bold">
          목표 설정일 : {{ userGoal.goal_amount.start_date }}
        </h5>
      </div>
      <br />
      <div class="d-flex justify-content-around">
        <input
          type="button"
          class="btn btn-color"
          value="목표 수정"
          @click="showModal = true"
        />
        <input
          type="button"
          class="btn"
          value="목표 삭제"
          @click="deleteGoal(info[0].id)"
          style="background-color: rgb(174, 174, 174); color: white"
        />
        <AddGoalModal
          :visible="showModal"
          :userId="info[0].id"
          :mergedDates="mergedDates"
          :mode="'modify'"
          @goal-added="addGoal"
          @close="showModal = false"
        />
      </div>
      <br />
      <div id="viewContinuous" class="card p-3">
        <h4 class="card-title text-center">
          <i class="fa-solid fa-thumbs-up" style="color: #4fcca4"></i>
          이번 달, 성공한 날 {{ successLength }}일!
        </h4>
      </div>
      <br />
    </div>

    <!-- v-if 사용해서 해당 userId를 id값으로 
   하는 goal 데이터 없으면 목표 추가버튼 -->
    <div class="noGoal" v-else-if="!userGoal || userGoal.goal_amount == null">
      <div id="viewGoal" class="card">
        <h4 class="text-center">{{ info[0].name }}님</h4>
        <h3 class="text-center">목표를 추가해주세요</h3>
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
          :mergedDates="mergedDates"
          :mode="'add'"
          @goal-added="addGoal"
          @close="showModal = false"
        />
      </div>
      <br />
      <div
        id="viewContinuous"
        class="card p-3"
        v-if="
          userGoal != null &&
          userGoal.goal_amount == null &&
          userGoal.saved_date != null
        "
      >
        <h4 class="card-title text-center">
          <i class="fa-solid fa-thumbs-up" style="color: #4fcca4"></i>
          이번 달, 성공한 날 {{ savedDateLength }}일!
        </h4>
      </div>
    </div>
    <br />

    <div id="viewCalendar" class="d-flex justify-content-center">
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

      if (userGoal.value.goal_amount != null) {
        //userGoal의 goal_amount의 amount가 null 이 아닐 때만 successDate 계산
        //userId로 해당 user의 moneyList 가져옴
        const responseMoney = await axios.get('http://localhost:3000/money', {
          params: {
            userId: info.value[0].id,
            type: 'expense',
          },
        });

        //goal의 startDate 이후만 구하기(startDate포함)
        userMoneyList.value = responseMoney.data.filter((item) => {
          return (
            new Date(item.consumptionDate) >=
            new Date(userGoal.value.goal_amount.start_date)
          );
        });

        console.log('userMoneyList(start이후인지확인)): ', userMoneyList.value);

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

        console.log('날짜별 사용자 구매: ', dayConsume);

        //goal의 goal_amount보다 money가 더 적으면 successDate 배열에 넣기
        for (const consume in dayConsume) {
          if (userGoal.value.goal_amount.amount >= dayConsume[consume]) {
            successDate.value.push(consume);
            console.log('push ', successDate.value);
          }
        }

        //소비 아예 없는 날도 미션 성공이므로 successDates에 추가
        function getDatesBetween(startDate, endDate) {
          const dates = [];
          const current = new Date(startDate);
          while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            dates.push(dateStr);
            current.setDate(current.getDate() + 1);
          }
          return dates;
        }
        const allDates = getDatesBetween(
          userGoal.value.goal_amount.start_date,
          new Date()
        );
        const usedDates = userMoneyList.value.map(
          (item) => item.consumptionDate
        );
        const noSpendDates = allDates.filter(
          (date) => !usedDates.includes(date)
        );
        successDate.value.push(...noSpendDates);
      }

      console.log('savedDate: ', savedDate.value);
      //savedDate와 successDate 겹치는 값 없애기 위해 합쳐서 set으로 중복값 제거
      if (savedDate.value != undefined) {
        mergedDates.value = [
          ...new Set([...successDate.value, ...savedDate.value]),
        ];
      }

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
    console.log('deleteGoal response: ', response);
    userGoal.value.goal_amount = null; //화면에 반영하기 위해 userGoal 비워주기
  } catch (err) {
    console.log('deleteGoal error: ', err);
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
const savedDateLength = computed(() => {
  const thisMonth = new Date().getMonth();
  return savedDate.value.filter(
    (date) => new Date(date).getMonth() === thisMonth
  ).length;
});
</script>

<style scoped>
.allWrap {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
