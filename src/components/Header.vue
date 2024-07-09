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
    <!-- Gambar profil dan modal -->
    <div class="profile-container">
      <img @click="showProfileModal = true" :src="profilePicture" alt="Profile Picture" class="profile-picture">
      <div v-if="showProfileModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Profil</h2>
          <img :src="profilePicture" alt="Profile Picture" class="profile-modal-picture">
          <p><strong>Nama:</strong> {{ auth.name }}</p>
          <p><strong>Email:</strong> {{ auth.email }}</p>
          <p><strong>Role:</strong> {{ auth.role }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';
import logo from '../assets/logo.png'; // Pastikan path ini benar
import profilePicture from '../assets/ic_profil.png';

export default {
  props: ['menuItems'],
  setup(props) {
    const isBlurred = ref(false);
    const showProfileModal = ref(false);
    const auth = inject('auth'); // Inject auth state

    const handleScroll = () => {
      isBlurred.value = window.scrollY > 0;
    };

    const closeModal = () => {
      showProfileModal.value = false;
    };

    const logout = () => {
      auth.isAuthenticated = false;
      auth.role = '';
      auth.name = '';
      auth.email = '';
      $cookies.remove('isAuthenticated');
      $cookies.remove('role');
      $cookies.remove('name');
      $cookies.remove('email');
      window.location.href = '/login'; // Redirect ke halaman login
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      console.log("Auth data on mount:", auth); // Debug auth data
      console.log("Header mounted, menuItems:", props.menuItems);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    watch(() => props.menuItems, (newVal) => {
      console.log("menuItems changed:", newVal);
    }, { deep: true });

    return { isBlurred, showProfileModal, closeModal, logout, logo, profilePicture, auth };
  }
}
</script>

<style scoped>
.menu-link.router-link-exact-active,
.menu-link.router-link-active {
  color: #f39c12; /* Warna untuk menandai link aktif */
  font-weight: bold; /* Membuat teks lebih tebal */
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

.profile-container {
  position: relative;
}

.profile-picture {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-modal-picture {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

/* Tambahkan ini untuk memastikan modal terlihat */
.modal p, .modal h2, .modal button {
  color: black;
}
</style>
