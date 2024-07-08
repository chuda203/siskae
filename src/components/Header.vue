<template>
  <header :class="['header', { 'header-blur': isBlurred.value }]">
    <img :src="logo" alt="Campus Logo" class="logo">
    <!-- Navigasi untuk desktop -->
    <nav class="nav-menu">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" class="menu-link">{{ item.name }}</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import logo from '../assets/logo.png';

export default {
  props: ['menuItems'],
  setup(props) {
    const isBlurred = ref(false);

    const handleScroll = () => {
      isBlurred.value = window.scrollY > 0;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      console.log("Header mounted, menuItems:", props.menuItems); // Initial check on mount
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    // Watch for changes in menuItems
    watch(() => props.menuItems, (newVal, oldVal) => {
      console.log("menuItems changed:", newVal); // Log when menuItems change
    }, { deep: true });

    return { isBlurred, logo };
  }
}
</script>

<style scoped>
.menu-link.router-link-exact-active,
.menu-link.router-link-active {
  color: #f39c12; /* Warna untuk menandai link aktif */
  font-weight: bold; /* Membuat teks lebih tebal */
 /* text-shadow: 0 0 5px rgba(255,255,255,0.5); /* Menambahkan shadow untuk efek yang lebih menonjol */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: backdrop-filter 0.3s ease, background-color 0.3s ease;
}

.header-blur {
  backdrop-filter: blur(10px);
  background-color: rgba(44, 62, 80, 0.8);
}

.logo {
  height: 40px;
  width: auto;
}

.nav-menu {
  flex-grow: 1; /* Membuat nav-menu mengambil sisa ruang */
  display: flex;
  justify-content: flex-end; /* Menempatkan menu-list di ujung kanan */
}

.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-end; /* Menempatkan item menu di sebelah kanan */
  flex-grow: 1; /* Membuat menu-list mengambil sisa ruang */
}

.menu-list li {
  margin: 0 10px;
  position: relative;
}

.menu-list li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.menu-list li a:hover,
.menu-list li a:focus {
  color: #f39c12;
  text-shadow: 0 0 5px rgba(255,255,255,0.5);
}

/* Styling tambahan untuk responsivitas */
@media (max-width: 768px) {
  .header {
    justify-content: space-between;
    padding: 10px;
  }

  .nav-menu {
    display: none;
  }
}
</style>
