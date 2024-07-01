import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import PresensiKuliah from './views/PresensiKuliah.vue';
import AmbilKRS from './views/AmbilKRS.vue';
import RevisiKRS from './views/RevisiKRS.vue';
import KHS from './views/KHS.vue';
import KartuUjian from './views/KartuUjian.vue';
import Transkrip from './views/Transkrip.vue';
import JadwalKuliah from './views/JadwalKuliah.vue';
import JadwalUjian from './views/JadwalUjian.vue';
import Skripsi from './views/Skripsi.vue';
import Pengumuman from './views/Pengumuman.vue';
import Evaluasi from './views/Evaluasi.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/presensi-kuliah', component: PresensiKuliah },
  { path: '/ambil-krs', component: AmbilKRS },
  { path: '/revisi-krs', component: RevisiKRS },
  { path: '/khs', component: KHS },
  { path: '/kartu-ujian', component: KartuUjian },
  { path: '/transkrip', component: Transkrip },
  { path: '/jadwal-kuliah', component: JadwalKuliah },
  { path: '/jadwal-ujian', component: JadwalUjian },
  { path: '/skripsi', component: Skripsi },
  { path: '/pengumuman', component: Pengumuman },
  { path: '/evaluasi', component: Evaluasi }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});

export default router;
