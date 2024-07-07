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
        <h1 class="title">Kartu Hasil Studi (KHS)</h1>
        <div class="buttons-container">
          <button v-if="!tableView" class="filter-button" :class="{'active': selectedSemester === null}" @click="selectSemester(null)">Semua Semester</button>
          <button v-if="!tableView" class="filter-button" v-for="semester in semesters" :key="semester" :class="{'active': selectedSemester === semester}" @click="selectSemester(semester)">
            Semester {{ semester }}
          </button>
        </div>
        <div v-if="!tableView" class="cards-container">
          <!-- Card View -->
          <div v-for="(mataKuliah, index) in filteredMataKuliah" :key="`mataKuliah-${index}`" class="card" @click="openDetail(mataKuliah)">
            <div class="card-header">
              <h3>{{ mataKuliah.nama }}</h3>
            </div>
            <div class="card-body">
              <p>{{ mataKuliah.nilai }}</p>
            </div>
          </div>
        </div>
        <div v-else class="table-container">
          <!-- Table View -->
          <table class="table">
            <thead>
              <tr>
                <th @click="sortTable('nama')">Nama Mata Kuliah</th>
                <th @click="sortTable('kode')">Kode</th>
                <th @click="sortTable('sks')">SKS</th>
                <th @click="sortTable('namaDosen')">Dosen</th>
                <th @click="sortTable('semester')">Semester</th>
                <th @click="sortTable('nilai')">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mataKuliah in sortedMataKuliahTable" :key="mataKuliah.kode">
                <td>{{ mataKuliah.nama }}</td>
                <td>{{ mataKuliah.kode }}</td>
                <td>{{ mataKuliah.sks }}</td>
                <td>{{ mataKuliah.dosen }}</td>
                <td>{{ mataKuliah.semester }}</td>
                <td>{{ mataKuliah.nilai }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
      selectedSemester: null,
      tableView: false,
      sortBy: null,
      sortOrder: 'asc',
      showModal: false,
      selectedMataKuliah: {},
      mataKuliah: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, dosen: 'Dr. A', nilai: 'A', semester: 1 },
        { kode: 'IF102', nama: 'Struktur Data', sks: 3, dosen: 'Dr. B', nilai: 'B', semester: 1 },
        { kode: 'IF201', nama: 'Algoritma dan Pemrograman', sks: 4, dosen: 'Dr. C', nilai: 'A', semester: 2 },
        { kode: 'IF202', nama: 'Basis Data', sks: 4, dosen: 'Dr. D', nilai: 'B', semester: 2 },
        // More courses...
      ]
    };
  },
  computed: {
    filteredMataKuliah() {
      if (this.selectedSemester === null) {
        return this.mataKuliah;
      }
      return this.mataKuliah.filter(mk => mk.semester === this.selectedSemester);
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
      return this.mataKuliah.sort((a, b) => {
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
        this.selectedSemester = null; // Reset filter when switching to table view
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
    selectSemester(semester) {
      this.selectedSemester = semester;
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
