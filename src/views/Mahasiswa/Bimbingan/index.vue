<template>
    <div class="container">
      <div class="bimbingan-card">
        <h2>Bimbingan Saya</h2>
        <label for="bimbinganType">Pilih Jenis Bimbingan:</label>
        <select id="bimbinganType" v-model="selectedBimbingan" @change="loadBimbinganData">
          <option value="krs">Bimbingan KRS</option>
          <option value="kerjaPraktik">Bimbingan Kerja Praktik</option>
          <option value="skripsi">Bimbingan Skripsi</option>
        </select>
  
        <div class="table-container">
          <table v-if="bimbinganData.length" class="bimbingan-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Dosen Pembimbing</th>
                <th>Topik</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bimbingan in bimbinganData" :key="bimbingan.id">
                <td>{{ bimbingan.tanggal }}</td>
                <td>{{ bimbingan.dosen }}</td>
                <td>{{ bimbingan.topik }}</td>
                <td>{{ bimbingan.status }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">Tidak ada data untuk jenis bimbingan yang dipilih.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BimbinganMahasiswa',
    data() {
      return {
        selectedBimbingan: 'krs',
        bimbinganData: []
      };
    },
    mounted() {
      this.loadBimbinganData();
    },
    methods: {
      loadBimbinganData() {
        // Gantilah data berikut dengan data yang sebenarnya
        const data = {
          krs: [
            { id: 1, tanggal: '2023-07-01', dosen: 'Dr. Siti', topik: 'Pengisian KRS', status: 'Disetujui' },
            { id: 2, tanggal: '2023-07-05', dosen: 'Dr. Siti', topik: 'Perbaikan KRS', status: 'Proses' }
          ],
          kerjaPraktik: [
            { id: 3, tanggal: '2023-07-10', dosen: 'Prof. Budi', topik: 'Proposal KP', status: 'Proses' },
            { id: 4, tanggal: '2023-07-15', dosen: 'Prof. Budi', topik: 'Laporan KP', status: 'Revisi' }
          ],
          skripsi: [
            { id: 5, tanggal: '2023-07-20', dosen: 'Dr. Ani', topik: 'Bab 1', status: 'Disetujui' },
            { id: 6, tanggal: '2023-07-25', dosen: 'Dr. Ani', topik: 'Bab 2', status: 'Proses' }
          ]
        };
  
        this.bimbinganData = data[this.selectedBimbingan];
      }
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
  }
  
  .bimbingan-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 100%;
    min-width: 800px;
  }
  
  .bimbingan-card h2 {
    margin-bottom: 15px;
    text-align: center;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  select {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .bimbingan-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .bimbingan-table th,
  .bimbingan-table td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  .bimbingan-table th {
    background-color: #f2f2f2;
  }
  
  .bimbingan-table td {
    text-align: center;
  }
  
  .no-data {
    text-align: center;
    margin-top: 10px;
  }
  </style>
  