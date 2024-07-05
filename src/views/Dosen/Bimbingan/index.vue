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
              <th>Riwayat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mahasiswa in bimbinganData" :key="mahasiswa.nim">
              <td>{{ mahasiswa.nama }}</td>
              <td>{{ mahasiswa.nim }}</td>
              <td>{{ mahasiswa.jurusan }}</td>
              <td>
                <button
                  :class="{'acc-button': true, 'accepted': mahasiswa.status === 'Diterima'}"
                  @click="toggleStatus(mahasiswa)"
                  :disabled="mahasiswa.status === 'Diterima'"
                >
                  {{ mahasiswa.status === 'Diterima' ? 'Diterima' : 'ACC' }}
                </button>
              </td>
              <td><button @click="showRiwayat(mahasiswa.nim)">Riwayat</button></td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">Tidak ada data untuk jenis bimbingan yang dipilih.</p>
      </div>

      <div v-if="showRiwayatModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeRiwayat">&times;</span>
          <h3>Riwayat Bimbingan</h3>
          <table class="riwayat-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="riwayat in riwayatData" :key="riwayat.tanggal">
                <td>{{ riwayat.tanggal }}</td>
                <td>{{ riwayat.keterangan }}</td>
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
  name: 'Bimbingan',
  data() {
    return {
      selectedBimbingan: 'krs',
      bimbinganData: [],
      showRiwayatModal: false,
      riwayatData: []
    };
  },
  mounted() {
    this.loadBimbinganData();
  },
  methods: {
    loadBimbinganData() {
      const data = {
        krs: [
          { nama: 'Budi', nim: '123456', jurusan: 'Informatika', status: 'ACC' },
          { nama: 'Ani', nim: '789012', jurusan: 'Informatika', status: 'ACC' }
        ],
        kerjaPraktik: [
          { nama: 'Siti', nim: '345678', jurusan: 'Sistem Informasi', status: 'ACC' },
          { nama: 'Andi', nim: '901234', jurusan: 'Sistem Informasi', status: 'ACC' }
        ],
        skripsi: [
          { nama: 'Joko', nim: '567890', jurusan: 'Teknik Komputer', status: 'ACC' },
          { nama: 'Dewi', nim: '123890', jurusan: 'Teknik Komputer', status: 'ACC' }
        ]
      };

      this.bimbinganData = data[this.selectedBimbingan];
    },
    toggleStatus(mahasiswa) {
      if (mahasiswa.status === 'ACC') {
        mahasiswa.status = 'Diterima';
      }
    },
    showRiwayat(nim) {
      const riwayatData = {
        '123456': [
          { tanggal: '2023-01-01', keterangan: 'Bimbingan 1' },
          { tanggal: '2023-01-15', keterangan: 'Bimbingan 2' }
        ],
        '789012': [
          { tanggal: '2023-02-01', keterangan: 'Bimbingan 1' },
          { tanggal: '2023-02-15', keterangan: 'Bimbingan 2' }
        ]
      };

      this.riwayatData = riwayatData[nim] || [];
      this.showRiwayatModal = true;
    },
    closeRiwayat() {
      this.showRiwayatModal = false;
      this.riwayatData = [];
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

.acc-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.acc-button.accepted {
  background-color: #ddd;
  color: #666;
  cursor: default;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.riwayat-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.riwayat-table th,
.riwayat-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.riwayat-table th {
  background-color: #f2f2f2;
}
</style>
