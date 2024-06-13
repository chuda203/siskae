import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
