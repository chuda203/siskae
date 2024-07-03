<template>
    <div>
      <component :is="component" />
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';
  import SaranMahasiswa from './Mahasiswa/Saran/index.vue';
  import SaranDosen from './Dosen/Saran/index.vue';
  
  export default {
    setup() {
      const auth = inject('auth');
      return {
        component: auth.role === 'dosen' ? SaranDosen : SaranMahasiswa
      };
    }
  };
  </script>
  