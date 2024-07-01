<template>
  <div id="app">
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar :showSidebar="showSidebar" @show-content="showContent" />
    <main v-if="!isMobile || !showSidebar" :class="{ 'mobile-content': isMobile && !showSidebar }">
      <router-view />
    </main>
    <FooterComponent v-if="!isMobile || !showSidebar" />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import FooterComponent from './components/Footer.vue';

export default {
  components: {
    Header,
    Sidebar,
    FooterComponent
  },
  data() {
    return {
      isMobile: false,
      showSidebar: false // Initially hide sidebar on mobile
    };
  },
  mounted() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize);
    this.$router.afterEach(this.checkRoute);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
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
      console.log('showContent called, hiding sidebar');
      this.showSidebar = false;
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
  padding: 80px;
}
.mobile-content {
  padding: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
