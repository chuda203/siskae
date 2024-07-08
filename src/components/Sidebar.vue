<!-- <template>
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
import { inject } from 'vue';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    showSidebar: Boolean
  },
  setup() {
    const auth = inject('auth'); // Inject auth state
    return { auth };
  },
  data() {
    return {
      isMobile: true  // Pastikan sidebar hanya aktif di mobile
    };
  },
  computed: {
    menuItems() {
      // Menu items for mahasiswa
      const mahasiswaMenu = [
        { name: 'Beranda', path: '/', icon: faHome },
        { name: 'Bimbingan', path: '/bimbingan', icon: faBullhorn },
        { name: 'Kelas', path: '/kelas', icon: faCalendarCheck },
        { name: 'KRS', path: '/krs', icon: faEdit },
        { name: 'Publikasi', path: '/publikasi', icon: faPencilAlt },
        { name: 'Saran', path: '/saran', icon: faGraduationCap },
        { name: 'Transkrip', path: '/transkrip', icon: faFileAlt },
        { name: 'Ujian', path: '/ujian', icon: faCalendar }
      ];

      // Menu items for dosen
      const dosenMenu = [
        { name: 'Beranda', path: '/', icon: faHome },
        { name: 'Bimbingan', path: '/bimbingan', icon: faBullhorn },
        { name: 'Mata Kuliah', path: '/mata-kuliah', icon: faBook },
        { name: 'Publikasi', path: '/publikasi', icon: faPencilAlt },
        { name: 'Riwayat', path: '/riwayat', icon: faChartLine },
        { name: 'Saran', path: '/saran', icon: faGraduationCap },
        { name: 'Ujian', path: '/ujian', icon: faCalendar }
      ];

      // Return the appropriate menu based on the user's role
      return this.auth.role === 'dosen' ? dosenMenu : mahasiswaMenu;
    }
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
  height: 100vh;
  position: absolute;
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
</style> -->
