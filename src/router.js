import { createRouter, createWebHistory } from 'vue-router';

// Mengimport view untuk pov Mahasiswa
import Beranda_Mahasiswa from './views/Mahasiswa/Beranda/index.vue';
import Kelas from './views/Mahasiswa/Kelas/index.vue';
import KRS from './views/Mahasiswa/KRS/index.vue';
import Transkrip from './views/Mahasiswa/Transkrip/index.vue';

// Mengimport view untuk pov Dosen
import Beranda_Dosen from './views/Dosen/Beranda/index.vue';
import MataKuliah from './views/Dosen/MataKuliah/index.vue';
import Riwayat from './views/Dosen/Riwayat/index.vue';

// Mengimport komponen induk
import Publikasi from './views/Publikasi.vue';
import Saran from './views/Saran.vue';
import Ujian from './views/Ujian.vue';
import Bimbingan from './views/Bimbingan.vue';

// Mengimport view untuk Login dan Register
import Login from './views/Login.vue';
import Register from './views/Register.vue';

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/', name: 'beranda', component: Beranda_Mahasiswa, meta: { roles: ['mahasiswa', 'dosen']  } },
  { path: '/kelas', name: 'kelas', component: Kelas, meta: { role: 'mahasiswa' } },
  { path: '/krs', name: 'krs', component: KRS, meta: { role: 'mahasiswa' } },
  { path: '/publikasi', name: 'publikasi', component: Publikasi, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/saran', name: 'saran', component: Saran, meta: { roles: ['mahasiswa', 'dosen'] } },
  { path: '/transkrip', name: 'transkrip', component: Transkrip, meta: { role: 'mahasiswa' } },
  { path: '/ujian', name: 'ujian', component: Ujian, meta: { roles: ['mahasiswa', 'dosen'] } },
  // { path: '/dosen', name: 'beranda_dosen', component: Beranda_Dosen, meta: { role: 'dosen' } },
  { path: '/mata-kuliah', name: 'mata_kuliah', component: MataKuliah, meta: { role: 'dosen' } },
  { path: '/riwayat', name: 'riwayat', component: Riwayat, meta: { role: 'dosen' } },
  { path: '/bimbingan', name: 'bimbingan', component: Bimbingan, meta: { roles: ['mahasiswa', 'dosen'] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware untuk mengarahkan ke login jika belum login dan memilih komponen yang benar berdasarkan peran
router.beforeEach((to, from, next) => {
  const auth = router.options.auth; // Pastikan objek auth ini diinisialisasi dengan benar
  console.log('Navigating from:', from.name, 'to:', to.name);
  console.log('User Authenticated:', auth.isAuthenticated, 'User Role:', auth.role);
  
  if (!['login', 'register'].includes(to.name) && !auth.isAuthenticated) {
    console.log('Redirecting to login because user is not authenticated.');
    next({ name: 'login' });
  } else if (auth.isAuthenticated) {
    if (to.meta.roles && to.meta.roles.includes(auth.role)) {
      console.log('User role is valid for this route.');
      next();
    } else if (to.meta.role && to.meta.role !== auth.role) {
      console.log('User role does not match the route role, redirecting...');
      // Redirect ke halaman yang sesuai dengan peran pengguna
      if (auth.role === 'dosen') {
        console.log('Redirecting to Dosen homepage.');
        next({ name: 'beranda_dosen' });
      } else {
        console.log('Redirecting to Mahasiswa homepage.');
        next({ name: 'beranda_mahasiswa' });
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
