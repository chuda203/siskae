import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';
import './style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHome, faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine);

const app = createApp(App);

const authState = reactive({
  isAuthenticated: VueCookies.get('isAuthenticated') || false,
  role: VueCookies.get('role') || 'mahasiswa',
  name: VueCookies.get('name') || '',
  email: VueCookies.get('email') || ''
});

router.options.auth = authState;

app.use(VueCookies);
app.provide('auth', authState);

app.component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
