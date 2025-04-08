<template>
  <div class="container mt-3">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
<script setup>
import koLocale from '@fullcalendar/core/locales/ko';
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user.js';
const moneyList = ref([]);
const totalExpense = ref(0);
const totalIncome = ref(0);
const selectedDate = ref(null);
const calendarEvents = ref([]);
const userStore = useUserStore();
const calendarOptions = reactive({
  locale: koLocale,
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  async datesSet(info) {
    //userStore.loadUserInfo(); // 페이지 로드 시 저장된 유저 정보 불러오기 App.vue에 추가해서 괜찮을 듯?
    const userId = userStore.userInfo[0].id;
    console.log('userId', userId);
    const currentDate = new Date(info.view.currentStart); // 현재 보이는 시작 날짜
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    moneyList.value = await userStore.getMoneyList(userId, year, month);
    console.log(moneyList.value);
    totalExpense.value = moneyList.value.reduce((acc, cur) => {
      return cur.type === 'expense' ? acc + parseInt(cur.amount) : acc;
    }, 0);
    totalIncome.value = moneyList.value.reduce((acc, cur) => {
      return cur.type === 'income' ? acc + parseInt(cur.amount) : acc;
    }, 0);
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
    console.log('date: ', date, ', income: ', income);
    if (income > 0) {
      events.push({
        title: `+${income.toLocaleString()}`,
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
        title: `-${expense.toLocaleString()}`,
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
</script>
<style scoped>
.amount {
  font-weight: bold;
  margin-top: 10px;
}
.calendar-header {
  width: 100%;
}
.summary {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}
.summary-block {
  width: 100px; /* 고정 너비 설정으로 위치 흔들림 방지 */
  min-height: 60px; /* 높이도 어느 정도 고정되도록 */
}
::v-deep .fc {
  height: 100%;
  width: 100%;
}
::v-deep .fc-button {
  background-color: inherit;
  color: #46b894;
  /* color: #a069ba; */
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
}
.container {
  margin: 0;
  padding: 0;
  height: 100vh; /* 뷰포트 높이 전체 사용 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 스크롤 없애기 */
} /* 파란색 텍스트 없애기 */
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
.month-expense {
  color: #a069ba;
}
.month-income {
  color: #46b894;
}
</style>
