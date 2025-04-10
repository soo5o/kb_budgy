<template>
  <div v-if="visible" class="modal-overlay">
    <div class="custom_modal">
      <h2 v-if="mode === 'add'">목표 금액 설정</h2>
      <h2 v-else-if="mode === 'modify'">목표 금액 수정</h2>
      <br />
      <form @submit.prevent="submitGoal">
        <input
          class="numberInput"
          type="number"
          v-model="goal_amount"
          placeholder="목표 금액(ex: 50000)"
          required
        /><br />
        <p v-if="Number(goal_amount) < 0" class="text-danger font-weight-bold">
          0원 이상 입력해주세요
        </p>
        <br />
        <div class="btns">
          <button
            class="btn btn-secondary abledButton"
            type="button"
            @click="$emit('close')"
          >
            닫기
          </button>
          <button
            type="submit"
            v-if="Number(goal_amount) < 0"
            disabled
            class="disabledButton"
          >
            완료
          </button>
          <button
            type="submit"
            class="okayButtonColor abledButton"
            v-if="Number(goal_amount) >= 0"
          >
            완료
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean,
  userId: String,
  mergedDates: Array,
  mode: String,
});
const emit = defineEmits(['goal-added', 'close']);

const goal_amount = ref('');

const resetForm = () => {
  goal_amount.value = '';
};
const today = new Date().toISOString().split('T')[0];
const submitGoal = async () => {
  //금액 양수로만 받는 거 검사추가하기
  try {
    console.log('props.userId: ', props.userId);
    const data = await axios.get(`http://localhost:3000/goal/${props.userId}`);
    console.log('기존 data: ', data);

    //기존 goal 있으면 put으로 수정
    await axios.put(`http://localhost:3000/goal/${props.userId}`, {
      id: props.userId,
      saved_date: props.mergedDates,
      goal_amount: { amount: goal_amount.value, start_date: today },
    });

    console.log('props.mergeDates: ', props.mergedDates);
    emit('goal-added'); //부모에게 목표 추가 알림
    resetForm();
  } catch (err) {
    if (err.response && err.response.status === 404) {
      //기존 goal 없으면 post로 추가
      await axios.post(`http://localhost:3000/goal`, {
        id: props.userId,
        saved_date: props.mergedDates,
        goal_amount: { amount: goal_amount.value, start_date: today },
      });
      emit('goal-added'); //부모에게 목표 추가 알림
    } else {
      console.error('에러: ', err);
      alert('등록에 실패했어요');
    }

    resetForm();
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.custom_modal {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  max-width: 90%;
  height: 300px;
  overflow-y: auto;
}
input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}
.btns {
  display: flex;
  justify-content: space-between;
}
.abledButton {
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  border-style: none;
}
.okayButtonColor {
  background-color: #4fcca4;
  color: #ffffff;
}
.disabledButton {
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 0.4rem;
  border-style: none;
}
h2 {
  font-weight: bold;
}
.numberInput {
  border-radius: 1rem;
}
</style>
