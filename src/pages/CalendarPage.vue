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
    {
      title: '지출',
      start: '2025-04-08',
      color: '#ff6060',
      extendedProps: {
        borderColor: '#ff384c',
        opacity: 0.8,
      },
    },
    {
      title: '수익',
      start: '2025-04-08',
      end: '2025-04-11',
      color: '#60b7ff',
      extendedProps: {
        borderColor: '#4c9dff',
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
};
</script>
<style scoped>
* {
  color: #4c9dff;
}
</style>
