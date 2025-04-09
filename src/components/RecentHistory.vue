<template>
  <div class="recent-history">
    <p class="mt-5 fw-bold">가장 최근 내역</p>
    <ul class="list-group mt-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="list-group-item d-flex justify-content-between mb-3 rounded p-3 border border-1"
      >
        <div>
          <strong>{{ categoryEmoji(item.category) }}&nbsp;</strong>
          <small>{{ item.memo || '메모 없음' }}</small>
        </div>
        <span :style="{ color: item.type === 'income' ? '#4fcca4' : 'black' }"
          >{{ item.type === 'income' ? '+' : '-'
          }}{{ Number(item.amount).toLocaleString() }}원</span
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const categoryEmoji = (category) => {
  const map = {
    교통: '🚌',
    식비: '🍚',
    주거: '🏠',
    취미: '🎉',
    건강: '🩺',
    기타: '🧷',
    가족: '👪',
    교육: '👜',
    금융: '💳',
  };
  return map[category] || '💸';
};
</script>
