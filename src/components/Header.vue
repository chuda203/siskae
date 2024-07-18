<template>
  <header :class="['header', { 'header-blur': isBlurred }]">
    <!-- Navigasi untuk desktop -->
    <nav class="nav-menu" v-if="!isMobile">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" class="menu-link menu-link-hover">{{ item.name }}</router-link>
        </li>
      </ul>
    </nav>
    <!-- Gambar profil dan modal -->
    <div class="profile-container" v-if="!isMobile">
      <img @click="showProfileModal = true" :src="profilePicture" alt="Profile Picture" class="profile-picture">
      <div v-if="showProfileModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Profil</h2>
          <img :src="profilePicture" alt="Profile Picture" class="profile-modal-picture">
          <p><strong>Nama:</strong> {{ auth.name }}</p>
          <p><strong>Email:</strong> {{ auth.email }}</p>
          <p><strong>Role:</strong> {{ auth.role }}</p>
          <p><strong>User ID:</strong> {{ auth.user_id }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Bottom Navbar untuk Mobile -->
  <footer class="bottom-navbar" v-if="isMobile">
    <nav class="bottom-nav-menu">
      <ul class="bottom-menu-list">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" class="bottom-menu-link">
            <i :class="['fa', item.icon]"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </li>
        <!-- Ikon Profil untuk Mobile -->
        <li>
          <a @click="showProfileModal = true" class="bottom-menu-link">
            <i class="fa fa-user"></i>
            <span>Profil</span>
          </a>
        </li>
      </ul>
    </nav>
  </footer>

  <!-- Modal Profil untuk Mobile -->
  <div v-if="showProfileModal && isMobile" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>Profil</h2>
      <img :src="profilePicture" alt="Profile Picture" class="profile-modal-picture">
      <p><strong>Nama:</strong> {{ auth.name }}</p>
      <p><strong>Email:</strong> {{ auth.email }}</p>
      <p><strong>Role:</strong> {{ auth.role }}</p>
      <p><strong>User ID:</strong> {{ auth.user_id }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css'; // Pastikan path ini benar
import logo from '../assets/logo.png';
import profilePicture from '../assets/ic_profil.png';

export default {
  props: ['menuItems'],
  setup(props) {
    const isBlurred = ref(false);
    const showProfileModal = ref(false);
    const isMobile = ref(window.innerWidth <= 768);
    const auth = inject('auth'); // Inject auth state

    const handleScroll = () => {
      isBlurred.value = window.scrollY > 0;
    };

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const closeModal = () => {
      showProfileModal.value = false;
    };

    const logout = () => {
      auth.isAuthenticated = false;
      auth.role = '';
      auth.name = '';
      auth.email = '';
      auth.user_id = '';
      $cookies.remove('isAuthenticated');
      $cookies.remove('role');
      $cookies.remove('name');
      $cookies.remove('email');
      $cookies.remove('user_id');
      window.location.href = '/login'; // Redirect ke halaman login
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      console.log("Auth data on mount:", auth); // Debug auth data
      console.log("Header mounted, menuItems:", props.menuItems);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    });

    watch(() => props.menuItems, (newVal) => {
      console.log("menuItems changed:", newVal);
    }, { deep: true });

    return { isBlurred, showProfileModal, closeModal, logout, logo, profilePicture, auth, isMobile };
  }
}

</script>

<style scoped>
.menu-link.router-link-exact-active,
.menu-link.router-link-active {
  color: #3498db; /* Warna biru untuk menandai link aktif */
  font-weight: bold; /* Membuat teks lebih tebal */
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #1e2a38; /* Warna latar belakang yang cocok dengan biru */
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
  background-color: rgba(30, 42, 56, 0.8);
}

.nav-menu {
  flex-grow: 1;
  display: flex;
  justify-content: flex-start; /* Mengatur menu-list ke kiri */
}

.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-start; /* Mengatur item menu ke kiri */
  flex-grow: 1;
}

.menu-list li {
  margin: 0 10px;
  position: relative;
}

.menu-list li a {
  color: white;
  text-decoration: none;
  font-weight: bold; /* Membuat teks lebih tebal */
  font-size: 18px; /* Membesarkan font */
  transition: color 0.3s ease;
}

.menu-list li a:hover,
.menu-list li a:focus {
  color: #3498db; /* Warna biru untuk hover */
}

.menu-link-hover::before {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #3498db; /* Warna biru untuk hover underline */
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.menu-link-hover:hover::before {
  visibility: visible;
  width: 100%;
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

.modal p, .modal h2, .modal button {
  color: black;
}

/* Bottom Navbar untuk Mobile */
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e2a38;
  color: white;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  overflow-x: auto; /* Tambahkan ini */
}

.bottom-nav-menu {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.bottom-menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  justify-content: space-around;
  overflow-x: auto; /* Tambahkan ini */
  white-space: nowrap; /* Tambahkan ini */
}

.bottom-menu-list li {
  margin: 0 10px;
}

.bottom-menu-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: color 0.3s ease;
}

.bottom-menu-link i {
  font-size: 20px;
  margin-bottom: 5px;
}

.bottom-menu-link:hover,
.bottom-menu-link:focus {
  color: #3498db;
}

@media (max-width: 768px) {
  .header {
    display: none;
  }
}
</style>
