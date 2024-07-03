<template>
  <div class="transkrip-khs-container">
    <!-- Kartu Hasil Studi (KHS) -->
    <div class="khs">
      <div class="content">
        <h1>Kartu Hasil Studi (KHS)</h1>
        <div class="sidebar">
          <h2>Pilih Semester</h2>
          <ul>
            <li v-for="semester in semesters" :key="semester" @click="selectSemester(semester)" :class="{ active: selectedSemester === semester }">
              Semester {{ semester }}
            </li>
            <li @click="selectSemester(null)" :class="{ active: selectedSemester === null }">
              Semua
            </li>
          </ul>
        </div>
        <h3 v-if="selectedSemester !== null">Semester {{ selectedSemester }}</h3>
        <h3 v-else>Semua Semester</h3>
        <table>
          <thead>
            <tr>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Jumlah SKS</th>
              <th>Nama Dosen</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in filteredMataKuliah" :key="index">
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.sks }}</td>
              <td>{{ mataKuliah.dosen }}</td>
              <td>{{ mataKuliah.nilai }}</td>
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
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
      selectedSemester: null,
      mataKuliah: [
        { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, dosen: 'Dr. A', nilai: 'A', semester: 1 },
        { kode: 'IF102', nama: 'Struktur Data', sks: 3, dosen: 'Dr. B', nilai: 'B', semester: 1 },
        { kode: 'IF201', nama: 'Algoritma dan Pemrograman', sks: 4, dosen: 'Dr. C', nilai: 'A', semester: 2 },
        { kode: 'IF202', nama: 'Basis Data', sks: 4, dosen: 'Dr. D', nilai: 'B', semester: 2 },
        // Tambahkan mata kuliah lainnya sesuai kebutuhan
      ]
    };
  },
  computed: {
    filteredMataKuliah() {
      if (this.selectedSemester === null) {
        return this.mataKuliah;
      }
      return this.mataKuliah.filter(mk => mk.semester === this.selectedSemester);
    }
  },
  methods: {
    selectSemester(semester) {
      this.selectedSemester = semester;
    }
  }
};
</script>

<style scoped>
.transkrip-khs-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.khs {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.sidebar {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.sidebar h2 {
  text-align: center;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.sidebar li {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border: 1px solid #3498db;
  border-radius: 4px;
}

.sidebar li.active {
  background-color: #3498db;
  color: white;
}
</style>
