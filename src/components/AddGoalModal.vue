<template>
  <div v-if="visible" class="modal-overlay">
    <div class="custom_modal">
      <h2>목표 금액 설정</h2>
      <form @submit.prevent="submitGoal">
        <input
          v-model="goal_amount"
          placeholder="목표 금액 (ex: 50000)"
          required
        />
        <div class="btns">
          <button type="submit">완료</button>
          <button type="button" @click="$emit('close')">닫기</button>
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
});
const emit = defineEmits(['goal-added', 'close']);

const goal_amount = ref('');

const resetForm = () => {
  goal_amount.value = '';
};

const submitGoal = async () => {
  //금액 양수로만 받는 거 검사추가하기
  try {
    const today = new Date().toISOString().split('T')[0];
    await axios.put(`http://localhost:3000/goal/${props.userId}`, {
      id: props.userId,
      saved_date: props.mergedDates,

      goal_amount: { amount: goal_amount.value, start_date: today },
    });
    console.log('props.mergeDates: ', props.mergedDates);
    emit('goal-added'); //부모에게 목표 추가 알림
    resetForm();
  } catch (err) {
    resetForm();
    alert('등록에 실패했어요');
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
}
input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}
textarea {
  resize: vertical;
}
.btns {
  display: flex;
  justify-content: space-between;
}
button {
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
