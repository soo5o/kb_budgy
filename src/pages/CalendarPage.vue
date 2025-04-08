<template>
  <div class="container mt-3">
    <!-- <div class="calendar-header">
      <div class="summary d-flex justify-content-between text-nowrap">
        <div class="text-center summary-block">
          <div class="text-end fw-bold">수입</div>
          <h5 class="month-income amount">
            {{ totalIncome.toLocaleString() }}원
          </h5>
        </div>
        <div class="text-center summary-block">
          <div class="text-center fw-bold">지출</div>
          <h5 class="month-expense amount">
            {{ totalExpense.toLocaleString() }}원
          </h5>
        </div>
        <div class="text-center summary-block">
          <div class="text-center fw-bold">합계</div>
          <h5 class="amount">
            {{ (totalExpense + totalIncome).toLocaleString() }}원
          </h5>
        </div>
      </div>
    </div> -->
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
import { ref } from 'vue';
import { useUserStore } from '@/stores/user.js';
const moneyList = ref([]);
const totalExpense = ref(0);
const totalIncome = ref(0);
const selectedDate = ref(null);
const userStore = useUserStore();
const calendarOptions = {
  locale: koLocale, // ← 한국어 설정
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  async datesSet(info) {
    //마지막 주 안보이게 하기
    //렌더링이 끝난 후 DOM 조작
    //여기서 월별 데이터 합산을 미리 계산
    userStore.loadUserInfo(); // 페이지 로드 시 저장된 유저 정보 불러오기
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
  },

  events: [
    {
      title: '-6,000',
      start: '2025-04-07',
      color: '#a069ba',
      extendedProps: {
        borderColor: '#a069ba',
        opacity: 0.8,
      },
    },
    {
      title: '+5,000',
      start: '2025-04-07',
      color: '#46b894',
      extendedProps: {
        borderColor: '#46b894',
        opacity: 0.8,
      },
    },
    {
      title: '+12,000,000',
      start: '2025-04-08',
      color: '#46b894',
      extendedProps: {
        borderColor: '#46b894',
        opacity: 0.8,
      },
    },
  ],
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
};
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
