<template>
    <div class="transkrip-khs-container">
      <!-- Transkrip Nilai -->
      <div class="transkrip">
        <h1>Transkrip Nilai</h1>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in transkrip" :key="index">
              <td>{{ mataKuliah.semester }}</td>
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.nilai }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Kartu Hasil Studi (KHS) -->
      <div class="khs">
        <div class="sidebar">
          <h2>Pilih Semester</h2>
          <ul>
            <li v-for="semester in semesters" :key="semester" @click="selectSemester(semester)" :class="{ active: selectedSemester === semester }">
              Semester {{ semester }}
            </li>
          </ul>
        </div>
        <div class="content">
          <h1>Kartu Hasil Studi (KHS)</h1>
          <h3>Semester {{ selectedSemester }}</h3>
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
        transkrip: [
          { semester: 1, kode: 'IF101', nama: 'Pemrograman Dasar', nilai: 'A' },
          { semester: 1, kode: 'IF102', nama: 'Struktur Data', nilai: 'B+' },
          { semester: 2, kode: 'IF201', nama: 'Algoritma dan Pemrograman', nilai: 'A-' },
          { semester: 2, kode: 'IF202', nama: 'Basis Data', nilai: 'B' },
          // Tambahkan data transkrip lainnya sesuai kebutuhan
        ],
        semesters: [1, 2, 3, 4, 5, 6, 7, 8],
        selectedSemester: 1,
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
  
  .transkrip, .khs {
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
  