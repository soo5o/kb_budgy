<template>
  <div class="container mt-3">
    <FullCalendar :options="calendarOptions" />
    <div class="fw-bold ms-3 mb-2">{{ selectedDate }}</div>
    <div class="list-group mb-3" ref="listRef">
      <div
        class="list-group-item p-2"
        v-for="(item, index) in moneyList.filter(
          (m) => m.consumptionDate === selectedDate
        )"
        :key="index"
      >
        <div class="list-detail ms-3">
          <div class="fw-bold">{{ item.memo }}</div>
          <div class="text-secondary detail-category">{{ item.category }}</div>
        </div>
        <div
          class="detail-amount me-2"
          :style="
            item.type === 'income' ? { color: '#4fcca4' } : { color: 'black' }
          "
        >
          {{ item.type === 'income' ? '+' : '-'
          }}{{ parseInt(item.amount).toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import koLocale from '@fullcalendar/core/locales/ko';
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ref, reactive, nextTick } from 'vue';
import { useUserStore } from '@/stores/user.js';
const moneyList = ref([]);
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const calendarEvents = ref([]);
const userStore = useUserStore();
const listRef = ref(null);
const calendarOptions = reactive({
  locale: koLocale,
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  async datesSet(info) {
    const userId = userStore.userInfo[0].id;
    const currentDate = new Date(info.view.currentStart); // 현재 보이는 시작 날짜
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    moneyList.value = await userStore.getMoneyList(userId, year, month);
    calendarEvents.value = generateDailySummaryEvents(moneyList.value); //일별 이벤트 생성
  },

  events: calendarEvents,
  eventDidMount(info) {
    const { borderColor, opacity } = info.event.extendedProps;
    if (borderColor) {
      info.el.style.border = `2px solid ${borderColor}`;
    }
    if (opacity) {
      info.el.style.backgroundColor = info.el.style.backgroundColor
        .replace('rgb', 'rgba')
        .replace(')', `, ${opacity})`);
    }
  },

  dayCellContent: function (arg) {
    return { html: String(arg.date.getDate()) };
  },
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'next',
  },
  dateClick(info) {
    selectedDate.value = info.dateStr; // 클릭한 날짜 저장
    selectedDate.value = info.dateStr;

    // 모든 날짜 셀 배경 초기화
    document.querySelectorAll('.fc-daygrid-day').forEach((el) => {
      el.style.backgroundColor = '';
    });

    // 선택한 날짜 셀 배경 변경
    const selectedCell = document.querySelector(
      `.fc-daygrid-day[data-date="${info.dateStr}"]`
    );
    if (selectedCell) {
      selectedCell.style.backgroundColor = '#e8f9f5'; //원하는 색상
    }
    scrollToList();
  },
  eventClick(info) {
    selectedDate.value = info.event.startStr;
    document.querySelectorAll('.fc-daygrid-day').forEach((el) => {
      el.style.backgroundColor = '';
    });
    const selectedCell = document.querySelector(
      `.fc-daygrid-day[data-date="${info.dateStr}"]`
    );
    if (selectedCell) {
      selectedCell.style.backgroundColor = '#e8f9f5';
    }
    scrollToList();
  },
});
function generateDailySummaryEvents(moneyList) {
  const dailyMap = {};

  for (const item of moneyList) {
    const date = item.consumptionDate; // 'YYYY-MM-DD'
    const amount = parseInt(item.amount);
    if (!dailyMap[date]) {
      dailyMap[date] = { income: 0, expense: 0 };
    }
    if (item.type === 'income') {
      dailyMap[date].income += amount;
    } else if (item.type === 'expense') {
      dailyMap[date].expense += amount;
    }
  }

  const events = [];

  for (const [date, { income, expense }] of Object.entries(dailyMap)) {
    if (income > 0) {
      events.push({
        title: `+ ${income.toLocaleString()}`,
        start: date,
        color: '#46b894',
        extendedProps: {
          borderColor: '#46b894',
          opacity: 0.8,
        },
      });
    }
    if (expense > 0) {
      events.push({
        title: `- ${expense.toLocaleString()}`,
        start: date,
        color: '#a069ba',
        extendedProps: {
          borderColor: '#a069ba',
          opacity: 0.8,
        },
      });
    }
  }
  return events;
}
function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress); // 부드러운 가속 감속

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(step);
}
function scrollToList() {
  nextTick(() => {
    if (listRef.value) {
      const offsetTop =
        listRef.value.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(offsetTop, 600); // 0.6초 동안 천천히 이동
    }
  });
}
</script>
<style scoped>
.detail-amount {
  display: flex;
  font-weight: 550;
  align-items: center;
}
.detail-category {
  font-size: 13px;
}
.list-group-item {
  display: flex;
  justify-content: space-between;
}
.amount {
  font-weight: bold;
  margin-top: 10px;
}
.calendar-header {
  width: 100%;
}
::v-deep .fc {
  width: 100%;
  min-height: 500px;
}
::v-deep .fc-button {
  background-color: inherit;
  color: #46b894;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
}
.container {
  margin: 0;
  padding: 0;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
/* 파란색 텍스트 없애기 */
::v-deep .fc-daygrid-day-number {
  color: #333; /* 기본 날짜 텍스트 색상 */
  text-decoration: none;
}
/* 헤더 요일 파란색 없애기 */
::v-deep .fc-col-header-cell-cushion {
  color: black;
  text-decoration: none;
}

/* 줄 없애기 */
::v-deep .fc-scrollgrid {
  border: none;
}

::v-deep .fc-scrollgrid td,
::v-deep .fc-scrollgrid th {
  border: none !important;
}
::v-deep .fc-scrollgrid tr {
  border: 1px solid rgb(229, 229, 229);
}
::v-deep .fc-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}
/* 요일 헤더 색상 바꾸기 (일~토) */
::v-deep .fc-col-header-cell {
  color: #333; /* 검정 계열로 */
  background-color: transparent;
}
::v-deep .fc-button:focus {
  outline: none !important;
  box-shadow: none !important;
}
.month-expense {
  color: #a069ba;
}
.month-income {
  color: #46b894;
}
</style>
