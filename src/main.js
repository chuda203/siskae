import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import './style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Menambahkan ikon ke library
library.add(faEye, faEyeSlash);

const app = createApp(App);

const authState = reactive({
  isAuthenticated: VueCookies.get('isAuthenticated') || false,
  role: VueCookies.get('role') || 'mahasiswa',
  name: VueCookies.get('name') || '',
  email: VueCookies.get('email') || '',
  user_id: VueCookies.get('user_id') || '', // Inisialisasi user_id dari cookies jika ada
  department: VueCookies.get('department') || '', // Inisialisasi department dari cookies jika ada
  lecturer_id: VueCookies.get('lecturer_id') || '', // Inisialisasi lecturer_id dari cookies jika ada
  current_semester: VueCookies.get('current_semester') || '', // Inisialisasi current_semester dari cookies jika ada
  credit_quota: VueCookies.get('credit_quota') || '' // Inisialisasi credit_quota dari cookies jika ada
});

router.options.auth = authState;

app.use(VueCookies);
app.provide('auth', authState);

app.config.globalProperties.$axios = axios; // Add axios to global properties

app.use(Toast, {
  position: POSITION.TOP_CENTER, // Posisi toast
  timeout: 3000, // Durasi toast (ms)
  closeOnClick: true, // Tutup toast saat diklik
  pauseOnFocusLoss: true, // Jeda saat kehilangan fokus
  pauseOnHover: true, // Jeda saat hover
  draggable: true, // Toast bisa digeser
  draggablePercent: 0.6, // Persentase penggeseran
  showCloseButtonOnHover: false, // Tombol close muncul saat hover
  hideProgressBar: false, // Progress bar
  closeButton: "button", // Tombol close
  icon: true, // Ikon
  rtl: false, // Arah teks
  transition: "Vue-Toastification__fade", // Animasi transisi
});

app.component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
