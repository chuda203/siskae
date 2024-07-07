import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';  // Tambahkan import CSS di sini

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHome, faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine);

const app = createApp(App);

// Inisialisasi status autentikasi
const authState = reactive({
  isAuthenticated: false,
  role: 'mahasiswa' // default role
});

// Menambahkan authState ke router options
router.options.auth = authState;

app.provide('auth', authState); // Provide auth state

app.component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
