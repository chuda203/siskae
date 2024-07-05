<template>
  <div class="container">
    <div class="bimbingan-card">
      <h2>Mahasiswa Bimbingan</h2>
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
              <th>Nama</th>
              <th>NIM</th>
              <th>Jurusan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mahasiswa in bimbinganData" :key="mahasiswa.nim">
              <td>{{ mahasiswa.nama }}</td>
              <td>{{ mahasiswa.nim }}</td>
              <td>{{ mahasiswa.jurusan }}</td>
              <td>{{ mahasiswa.status }}</td>
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
  name: 'Bimbingan',
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
          { nama: 'Budi', nim: '123456', jurusan: 'Informatika', status: 'Disetujui' },
          { nama: 'Ani', nim: '789012', jurusan: 'Informatika', status: 'Disetujui' }
        ],
        kerjaPraktik: [
          { nama: 'Siti', nim: '345678', jurusan: 'Sistem Informasi', status: 'Proses' },
          { nama: 'Andi', nim: '901234', jurusan: 'Sistem Informasi', status: 'Proses' }
        ],
        skripsi: [
          { nama: 'Joko', nim: '567890', jurusan: 'Teknik Komputer', status: 'Revisi' },
          { nama: 'Dewi', nim: '123890', jurusan: 'Teknik Komputer', status: 'Revisi' }
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
  min-width: 800px; /* Atur minimum width untuk Bimbingan */
}

.card h2 {
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
