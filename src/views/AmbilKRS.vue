<template>
    <div class="ambil-krs">
      <h1>Ambil KRS</h1>
  
      <table>
        <thead>
          <tr>
            <th>Kode Mata Kuliah</th>
            <th>Nama Mata Kuliah</th>
            <th>Jumlah SKS</th>
            <th>Nilai</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mataKuliah, index) in mataKuliahTersedia" :key="index">
            <td>{{ mataKuliah.kode }}</td>
            <td>{{ mataKuliah.nama }}</td>
            <td>{{ mataKuliah.sks }}</td>
            <td>{{ mataKuliah.nilai || '-' }}</td>
            <td>
              <button v-if="!mataKuliah.diambil" @click="ambilKRS(index)">Ambil KRS</button>
              <span v-else>Telah Diambil</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        mataKuliahTersedia: [
          { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, nilai: '', diambil: false },
          { kode: 'IF102', nama: 'Struktur Data', sks: 3, nilai: '', diambil: false },
          { kode: 'IF201', nama: 'Algoritma dan Pemrograman', sks: 4, nilai: '', diambil: false },
          { kode: 'IF202', nama: 'Basis Data', sks: 4, nilai: '', diambil: false },
          { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, nilai: 'A', diambil: true },
          // Tambahkan mata kuliah lainnya sesuai kebutuhan
        ]
      };
    },
    methods: {
      ambilKRS(index) {
        this.mataKuliahTersedia[index].diambil = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .ambil-krs {
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
  
  button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  span {
    color: #555;
  }
  </style>
  