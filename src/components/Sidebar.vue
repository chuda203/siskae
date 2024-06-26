<template>
  <div>
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]" @mouseenter="toggleSidebar" @mouseleave="hideSidebar" v-if="!isMobile">
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="menu-item">
          <router-link :to="item.path" class="menu-link" @click.native="handleMenuClick">
            <font-awesome-icon :icon="item.icon" class="icon" />
            <transition name="fade">
              <span v-if="!isCollapsed" class="menu-name">{{ item.name }}</span>
            </transition>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="mobile-menu" v-if="isMobile && showSidebar">
      <div v-for="item in menuItems" :key="item.name" class="mobile-menu-item" @click="navigateTo(item.path)">
        <font-awesome-icon :icon="item.icon" class="mobile-icon" />
        <span class="mobile-menu-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendarCheck, faEdit, faPencilAlt, faGraduationCap, faIdCard, faFileAlt, faCalendar, faClock, faBook, faBullhorn, faChartLine, faHome } from '@fortawesome/free-solid-svg-icons'

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    showSidebar: Boolean
  },
  data() {
    return {
      menuItems: [
        { name: 'Beranda', path: '/beranda', icon: faHome},
        { name: 'Presensi Kuliah', path: '/presensi-kuliah', icon: faCalendarCheck },
        { name: 'Ambil KRS', path: '/ambil-krs', icon: faEdit },
        { name: 'Revisi KRS', path: '/revisi-krs', icon: faPencilAlt },
        { name: 'KHS', path: '/khs', icon: faGraduationCap },
        { name: 'Kartu Ujian', path: '/kartu-ujian', icon: faIdCard },
        { name: 'Transkrip', path: '/transkrip', icon: faFileAlt },
        { name: 'Jadwal Kuliah', path: '/jadwal-kuliah', icon: faCalendar },
        { name: 'Jadwal Ujian', path: '/jadwal-ujian', icon: faClock },
        { name: 'Skripsi', path: '/skripsi', icon: faBook },
        { name: 'Pengumuman', path: '/pengumuman', icon: faBullhorn },
        { name: 'Evaluasi', path: '/evaluasi', icon: faChartLine }
      ],
      isCollapsed: true, // Initially collapsed
      isMobile: false // Initially not mobile
    };
  },
  mounted() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = false;
    },
    hideSidebar() {
      this.isCollapsed = true;
    },
    checkWindowSize() {
      this.isMobile = window.innerWidth <= 768; // Change this value as needed
    },
    navigateTo(path) {
      this.$router.push(path);
      this.$emit('show-content');
    },
    handleMenuClick() {
      if (this.isMobile) {
        this.$emit('show-content');
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 60px;
  background-color: #444;
  color: white;
  height: 90vh;
  position: fixed;
  overflow-y: auto;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
}
.sidebar:hover {
  width: 200px;
}
.sidebar-collapsed .menu-name {
  display: none;
}
.sidebar-collapsed .icon {
  font-size: 20px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}
li {
  padding: 20px;
  text-align: left;
  white-space: nowrap; /* Prevent text wrapping */
}
a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  overflow: hidden; /* Prevent overflow */
}
.menu-link {
  display: flex;
  align-items: center;
  width: 100%; /* Ensure the link takes the full width */
}
.icon {
  margin-right: 10px;
  min-width: 20px; /* Ensures the icon area is fixed */
  font-size: 20px;
}
.menu-name {
  margin-left: 10px; /* Adjust this value as needed */
  white-space: nowrap; /* Prevent text wrapping */
  font-size: 20px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Mobile styles */
.mobile-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 20px;
  height: calc(100vh - 40px); /* Mengurangi padding atas dan bawah */
  box-sizing: border-box;
  z-index: 100;
}
.mobile-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #444;
  color: white;
  text-align: center;
  transition: background-color 0.3s;
  cursor: pointer; /* Indicate that the item is clickable */
  border-radius: 10px; /* Menambahkan sudut melengkung */
  width: calc((100vw - 60px) / 2); /* Menyesuaikan lebar agar sesuai dengan setengah lebar layar, memperhitungkan padding dan gap */
  height: calc((100vw - 60px) / 2); /* Menyesuaikan tinggi agar sama dengan lebar untuk membuatnya persegi */
  flex-direction: column; /* Menambahkan ini agar konten di dalamnya berada dalam kolom */
}
.mobile-menu-item:hover {
  background-color: #666;
}
.mobile-menu-link {
  display: flex;
  flex-direction: column; /* Mengubah arah flex menjadi kolom */
  align-items: center;
  text-decoration: none;
  color: white;
}
.mobile-icon {
  font-size: 44px;
  margin-bottom: 5px;
}
.mobile-menu-name {
  font-size: 22px;
  margin-top: 15px; /* Tambahkan margin atas untuk memberi jarak antara ikon dan nama menu */
}
</style>
