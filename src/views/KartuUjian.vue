<template>
    <div class="kartu-ujian">
      <h1>Kartu Ujian</h1>
      <div v-if="canPrintCard">
        <table>
          <thead>
            <tr>
              <th>Kode Mata Kuliah</th>
              <th>Nama Mata Kuliah</th>
              <th>Waktu Ujian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mataKuliah, index) in jadwalUjian" :key="index">
              <td>{{ mataKuliah.kode }}</td>
              <td>{{ mataKuliah.nama }}</td>
              <td>{{ mataKuliah.waktu }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="printCard">Cetak Kartu Ujian</button>
      </div>
      <div v-else>
        <p>Anda belum dapat mencetak kartu ujian. Silakan cek kembali mendekati waktu ujian.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        canPrintCard: false, // Ini akan diatur oleh admin atau mendekati waktu ujian
        jadwalUjian: [
          { kode: 'IF101', nama: 'Pemrograman Dasar', waktu: '2024-07-15 08:00' },
          { kode: 'IF102', nama: 'Struktur Data', waktu: '2024-07-16 10:00' },
          // Tambahkan jadwal ujian lainnya sesuai kebutuhan
        ]
      };
    },
    methods: {
      printCard() {
        window.print();
      }
    },
    mounted() {
      // Logika untuk menentukan apakah kartu ujian dapat dicetak
      // Misalnya, dapat diatur oleh admin atau berdasarkan tanggal ujian
      const currentDate = new Date();
      const examDate = new Date('2024-07-10'); // Contoh tanggal ujian
      this.canPrintCard = currentDate >= examDate;
    }
  };
  </script>
  
  <style>
  .kartu-ujian {
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
    margin-top: 20px;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  </style>
  