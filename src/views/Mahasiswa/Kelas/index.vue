<template>
  <h1 class="title">Jadwal Kuliah</h1>
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
              <h3>{{ jadwal.namaMataKuliah }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ jadwal.hari }}, {{ jadwal.waktu }} WIB</p>
              <p>{{ jadwal.sks }} SKS</p>
              <p>Dosen: {{ jadwal.namaDosen }}</p>
              <button @click.stop="presensi(jadwal)" class="presensi-button">Presensi</button>
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
                <th>Dosen</th>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Ruang Kelas</th>
                <th>Nilai UTS</th>
                <th>Nilai UAS</th>
                <th>Presensi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(jadwal, index) in filteredJadwalKuliah" :key="`table-${index}`">
                <td>{{ jadwal.namaMataKuliah }}</td>
                <td>{{ jadwal.kodeMataKuliah }}</td>
                <td>{{ jadwal.sks }}</td>
                <td>{{ jadwal.namaDosen }}</td>
                <td>{{ jadwal.hari }}</td>
                <td>{{ jadwal.waktu }}</td>
                <td>{{ jadwal.ruangKelas }}</td>
                <td>{{ jadwal.nilaiUTS }}</td>
                <td>{{ jadwal.nilaiUAS }}</td>
                <td><button @click.stop="presensi(jadwal)" class="presensi-button">Presensi</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">{{ selectedJadwal.namaMataKuliah }}</h2>
      <table class="detail-table">
        <tr>
          <td>Kode:</td>
          <td>{{ selectedJadwal.kodeMataKuliah }}</td>
        </tr>
        <tr>
          <td>SKS:</td>
          <td>{{ selectedJadwal.sks }}</td>
        </tr>
        <tr>
          <td>Dosen:</td>
          <td>{{ selectedJadwal.namaDosen }}</td>
        </tr>
        <tr>
          <td>Hari:</td>
          <td>{{ selectedJadwal.hari }}</td>
        </tr>
        <tr>
          <td>Waktu:</td>
          <td>{{ selectedJadwal.waktu }}</td>
        </tr>
        <tr>
          <td>Ruang Kelas:</td>
          <td>{{ selectedJadwal.ruangKelas }}</td>
        </tr>
        <tr>
          <td>Nilai UTS:</td>
          <td>{{ selectedJadwal.nilaiUTS }}</td>
        </tr>
        <tr>
          <td>Nilai UAS:</td>
          <td>{{ selectedJadwal.nilaiUAS }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHari: 'all',
      tableView: false,
      jadwalKuliah: [
        { kodeMataKuliah: 'IF101', namaMataKuliah: 'Pemrograman Dasar', sks: 3, namaDosen: 'Dr. John Doe', hari: 'Senin', waktu: '08:00 - 10:00', ruangKelas: 'A101', nilaiUTS: 85, nilaiUAS: 90 },
        { kodeMataKuliah: 'IF102', namaMataKuliah: 'Struktur Data', sks: 3, namaDosen: 'Dr. Jane Smith', hari: 'Selasa', waktu: '10:00 - 12:00', ruangKelas: 'B202', nilaiUTS: 78, nilaiUAS: 88 },
        // Tambahkan jadwal lainnya
      ],
      selectedJadwal: {},
      showModal: false
    };
  },
  computed: {
    filteredJadwalKuliah() {
      if (this.selectedHari === 'all') {
        return this.jadwalKuliah;
      } else {
        return this.jadwalKuliah.filter(jadwal => jadwal.hari === this.selectedHari);
      }
    }
  },
  methods: {
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
    presensi(jadwal) {
      alert(`Presensi untuk ${jadwal.namaMataKuliah}`);
    }
  }
};
</script>

<style scoped>
/* Tambahkan gaya CSS Anda di sini */
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
  width: 80%;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 20px;
  padding-left: 300px; /* Tambahkan padding kiri */
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
  padding: 20px;
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

.title {
  text-align: center;
  margin-bottom: 20px;
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

.presensi-button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
  background-color: #3498db;
  color: white;
  border-radius: 20px; /* Rounded corners */
}

.presensi-button:hover {
  background-color: #2980b9;
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
