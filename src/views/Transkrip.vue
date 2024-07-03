<template>
    <div class="transkip">
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
        ]
      };
    }
  };
  </script>
  
  <style>
  .transkip {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
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
  </style>
  