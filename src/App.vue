<template>
  <div id="app">
    <Header v-if="showHeader" :menuItems="menuItems" />
    <main :class="{ 'mobile-content': isMobile }">
      <router-view />
    </main>
    <FooterComponent v-if="showFooter" />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import FooterComponent from './components/Footer.vue';
import { ref, onMounted, watch, inject, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    Header,
    FooterComponent
  },
  setup() {
    const route = useRoute();
    const auth = inject('auth'); // Inject auth state
    const isMobile = ref(false);
    const menuItems = ref([]);

    const checkWindowSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const getMenuItems = (role) => {
      if (role === 'dosen') {
        return [
          { name: 'Beranda', path: '/dosen/beranda', icon: 'fas fa-home' },
          { name: 'Bimbingan', path: '/bimbingan', icon: 'fas fa-bullhorn' },
          { name: 'KRS', path: '/acc-krs', icon: 'fas fa-book' },
          { name: 'Mata Kuliah', path: '/mata-kuliah', icon: 'fas fa-book' },
          { name: 'Publikasi', path: '/publikasi', icon: 'fas fa-pencil-alt' },
          { name: 'Riwayat', path: '/riwayat', icon: 'fas fa-chart-line' },
          { name: 'Ujian', path: '/ujian', icon: 'fas fa-calendar' }
        ];
      } else {
        return [
          { name: 'Beranda', path: '/', icon: 'fas fa-home' },
          { name: 'Bimbingan', path: '/bimbingan', icon: 'fas fa-bullhorn' },
          { name: 'Kelas', path: '/kelas', icon: 'fas fa-calendar-check' },
          { name: 'KRS', path: '/krs', icon: 'fas fa-edit' },
          { name: 'Publikasi', path: '/publikasi', icon: 'fas fa-pencil-alt' },
          { name: 'Transkrip', path: '/transkrip', icon: 'fas fa-file-alt' },
          { name: 'Ujian', path: '/ujian', icon: 'fas fa-calendar' }
        ];
      }
    };

    
    const showHeader = computed(() => !route.meta.hideHeader);
    const showFooter = computed(() => !route.meta.hideFooter);

    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
      menuItems.value = getMenuItems(auth.role);
    });

    watch(() => auth.role, (newRole) => {
      menuItems.value = getMenuItems(newRole);
    });

    return { isMobile, menuItems, showHeader, showFooter };
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  flex-shrink: 0;
}
main {
  flex-grow: 1;
  padding-top: 60px;
}
.mobile-content {
  padding: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
