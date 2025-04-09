import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flatpickr/dist/flatpickr.css';

import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});
app.mount('#app');
