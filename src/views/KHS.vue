<template>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
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
        return this.mataKuliah.filter(mataKuliah => mataKuliah.semester === this.selectedSemester);
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
  .khs {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .sidebar {
    width: 100%;
    background-color: #f4f4f4;
    padding: 10px;
    margin-bottom: 20px;
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
  
  .content {
    width: 100%;
    max-width: 800px;
    text-align: center;
  }
  
  table {
    width: 100%;
    margin-top: 20px;
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
  
  @media (max-width: 600px) {
    .sidebar ul {
      flex-direction: column;
    }
  
    .sidebar li {
      width: 100%;
      text-align: center;
    }
  
    th, td {
      padding: 5px;
    }
  }
  </style>
  