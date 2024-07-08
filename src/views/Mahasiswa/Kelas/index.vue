<template>
  <h1 class="title">Jadwal Kuliah</h1>

  <div class="main-wrapper">
    <div class="toggle-view-wrapper">
      <div class="view-toggle" @click="toggleView">
        <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
        <img v-else src="../../../assets/ic_table.png" alt="Table View" />
      </div>
    </div>
    <button class="all-grades-button" @click="showAllGrades">Semua Nilai</button>
    <div class="container">
      <div class="container-content">
        <div class="buttons-container">
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'all'}" @click="selectedHari = 'all'">Semua</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Senin'}" @click="selectedHari = 'Senin'">Senin</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Selasa'}" @click="selectedHari = 'Selasa'">Selasa</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Rabu'}" @click="selectedHari = 'Rabu'">Rabu</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Kamis'}" @click="selectedHari = 'Kamis'">Kamis</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Jumat'}" @click="selectedHari = 'Jumat'">Jumat</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedHari === 'Sabtu'}" @click="selectedHari = 'Sabtu'">Sabtu</button>
        </div>
        <div v-if="!tableView" class="cards-container">
          <!-- Card View -->
          <div v-for="(jadwal, index) in filteredJadwalKuliah" :key="index" class="card" @click="openDetail(jadwal)">
            <div class="card-header">
              <h3>{{ jadwal.namaMataKuliah }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ jadwal.hari }}, {{ jadwal.waktu }} WIB</p>
              <p>{{ jadwal.sks }} SKS</p>
              <p>Dosen: {{ jadwal.namaDosen }}</p>
              <button class="presensi-button" :class="{ hadir: jadwal.hadir }" @click.stop="togglePresensi(jadwal)">
                {{ jadwal.hadir ? 'Hadir' : 'Presensi' }}
              </button>
              <button class="nilai-button" @click.stop="toggleNilai(jadwal)">
                {{ jadwal.showNilai ? 'Tutup Nilai' : 'Lihat Nilai' }}
              </button>
              <div v-if="jadwal.showNilai">
                <p>UTS: {{ jadwal.nilaiUTS }}</p>
                <p>UAS: {{ jadwal.nilaiUAS }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <!-- Table View -->
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('namaMataKuliah')">Nama Mata Kuliah</th>
                <th @click="sortTable('kodeMataKuliah')">Kode</th>
                <th @click="sortTable('sks')">SKS</th>
                <th @click="sortTable('namaDosen')">Dosen</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('ruangKelas')">Ruang Kelas</th>
                <th>Status</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="jadwal in sortedJadwalKuliahTable" :key="jadwal.kodeMataKuliah" :class="{ 'gray-row': $index % 2 === 1 }">
                <td>{{ jadwal.namaMataKuliah }}</td>
                <td>{{ jadwal.kodeMataKuliah }}</td>
                <td>{{ jadwal.sks }}</td>
                <td>{{ jadwal.namaDosen }}</td>
                <td>{{ jadwal.semester }}</td>
                <td>{{ jadwal.ruangKelas }}</td>
                <td>
                  <button @click="togglePresensi(jadwal)">{{ jadwal.hadir ? 'Hadir' : 'Presensi' }}</button>
                </td>
                <td>
                  <button @click="toggleNilai(jadwal)">
                    {{ jadwal.showNilai ? 'Tutup Nilai' : 'Lihat Nilai' }}
                  </button>
                  <div v-if="jadwal.showNilai">
                    <p>UTS: {{ jadwal.nilaiUTS }}</p>
                    <p>UAS: {{ jadwal.nilaiUAS }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detail Jadwal Kuliah</h3>
        <table class="detail-table">
          <tr><td><strong>Nama Mata Kuliah</strong></td><td>{{ selectedJadwal.namaMataKuliah }}</td></tr>
          <tr><td><strong>Kode Mata Kuliah</strong></td><td>{{ selectedJadwal.kodeMataKuliah }}</td></tr>
          <tr><td><strong>SKS</strong></td><td>{{ selectedJadwal.sks }}</td></tr>
          <tr><td><strong>Nama Dosen</strong></td><td>{{ selectedJadwal.namaDosen }}</td></tr>
          <tr><td><strong>Semester</strong></td><td>{{ selectedJadwal.semester }}</td></tr>
          <tr><td><strong>Hari</strong></td><td>{{ selectedJadwal.hari }}</td></tr>
          <tr><td><strong>Waktu</strong></td><td>{{ selectedJadwal.waktu }} WIB</td></tr>
          <tr><td><strong>Ruang Kelas</strong></td><td>{{ selectedJadwal.ruangKelas }}</td></tr>
        </table>
      </div>
    </div>
    <!-- Modal Semua Nilai -->
    <div v-if="showModalAllGrades" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Semua Nilai Mata Kuliah</h3>
        <table class="grades-table">
          <thead>
            <tr>
              <th>Nama Mata Kuliah</th>
              <th>Kode</th>
              <th>UTS</th>
              <th>UAS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(jadwal, index) in jadwalKuliah" :key="index">
              <td>{{ jadwal.namaMataKuliah }}</td>
              <td>{{ jadwal.kodeMataKuliah }}</td>
              <td>{{ jadwal.nilaiUTS }}</td>
              <td>{{ jadwal.nilaiUAS }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHari: 'all',
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      jadwalKuliah: [
        {
          ruangKelas: 'A101',
          hari: 'Senin',
          waktu: '08:00 - 10:00',
          kodeMataKuliah: 'IF101',
          namaMataKuliah: 'Pemrograman Dasar',
          semester: 1,
          sks: 3,
          namaDosen: 'Dr. John Doe',
          hadir: false,
          showNilai: false,
          nilaiUTS: 85,
          nilaiUAS: 90
        },
        {
          ruangKelas: 'B202',
          hari: 'Rabu',
          waktu: '19:00 - 21:00',
          kodeMataKuliah: 'IF102',
          namaMataKuliah: 'Struktur Data',
          semester: 2,
          sks: 3,
          namaDosen: 'Dr. Jane Smith',
          hadir: false,
          showNilai: false,
          nilaiUTS: 78,
          nilaiUAS: 88
        },
        // Jadwal lainnya...
      ],
      showModal: false,
      showModalAllGrades: false,
      selectedJadwal: {}
    };
  },
  computed: {
    filteredJadwalKuliah() {
      if (this.selectedHari === 'all') {
        return this.jadwalKuliah;
      } else {
        return this.jadwalKuliah.filter(jadwal => jadwal.hari === this.selectedHari);
      }
    },
    sortedJadwalKuliah() {
      return this.filteredJadwalKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    },
    sortedJadwalKuliahTable() {
      return this.jadwalKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    }
  },
  methods: {
    toggleView() {
      this.tableView = !this.tableView;
      if (this.tableView) {
        this.selectedHari = 'all'; // Reset filter when switching to table view
      }
    },
    sortTable(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    togglePresensi(jadwal) {
      jadwal.hadir = !jadwal.hadir;
      const status = jadwal.hadir ? 'Hadir' : 'Masuk';
      jadwal.presensiHistory.push(`${new Date().toISOString().split('T')[0]} ${status}`);
    },
    openDetail(jadwal) {
      this.selectedJadwal = jadwal;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalAllGrades = false;
    },
    toggleNilai(jadwal) {
      jadwal.showNilai = !jadwal.showNilai;
    },
    showAllGrades() {
      this.showModalAllGrades = true;
    }
  }
};
</script>

<style scoped>
.main-wrapper {
  display: flex;
  align-items: flex-start;
  width: 100%;
  position: relative;
}

.toggle-view-wrapper {
  position: absolute;
  right: 120px;
  top: 25px;
}

.all-grades-button {
  position: absolute;
  right: 220px;
  top: 25px;
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  width: 100%;
  height: 85vh;
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
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.buttons-container {
  display: flex;
  justify-content: center; /* Center buttons horizontally */
  width: 100%; /* Ensure the button container spans full width */
  margin-bottom: 20px;
}

.filter-button {
  border: none;
  background-color: #cccccc; /* Default gray color */
  color: white;
  padding: 10px 20px;
  border-radius: 20px; /* Rounded corners */
  cursor: pointer;
  margin-right: 10px;
}

.filter-button:last-child {
  margin-right: 0; /* Remove margin for the last button */
}

.filter-button.active {
  background-color: #007BFF; /* Blue when active */
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* Center cards within container */
  width: 100%; /* Ensure it spans the full width of the container */
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  width: 300px; /* Fixed width for each card */
  cursor: pointer;
}

.card-header {
  position: relative;
}

.card-header h3 {
  margin: 0;
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 10px 0;
  width: calc(100% - 20px);
  margin-left: 10px;
  margin-right: 10px;
}

.card-body p {
  margin: 5px 0;
}

.presensi-button,
.nilai-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
  background-color: #007BFF;
  color: white;
}

.presensi-button.hadir {
  background-color: #2ecc71;
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
  width: 400px;
}

.modal-content h3 {
  margin-top: 0;
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

.table tbody tr:nth-child(even),
.detail-table tr:nth-child(even),
.grades-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(odd),
.detail-table tr:nth-child(odd),
.grades-table tr:nth-child(odd) {
  background-color: #ffffff;
}
</style>
