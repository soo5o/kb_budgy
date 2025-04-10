<!-- components/MoneyForm.vue -->
<template>
  <div class="list-container p-5">
    <label class="w-100 mt-4">
      금액
      <input type="number" class="form-control mt-2" v-model="amount" />
    </label>
    <div class="form-check-inline mt-4">
      <input class="form-check-input" type="radio" name="moneyType" v-model="type" value="income" />
      <label class="form-check-label">&nbsp;수입</label>
    </div>
    <div class="form-check-inline">
      <input class="form-check-input" type="radio" name="moneyType" v-model="type" value="expense" />
      <label class="form-check-label">&nbsp;지출</label>
    </div>
    <label class="w-100 mt-4">
      카테고리
      <select class="form-select mt-2" v-model="category">
        <option disabled value="카테고리를 선택하세요.">카테고리를 선택하세요.</option>
        <option value="식비">🍚 생활/식비</option>
        <option value="주거">🏠 주거/통신</option>
        <option value="교통">🚌 교통/이동</option>
        <option value="취미">🎉 여가/취미</option>
        <option value="건강">🩺 건강/의료</option>
        <option value="가족">👪 가족/인간관계</option>
        <option value="교육">👜 교육/자기계발</option>
        <option value="금융">💳 금융/저축</option>
        <option value="기타">🧷 기타</option>
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

    <button class="btn mt-5 text-white" @click="onSubmit">{{ props.item ? '수정' : '추가' }}</button>
    <button class="btn mt-3 text-white" style="background-color: rgb(174, 174, 174)" @click="$emit('cancel')">
      취소
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  onSubmitData: Function,
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['cancel']);

const amount = ref(0);
const type = ref('income');
const category = ref('카테고리를 선택하세요.');
const consumptionDate = ref('');
const memo = ref('');

const onSubmit = () => {
  if (!amount.value || category.value === '카테고리를 선택하세요.' || !consumptionDate.value || !type.value) {
    alert('모든 항목을 입력해주세요!');
    return;
  }

  if (amount.value <= 0) {
    alert('금액은 0보다 커야 합니다!');
    return;
  }

  const formData = {
    ...(props.item ? { id: props.item.id } : {}), // ✅ 조건부로 id 포함
    amount: amount.value,
    category: category.value,
    consumptionDate: consumptionDate.value,
    memo: memo.value,
    type: type.value,
  };

  props.onSubmitData(formData);

  // 초기화할 수도 있음
  amount.value = 0;
  category.value = '카테고리를 선택하세요.';
  consumptionDate.value = '';
  memo.value = '';
  type.value = 'income';
};

// 수정 화면일 때 해당 값 표시
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      amount.value = newItem.amount;
      type.value = newItem.type;
      category.value = newItem.category;
      consumptionDate.value = newItem.consumptionDate;
      memo.value = newItem.memo;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.list-container {
  width: 100%;
  margin: 0 auto;
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
