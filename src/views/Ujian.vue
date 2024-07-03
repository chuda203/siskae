<template>
    <div>
      <component :is="component" />
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';
  import UjianMahasiswa from './Mahasiswa/Ujian/index.vue';
  import UjianDosen from './Dosen/Ujian/index.vue';
  
  export default {
    setup() {
      const auth = inject('auth');
      return {
        component: auth.role === 'dosen' ? UjianDosen : UjianMahasiswa
      };
    }
  };
  </script>
  