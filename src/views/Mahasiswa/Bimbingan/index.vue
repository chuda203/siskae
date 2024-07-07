<template>
  <div class="main-wrapper">
    <div class="toggle-view-wrapper">
      <div class="view-toggle" @click="toggleView">
        <img v-if="tableView" src="../../../assets/ic_card.png" alt="Card View" />
        <img v-else src="../../../assets/ic_table.png" alt="Table View" />
      </div>
    </div>
    <div class="container">
      <div class="container-content">
        <h1 class="title">Bimbingan Saya</h1>
        <div class="buttons-container">
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedBimbingan === 'all'}" @click="selectedBimbingan = 'all'">Semua</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedBimbingan === 'krs'}" @click="selectedBimbingan = 'krs'">KRS</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedBimbingan === 'kerjaPraktik'}" @click="selectedBimbingan = 'kerjaPraktik'">Kerja Praktik</button>
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedBimbingan === 'skripsi'}" @click="selectedBimbingan = 'skripsi'">Skripsi</button>
        </div>
        <div v-if="!tableView" class="cards-container">
          <!-- Card View -->
          <div v-for="bimbingan in filteredBimbinganData" :key="bimbingan.id" class="card" @click="openModal(bimbingan)">
            <div class="card-header">
              <h3>{{ bimbingan.jenis }}</h3>
              <span>{{ bimbingan.semester || bimbingan.judul }}</span>
            </div>
            <div class="card-body">
              <p>{{ bimbingan.topik }}</p>
              <p>{{ bimbingan.status }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <!-- Table View -->
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('jenis')">Jenis</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('judul')">Judul</th>
                <th @click="sortTable('dosen')">Dosen</th>
                <th @click="sortTable('topik')">Topik</th>
                <th @click="sortTable('status')">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bimbingan in sortedBimbinganTable" :key="bimbingan.id" @click="openModal(bimbingan)">
                <td>{{ bimbingan.jenis }}</td>
                <td>{{ bimbingan.semester }}</td>
                <td>{{ bimbingan.judul }}</td>
                <td>{{ bimbingan.dosen }}</td>
                <td>{{ bimbingan.topik }}</td>
                <td>{{ bimbingan.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Detail Bimbingan</h3>
        <p>Jenis: {{ selectedBimbingan.jenis }}</p>
        <p v-if="selectedBimbingan.semester">Semester: {{ selectedBimbingan.semester }}</p>
        <p v-else>Judul: {{ selectedBimbingan.judul }}</p>
        <p>Dosen: {{ selectedBimbingan.dosen }}</p>
        <p>Topik: {{ selectedBimbingan.topik }}</p>
        <p>Status: {{ selectedBimbingan.status }}</p>
        <ul v-if="selectedBimbingan.slots.length > 0">
          <li v-for="slot in selectedBimbingan.slots" :key="slot.id">{{ slot.waktu }}</li>
        </ul>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedBimbingan: 'all',
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      bimbinganData: {
        krs: [
          { id: 1, jenis: 'KRS', semester: 'Semester 1', dosen: 'Dr. Siti', topik: 'Pengisian KRS', status: 'Disetujui', slots: [
            { id: 101, waktu: '2024-08-01 10:00' },
            { id: 102, waktu: '2024-08-01 11:00' }
          ]},
          { id: 2, jenis: 'KRS', semester: 'Semester 2', dosen: 'Dr. Siti', topik: 'Perbaikan KRS', status: 'Proses', slots: [
            { id: 103, waktu: '2024-08-02 10:00' },
            { id: 104, waktu: '2024-08-02 11:00' }
          ]}
        ],
        kerjaPraktik: [
          { id: 3, jenis: 'Kerja Praktik', judul: 'Pengembangan Web', dosen: 'Prof. Budi', topik: 'Proposal KP', status: 'Proses', slots: [
            { id: 105, waktu: '2024-08-03 10:00' },
            { id: 106, waktu: '2024-08-03 11:00' }
          ]},
          { id: 4, jenis: 'Kerja Praktik', judul: 'Desain UI/UX', dosen: 'Prof. Budi', topik: 'Laporan KP', status: 'Revisi', slots: [
            { id: 107, waktu: '2024-08-04 10:00' },
            { id: 108, waktu: '2024-08-04 11:00' }
          ]}
        ],
        skripsi: [
          { id: 5, jenis: 'Skripsi', judul: 'Analisis Data', dosen: 'Dr. Ani', topik: 'Bab 1', status: 'Disetujui', slots: [
            { id: 109, waktu: '2024-08-05 10:00' },
            { id: 110, waktu: '2024-08-05 11:00' }
          ]},
          { id: 6, jenis: 'Skripsi', judul: 'Kecerdasan Buatan', dosen: 'Dr. Ani', topik: 'Bab 2', status: 'Proses', slots: [
            { id: 111, waktu: '2024-08-06 10:00' },
            { id: 112, waktu: '2024-08-06 11:00' }
          ]}
        ]
      },
      showModal: false,
      selectedBimbinganDetail: {}
    };
  },
  computed: {
    filteredBimbinganData() {
      return this.selectedBimbingan === 'all' ? Object.values(this.bimbinganData).flat() : this.bimbinganData[this.selectedBimbingan];
    },
    sortedBimbinganTable() {
      return this.filteredBimbinganData.sort((a, b) => {
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
        this.selectedBimbingan = 'all'; // Reset filter when switching to table view
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
    openModal(bimbingan) {
      this.selectedBimbinganDetail = bimbingan;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
  mounted() {
    this.selectedBimbingan = 'all'; // Set default filter to 'all' on mount
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
  right: 280px;
  top: 25px;
}

.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  width: 100%;
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
  max-width: 1200px;
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
.batal-button {
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
</style>
