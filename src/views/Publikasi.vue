<template>
    <div>
      <component :is="component" />
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';
  import PublikasiMahasiswa from './Mahasiswa/Publikasi/index.vue';
  import PublikasiDosen from './Dosen/Publikasi/index.vue';
  
  export default {
    setup() {
      const auth = inject('auth');
      return {
        component: auth.role === 'dosen' ? PublikasiDosen : PublikasiMahasiswa
      };
    }
  };
  </script>
  