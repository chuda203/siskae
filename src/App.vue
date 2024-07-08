<template>
  <div id="app">
    <Header :menuItems="menuItems" v-if="auth.isAuthenticated" />
    <Sidebar v-if="auth.isAuthenticated && isMobile" :showSidebar="showSidebar" @show-content="showContent" />
    <main :class="{ 'mobile-content': isMobile && !showSidebar }">
      <router-view />
    </main>
    <FooterComponent v-if="auth.isAuthenticated && (!isMobile || !showSidebar)" />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import FooterComponent from './components/Footer.vue';
import { inject, ref, onMounted, watch } from 'vue';

export default {
  components: {
    Header,
    FooterComponent
  },
  setup() {
    const auth = inject('auth'); // Inject auth state
    const isMobile = ref(false);
    const showSidebar = ref(false); // Initially hide sidebar on mobile
    const menuItems = ref([]); // Initialize menu items based on user roles

    const checkWindowSize = () => {
      isMobile.value = window.innerWidth <= 768; // Adjust breakpoint as needed
      showSidebar.value = !isMobile.value; // Always show sidebar on desktop, hide on mobile
    };

    const getMenuItems = () => {
      console.log('Current role:', auth.role);
      return auth.role === 'dosen' ? [
        { name: 'Beranda', path: '/', icon: 'home' },
        { name: 'Bimbingan', path: '/bimbingan', icon: 'bullhorn' },
        { name: 'Mata Kuliah', path: '/mata-kuliah', icon: 'book' },
        { name: 'Publikasi', path: '/publikasi', icon: 'pencil-alt' },
        { name: 'Riwayat', path: '/riwayat', icon: 'chart-line' },
        { name: 'Saran', path: '/saran', icon: 'graduation-cap' },
        { name: 'Ujian', path: '/ujian', icon: 'calendar' }
      ] : [
        { name: 'Beranda', path: '/', icon: 'home' },
        { name: 'Bimbingan', path: '/bimbingan', icon: 'bullhorn' },
        { name: 'Kelas', path: '/kelas', icon: 'calendar-check' },
        { name: 'KRS', path: '/krs', icon: 'edit' },
        { name: 'Publikasi', path: '/publikasi', icon: 'pencil-alt' },
        { name: 'Saran', path: '/saran', icon: 'graduation-cap' },
        { name: 'Transkrip', path: '/transkrip', icon: 'file-alt' },
        { name: 'Ujian', path: '/ujian', icon: 'calendar' }
      ];
    };

    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize(); // Set initial window size status
      console.log('Role on mounted:', auth.role); // Check if the role is logged correctly
      menuItems.value = getMenuItems(); // Fetch menu items on component mount
    });

    watch(() => auth.role, (newRole) => {
      console.log('Role changed:', newRole);
      menuItems.value = getMenuItems(); // Update menu items when role changes
    });

    window.onunload = () => {
      window.removeEventListener('resize', checkWindowSize);
    };

    return { auth, isMobile, showSidebar, menuItems };
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
  padding-top: 60px; /* Menambahkan padding agar konten tidak tertutup header */
}
.mobile-content {
  padding: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
