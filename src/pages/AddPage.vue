<template>
  <div class="list-container p-5">
    <label class="w-100 mt-4">
      금액
      <input type="number" class="form-control mt-2" v-model="amount" />
    </label>
    <div class="form-check-inline mt-4">
      <input
        class="form-check-input"
        type="radio"
        name="moneyType"
        v-model="type"
        value="income"
      />
      <label class="form-check-label">&nbsp;수입</label>
    </div>
    <div class="form-check-inline">
      <input
        class="form-check-input"
        type="radio"
        name="moneyType"
        v-model="type"
        value="expense"
      />
      <label class="form-check-label">&nbsp;지출</label>
    </div>
    <label class="w-100 mt-4">
      카테고리
      <select class="form-select mt-2" v-model="category">
        <option selected value="카테고리를 선택하세요">
          카테고리를 선택하세요
        </option>
        <option value="food">🍚 생활/식비</option>
        <option value="home">🏠 주거/통신</option>
        <option value="transportation">🚌 교통/이동</option>
        <option value="hobby">🎉 여가/취미</option>
        <option value="health">🩺 건강/의료</option>
        <option value="family">👪 가족/인간관계</option>
        <option value="edu">👜 교육/자기계발</option>
        <option value="money">💳 금융/저축</option>
        <option value="guitar">🧷 기타</option>
      </select>
    </label>
    <label class="w-100 mt-4">
      날짜
      <input type="date" class="form-control mt-2" v-model="consumptionDate" />
    </label>
    <label class="w-100 mt-4">
      메모
      <input type="text" class="form-control mt-2" v-model="memo" />
    </label>
    <button class="btn mt-5 text-white" @click="addMoneyItem">추가</button>
    <button class="btn btn-secondary mt-3" @click="goHome">취소</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();

//인풋 창에서 입력 받을 값
const userId = ref('');
const amount = ref(0);
const category = ref('');
const consumptionDate = ref('');
const memo = ref('');
const type = ref('');

//항목 추가 함수
const addMoneyItem = async () => {
  if (
    !amount.value ||
    category.value === '카테고리를 선택하세요' ||
    !consumptionDate.value ||
    !type.value
  ) {
    alert('모든 항목을 입력해주세요!');
    return;
  }

  if (amount.value <= 0) {
    alert('금액은 0보다 커야 합니다!');
    return;
  }

  try {
    const newItem = {
      userId: userId.value,
      amount: amount.value,
      category: category.value,
      consumptionDate: consumptionDate.value,
      memo: memo.value,
      type: type.value,
    };

    await axios.post('http://localhost:3000/money', newItem);
    alert('성공');
    router.push('/detail');
  } catch (error) {
    console.log(error);
    alert('실패!');
  }
};

const goHome = () => {
  router.push('/home');
};
</script>

<style scoped>
.list-container {
  width: 480px;
  height: 100vh;
  border: 1px solid black;
  border-radius: 1rem;
}
input {
  background-color: #f5f4f4;
}
select {
  background-color: #f5f4f4;
}
.btn.mt-5 {
  background-color: #4fcca4;
}
.btn {
  width: 100%;
  font-weight: bold;
}
</style>
