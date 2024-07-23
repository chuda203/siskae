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
          <button class="modal-close" @click="closeModal">&times;</button>
          <h2>Profil</h2>
          <img :src="profilePicture" alt="Profile Picture" class="profile-modal-picture">
          <p><strong>Nama:</strong> {{ auth.name }}</p>
          <p><strong>Email:</strong> {{ auth.email }}</p>
          <p><strong>Role:</strong> {{ auth.role }}</p>
          <p><strong>User ID:</strong> {{ auth.user_id }}</p>
          <button class="logout-button" @click="logout">Logout</button>
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
      <button class="modal-close" @click="closeModal">&times;</button>
      <h2>Profil</h2>
      <img :src="profilePicture" alt="Profile Picture" class="profile-modal-picture">
      <p><strong>Nama:</strong> {{ auth.name }}</p>
      <p><strong>Email:</strong> {{ auth.email }}</p>
      <p><strong>Role:</strong> {{ auth.role }}</p>
      <p><strong>User ID:</strong> {{ auth.user_id }}</p>
      <button class="logout-button" @click="logout">Logout</button>
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
/* Styling untuk link aktif */
.menu-link.router-link-exact-active,
.menu-link.router-link-active {
  color: #3498db; /* Warna biru untuk menandai link aktif */
  font-weight: bold; /* Membuat teks lebih tebal */
}

/* Styling untuk header */
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

/* Styling untuk header blur */
.header-blur {
  backdrop-filter: blur(10px);
  background-color: rgba(30, 42, 56, 0.8);
}

/* Styling untuk navigasi menu */
.nav-menu {
  flex-grow: 1;
  display: flex;
  justify-content: flex-start; /* Mengatur menu-list ke kiri */
}

/* Styling untuk daftar menu */
.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-start; /* Mengatur item menu ke kiri */
  flex-grow: 1;
}

/* Styling untuk item menu */
.menu-list li {
  margin: 0 10px;
  position: relative;
}

/* Styling untuk link menu */
.menu-list li a {
  color: white;
  text-decoration: none;
  font-weight: bold; /* Membuat teks lebih tebal */
  font-size: 18px; /* Membesarkan font */
  transition: color 0.3s ease;
}

/* Styling untuk hover dan focus pada link menu */
.menu-list li a:hover,
.menu-list li a:focus {
  color: #3498db; /* Warna biru untuk hover */
}

/* Styling untuk hover underline pada link menu */
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

/* Styling untuk container profil */
.profile-container {
  position: relative;
}

/* Styling untuk gambar profil */
.profile-picture {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
}

/* Styling untuk modal overlay */
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

/* Styling untuk modal */
.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

/* Animasi untuk modal */
@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Styling untuk gambar profil di dalam modal */
.profile-modal-picture {
  height: 120px;
  width: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 4px solid #3498db;
}

/* Styling untuk teks di dalam modal */
.modal p, .modal h2, .modal button {
  color: #333;
}

/* Styling untuk tombol logout */
.logout-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #2980b9;
}

/* Styling untuk tombol close modal */
.modal-close {
  background: none;
  border: none;
  font-size: 30px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
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
