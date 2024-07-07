<template>
          <h1 class="title">Kartu Rencana Studi (KRS)</h1>
  <div class="main-wrapper">
    <div class="toggle-view-wrapper">
      <div class="view-toggle" @click="toggleView">
        <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
        <img v-else src="../../../assets/ic_table.png" alt="Table View" />
      </div>
    </div>
    <div class="container">
      <div class="container-content">
        <div class="buttons-container">
          <button v-if="!tableView" class="filter-button" :class="{'active': filter === 'all'}" @click="filter = 'all'">Semua</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': filter === 'not_taken'}" @click="filter = 'not_taken'">Belum di Ambil</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': filter === 'taken'}" @click="filter = 'taken'">Sudah di Ambil</button>
        </div>
        <div v-if="!tableView" class="cards-container">
          <div v-for="(mataKuliah, index) in filteredMataKuliah" :key="`mataKuliah-${index}`" class="card" @click="openDetail(mataKuliah)">
            <div class="card-header">
              <h3>{{ mataKuliah.nama }}</h3>
              <div class="divider"></div>
            </div>
            <div class="card-body">
              <p>{{ mataKuliah.sks }} SKS</p>
              <p>{{ mataKuliah.namaDosen }}</p>
              <p>Semester {{ mataKuliah.semester }}</p>
              <div class="enrollment-info">{{ mataKuliah.terisi }} / {{ mataKuliah.kapasitas }}</div>
              <button v-if="!mataKuliah.diambil" :class="['ambil-button', { 'disabled': mataKuliah.terisi >= mataKuliah.kapasitas }]" @click.stop="ambilKRS(mataKuliah, $event)" :disabled="mataKuliah.terisi >= mataKuliah.kapasitas">Ambil</button>
              <button v-else class="batal-button" @click.stop="hapusKRS(mataKuliah, $event)">Batal</button>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('nama')">Nama Mata Kuliah</th>
                <th @click="sortTable('kode')">Kode</th>
                <th @click="sortTable('sks')">SKS</th>
                <th @click="sortTable('namaDosen')">Dosen</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('ruangKelas')">Ruang Kelas</th>
                <th>Status</th>
                <th>Terisi</th>
                <th>Kapasitas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mataKuliah, index) in sortedMataKuliahTable" :key="`table-${index}`">
                <td>{{ mataKuliah.nama }}</td>
                <td>{{ mataKuliah.kode }}</td>
                <td>{{ mataKuliah.sks }}</td>
                <td>{{ mataKuliah.namaDosen }}</td>
                <td>{{ mataKuliah.semester }}</td>
                <td>{{ mataKuliah.ruangKelas }}</td>
                <td>
                  <button :class="[mataKuliah.diambil ? 'batal-button' : 'ambil-button', { 'disabled': !mataKuliah.diambil && mataKuliah.terisi >= mataKuliah.kapasitas }]" @click="mataKuliah.diambil ? hapusKRS(mataKuliah, $event) : ambilKRS(mataKuliah, $event)" :disabled="!mataKuliah.diambil && mataKuliah.terisi >= mataKuliah.kapasitas">
                    {{ mataKuliah.diambil ? 'Batal' : 'Ambil' }}
                  </button>
                </td>
                <td>{{ mataKuliah.terisi }}</td>
                <td>{{ mataKuliah.kapasitas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Mata Kuliah</h3>
        <table class="detail-table">
          <tr><td><strong>Nama</strong></td><td>{{ selectedMataKuliah.nama }}</td></tr>
          <tr><td><strong>Kode</strong></td><td>{{ selectedMataKuliah.kode }}</td></tr>
          <tr><td><strong>SKS</strong></td><td>{{ selectedMataKuliah.sks }}</td></tr>
          <tr><td><strong>Dosen</strong></td><td>{{ selectedMataKuliah.namaDosen }}</td></tr>
          <tr><td><strong>Semester</strong></td><td>{{ selectedMataKuliah.semester }}</td></tr>
          <tr><td><strong>Ruang Kelas</strong></td><td>{{ selectedMataKuliah.ruangKelas }}</td></tr>
          <tr><td><strong>Terisi</strong></td><td>{{ selectedMataKuliah.terisi }}</td></tr>
          <tr><td><strong>Kapasitas</strong></td><td>{{ selectedMataKuliah.kapasitas }}</td></tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { faL } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return {
      filter: 'all',
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      showModal: false,
      selectedMataKuliah: {},
      mataKuliahTersedia: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, diambil: false, namaDosen: 'Dr. John Doe', semester: 1, ruangKelas: 'A101', terisi: 10, kapasitas: 30 },
        { kode: 'IF102', nama: 'Struktur Data', sks: 3, diambil: true, namaDosen: 'Dr. Jane Smith', semester: 2, ruangKelas: 'B201', terisi: 25, kapasitas: 30 },
        { kode: 'IF201', nama: 'Algoritma dan Pemrograman', sks: 4, diambil: true, namaDosen: 'Prof. Alice Brown', semester: 3, ruangKelas: 'C301', terisi: 20, kapasitas: 25 },
        { kode: 'IF202', nama: 'Basis Data', sks: 4, diambil: false, namaDosen: 'Prof. Bob White', semester: 4, ruangKelas: 'D401', terisi: 18, kapasitas: 20 },
        { kode: 'IF203', nama: 'Pemrograman Lanjut', sks: 3, diambil: false, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 15, kapasitas: 15 },
        { kode: 'IF203', nama: 'Pemrograman Dasar', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 15, kapasitas: 15 },
        { kode: 'IF203', nama: 'Cloud Computing', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'Sistem Informasi', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'Logika Baru', sks: 2, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'Android Development', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'KKN', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'Skripsi', sks: 2, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 14, kapasitas: 15 },
        { kode: 'IF203', nama: 'Kerja Praktik', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 15, kapasitas: 15 },
        { kode: 'IF203', nama: 'AI', sks: 3, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 15, kapasitas: 15 },
        { kode: 'IF203', nama: 'Pemrograman Lanjut', sks: 2, diambil: true, namaDosen: 'Dr. Chris Black', semester: 5, ruangKelas: 'E501', terisi: 15, kapasitas: 15 },
        // More courses...
      ]
    };
  },
  computed: {
    filteredMataKuliah() {
      return this.mataKuliahTersedia.filter(mk => {
        const filterCondition = (this.filter === 'all') ||
                                (this.filter === 'not_taken' && !mk.diambil) ||
                                (this.filter === 'taken' && mk.diambil);
        return filterCondition;
      });
    },
    sortedMataKuliah() {
      return this.filteredMataKuliah.sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] === b[this.sortBy]) return 0;
        if (this.sortOrder === 'asc') {
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        } else {
          return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
        }
      });
    },
    sortedMataKuliahTable() {
      return this.mataKuliahTersedia.sort((a, b) => {
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
        this.filter = 'all'; // Reset filter when switching to table view
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
    ambilKRS(mataKuliah, event) {
      event.stopPropagation(); // Prevent triggering other click events
      if (!mataKuliah.diambil && mataKuliah.terisi < mataKuliah.kapasitas) {
        mataKuliah.diambil = true;
        mataKuliah.terisi++;
      }
      this.$forceUpdate(); // To ensure reactivity
    },
    hapusKRS(mataKuliah, event) {
      event.stopPropagation(); // Prevent triggering other click events
      if (mataKuliah.diambil) {
        mataKuliah.diambil = false;
        mataKuliah.terisi--;
      }
      this.$forceUpdate(); // To ensure reactivity
    },
    openDetail(mataKuliah) {
      this.selectedMataKuliah = mataKuliah;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.enrollment-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.85em;
  color: #666;
}
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
  height: 40px
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
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.filter-button, .toggle-view-button {
  border: none;
  background-color: #cccccc;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.filter-button:last-child, .toggle-view-button:last-child {
  margin-right: 0;
}

.filter-button.active {
  background-color: #007BFF;
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

.ambil-button,
.batal-button,
.ambil-button.disabled {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px 0;
}

.ambil-button {
  background-color: #3498db;
  color: white;
}

.batal-button {
  background-color: #e74c3c;
  color: white;
}

.ambil-button:hover {
  background-color: #2980b9;
}

.batal-button:hover {
  background-color: #c0392b;
}

.ambil-button.disabled,
.ambil-button.disabled:hover {
  background-color: #95a5a6;
  cursor: not-allowed;
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
