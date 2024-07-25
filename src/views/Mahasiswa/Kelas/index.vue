<template>
  <h1 class="title-container">
    <span class="title">Jadwal Kuliah</span>
  </h1>
  <div class="container">
    <div class="container-content">
      <div class="main-wrapper">
        <div class="header-wrapper">
          <div v-if="!tableView" class="filter-buttons-container">
            <button class="filter-button" :class="{'active': selectedHari === 'all'}" @click="selectedHari = 'all'">Semua</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Senin'}" @click="selectedHari = 'Senin'">Senin</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Selasa'}" @click="selectedHari = 'Selasa'">Selasa</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Rabu'}" @click="selectedHari = 'Rabu'">Rabu</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Kamis'}" @click="selectedHari = 'Kamis'">Kamis</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Jumat'}" @click="selectedHari = 'Jumat'">Jumat</button>
            <button class="filter-button" :class="{'active': selectedHari === 'Sabtu'}" @click="selectedHari = 'Sabtu'">Sabtu</button>
          </div>
          <div class="view-toggle-wrapper">
            <div class="view-toggle" @click="toggleView">
              <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
              <img v-else src="../../../assets/ic_table.png" alt="Table View" />
            </div>
          </div>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(jadwal, index) in filteredJadwalKuliah" :key="`jadwal-${index}`" class="card" @click="openDetail(jadwal)">
            <div class="card-header">
              <h3>{{ jadwal.course_name }}</h3>
              <img v-if="isPresensiActive(jadwal)" @click.stop="presensi(jadwal)" :src="getPresensiIcon(jadwal)" :alt="getPresensiAlt(jadwal)" :class="getPresensiClass(jadwal)" />
            </div>
            <div class="divider"></div>
            <div class="card-body">
              <p>{{ jadwal.day }}, {{ jadwal.start_time }} - {{ jadwal.end_time }} WIB</p>
              <p>{{ jadwal.credits }} SKS</p>
              <p>Ruang: {{ jadwal.room }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nama Mata Kuliah</th>
                <th>Kode</th>
                <th>SKS</th>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Ruang Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(jadwal, index) in filteredJadwalKuliah" :key="`table-${index}`">
                <td>{{ jadwal.course_name }}</td>
                <td>{{ jadwal.course_code }}</td>
                <td>{{ jadwal.credits }}</td>
                <td>{{ jadwal.day }}</td>
                <td>{{ jadwal.start_time }} - {{ jadwal.end_time }}</td>
                <td>{{ jadwal.room }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">{{ selectedJadwal.course_name }}</h2>
      <table class="detail-table">
        <tr>
          <td>Kode:</td>
          <td>{{ selectedJadwal.course_code }}</td>
        </tr>
        <tr>
          <td>SKS:</td>
          <td>{{ selectedJadwal.credits }}</td>
        </tr>
        <tr>
          <td>Hari:</td>
          <td>{{ selectedJadwal.day }}</td>
        </tr>
        <tr>
          <td>Waktu:</td>
          <td>{{ selectedJadwal.start_time }} - {{ selectedJadwal.end_time }}</td>
        </tr>
        <tr>
          <td>Ruang Kelas:</td>
          <td>{{ selectedJadwal.room }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies';
import axios from 'axios';
import moment from 'moment-timezone';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      selectedHari: 'all',
      tableView: false,
      jadwalKuliah: [],
      selectedJadwal: {},
      showModal: false,
      eventReports: [],
      presensiStatus: {}, // Tambahkan properti ini untuk menyimpan status presensi
      developmentMode: false // Pastikan nilai ini diatur ke false
    };
  },
  computed: {
    filteredJadwalKuliah() {
      if (this.selectedHari === 'all') {
        return this.jadwalKuliah;
      } else {
        return this.jadwalKuliah.filter(jadwal => jadwal.day === this.selectedHari);
      }
    }
  },
  methods: {
    async fetchJadwalKuliah() {
      const userId = VueCookies.get('user_id');
      const currentSemester = VueCookies.get('current_semester');
      try {
        const response = await axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/student/schedule?user_id=${userId}&semester=${currentSemester}`);
        if (response.data.success) {
          this.jadwalKuliah = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    },
    async fetchEventReports() {
      const userId = VueCookies.get('user_id');
      try {
        const response = await axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/student/activeeventreport?user_id=${userId}`);
        if (response.data.success) {
          this.eventReports = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching event reports:', error);
      }
    },
    async checkPresensiStatus() {
      const userId = VueCookies.get('user_id');
      for (let event of this.eventReports) {
        try {
          const response = await axios.get(`https://unified-atom-423009-a1.et.r.appspot.com/student/attendance/check?report_id=${event.report_id}&user_id=${userId}`);
          if (response.data.success) {
            this.presensiStatus[event.report_id] = response.data.attended;
          }
        } catch (error) {
          console.error('Error checking presensi status:', error);
        }
      }
    },
    isPresensiActive(jadwal) {
      const now = moment().tz('Asia/Jakarta');
      return this.eventReports.some(event => {
        const eventDate = moment(event.date).tz('Asia/Jakarta').format('YYYY-MM-DD');
        const nowDate = now.format('YYYY-MM-DD');
        const startTime = moment(`${eventDate} ${event.start_time}`, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');
        const endTime = moment(`${eventDate} ${event.end_time}`, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

        return event.course_id === jadwal.course_id &&
          eventDate === nowDate &&
          startTime.isSameOrBefore(now) &&
          endTime.isSameOrAfter(now);
      });
    },
    isAlreadyPresensi(jadwal) {
      const event = this.eventReports.find(event => event.course_id === jadwal.course_id);
      if (event) {
        return this.presensiStatus[event.report_id] || false;
      }
      return false;
    },
    getPresensiIcon(jadwal) {
      return this.isAlreadyPresensi(jadwal) ? '../../../assets/ic_presensi.png' : '../../../assets/ic_presensi.png';
    },
    getPresensiAlt(jadwal) {
      return this.isAlreadyPresensi(jadwal) ? 'Presensi' : 'Presensi';
    },
    getPresensiClass(jadwal) {
      return this.isAlreadyPresensi(jadwal) ? 'presensi-icon presensi-disabled' : 'presensi-icon';
    },
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.selectedHari = 'all'; // Reset filter when switching to table view
      }
    },
    openDetail(jadwal) {
      this.selectedJadwal = jadwal;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async presensi(jadwal) {
      const toast = useToast();
      const userId = VueCookies.get('user_id');
      const event = this.eventReports.find(event => event.course_id === jadwal.course_id);
      if (event) {
        try {
          await axios.post('https://unified-atom-423009-a1.et.r.appspot.com/student/attendance', {
            report_id: event.report_id,
            user_id: userId,
            status: 'Present'
          });
          this.presensiStatus[event.report_id] = true;
          toast.success(`Anda telah presensi untuk ${jadwal.course_name}`);
        } catch (error) {
          console.error('Error submitting presensi:', error);
          toast.error('Terjadi kesalahan saat presensi.');
        }
      }
    }
  },
  async mounted() {
    await this.fetchJadwalKuliah();
    await this.fetchEventReports();
    await this.checkPresensiStatus();
    console.log('Data loaded: ', this.jadwalKuliah, this.eventReports);
  }
};
</script>

<style scoped>
.main-wrapper {
  width: 100%;
  position: relative;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px; /* Tambahkan margin bawah */
}

.filter-buttons-container {
  display: flex;
  justify-content: center;
  width: 90%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 200px; /* Tambahkan padding kiri */
  padding-right: 10px; /* Tambahkan padding kanan */
  height: 40px; /* Tambahkan tinggi tetap */
}

.filter-buttons-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.filter-button {
  border: none;
  background-color: #cccccc;
  color: black;
  padding: 0px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  flex-shrink: 0;
}

.filter-button.active {
  background-color: #007BFF;
  color: white;
}

.filter-button:last-child {
  margin-right: 0;
}

.view-toggle-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-bottom: 20px;
  padding-right: 10px; /* Tambahkan padding kanan untuk konsistensi */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 100px;
  padding-inline: 30px;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.view-toggle {
  background-color: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.view-toggle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  background-color: white; /* Background putih */
  border-radius: 10px; /* Sudut yang membulat */
  padding: 10px 20px; /* Padding di dalam judul */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bayangan halus */
  text-align: center; /* Teks di tengah */
  display: inline-block;
}

@media (max-width: 768px) {
  .title {
    margin-top: 10px;
    font-size: 1em; /* Kurangi ukuran font pada tampilan mobile */
    white-space: normal; /* Izinkan teks untuk membungkus */
  }
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  cursor: pointer;
  position: relative; /* Necessary for absolute positioning of children */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.card-header h3 {
  margin: 0;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 0px 0;
  width: 100%;
}

.card-body p {
  margin: 5px 0;
}

.presensi-icon {
  cursor: pointer;
  width: 35px;  /* Atur ukuran yang sesuai */
  height: 35px; /* Atur ukuran yang sesuai */
  object-fit: cover; /* Pastikan gambar menyesuaikan dengan kontainernya */
  background-color: #3498db;
  margin-bottom: 5px;
  border-radius: 10px;
}

.presensi-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.modal-title {
  text-align: center;
}

.table-container {
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.table th {
  cursor: pointer;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.detail-table tr:nth-child(odd) {
  background-color: #ffffff;
}

.detail-table td {
  padding: 8px;
}
</style>
