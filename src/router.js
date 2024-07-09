// router.js
import { createRouter, createWebHistory } from 'vue-router';

import Beranda_Mahasiswa from './views/Mahasiswa/Beranda/index.vue';
import Kelas from './views/Mahasiswa/Kelas/index.vue';
import KRS from './views/Mahasiswa/KRS/index.vue';
import Transkrip from './views/Mahasiswa/Transkrip/index.vue';

import Beranda_Dosen from './views/Dosen/Beranda/index.vue';
import MataKuliah from './views/Dosen/MataKuliah/index.vue';
import Riwayat from './views/Dosen/Riwayat/index.vue';

import Publikasi from './views/Publikasi.vue';
import Saran from './views/Saran.vue';
import Ujian from './views/Ujian.vue';
import Bimbingan from './views/Bimbingan.vue';

import Login from './views/Login.vue';
import Register from './views/Register.vue';

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { hideHeader: true, hideFooter: true } },
  { path: '/register', name: 'register', component: Register, meta: { hideHeader: true, hideFooter: true } },
  { path: '/', name: 'beranda', component: Beranda_Mahasiswa, meta: { roles: ['mahasiswa'] } },
  { path: '/kelas', name: 'kelas', component: Kelas, meta: { roles: ['mahasiswa'] } },
  { path: '/krs', name: 'krs', component: KRS, meta: { roles: ['mahasiswa'] } },
  { path: '/publikasi', name: 'publikasi', component: Publikasi, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/saran', name: 'saran', component: Saran, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/transkrip', name: 'transkrip', component: Transkrip, meta: { roles: ['mahasiswa'] } },
  { path: '/ujian', name: 'ujian', component: Ujian, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/bimbingan', name: 'bimbingan', component: Bimbingan, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/dosen/beranda', name: 'beranda_dosen', component: Beranda_Dosen, meta: { roles: ['dosen'] } },
  { path: '/mata-kuliah', name: 'mata_kuliah', component: MataKuliah, meta: { roles: ['dosen'] } },
  { path: '/riwayat', name: 'riwayat', component: Riwayat, meta: { roles: ['dosen'] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = router.options.auth;
  console.log('Navigating from:', from.name, 'to:', to.name);
  console.log('User Authenticated:', auth.isAuthenticated, 'User Role:', auth.role);

  if (!auth.isAuthenticated && to.name !== 'login' && to.name !== 'register') {
    console.log('Redirecting to login because user is not authenticated.');
    next({ name: 'login' });
  } else if (auth.isAuthenticated) {
    if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
      console.log('User role does not match the route roles, redirecting...');
      if (auth.role === 'dosen') {
        console.log('Redirecting to Dosen homepage.');
        next({ name: 'beranda_dosen' });
      } else {
        console.log('Redirecting to Mahasiswa homepage.');
        next({ name: 'beranda' });
      }
    } else {
      console.log('Proceeding as user role matches.');
      next();
    }
  } else {
    next();
  }
});

export default router;
