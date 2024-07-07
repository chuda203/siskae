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
import Sidebar from './components/Sidebar.vue';
import FooterComponent from './components/Footer.vue';
import { inject } from 'vue';

export default {
  components: {
    Header,
    Sidebar,
    FooterComponent
  },
  setup() {
    const auth = inject('auth'); // Inject auth state
    return { auth };
  },
  data() {
    return {
      isMobile: false,
      showSidebar: false, // Initially hide sidebar on mobile
      menuItems: [] // Initialize menu items based on user roles
    };
  },
  mounted() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize);
    this.$router.afterEach(this.checkRoute);
    this.menuItems = this.getMenuItems(); // Fetch menu items on component mount
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    checkWindowSize() {
      this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
      if (!this.isMobile) {
        this.showSidebar = true; // Always show sidebar on desktop
      } else {
        this.showSidebar = false; // Initially hide sidebar on mobile
      }
    },
    checkRoute(to, from) {
      if (this.isMobile) {
        this.showSidebar = false; // Hide sidebar on mobile when navigating
      }
    },
    showContent() {
      this.showSidebar = false;
    },
    getMenuItems() {
      // Implement fetching menu items based on user role or any other criteria
      return this.auth.role === 'dosen' ? [
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
    }
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
