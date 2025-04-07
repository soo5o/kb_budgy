<template>
  <div class="container mt-3">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import koLocale from '@fullcalendar/core/locales/ko';
const calendarOptions = {
  //   locale: koLocale, // ← 한국어 설정
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  events: [
    { title: '지출', start: '2025-04-08', color: '#ff6060' },
    { title: '수익', start: '2025-04-08', end: '2025-04-11', color: '#60b7ff' },
  ],
};
</script>
<style scoped></style>
