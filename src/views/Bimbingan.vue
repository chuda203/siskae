<template>
    <div>
      <component :is="component" />
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';
  import BimbinganMahasiswa from './Mahasiswa/Bimbingan/index.vue';
  import BimbinganDosen from './Dosen/Bimbingan/index.vue';
  
  export default {
    setup() {
      const auth = inject('auth');
      return {
        component: auth.role === 'dosen' ? BimbinganDosen : BimbinganMahasiswa
      };
    }
  };
  </script>
  